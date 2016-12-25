/**
 * @fileoverview Provide zz.app.services.FERouter.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.app.services.FERouter' );

// GCL dependencies
goog.require( 'goog.dom' );
goog.require( 'goog.string' );
goog.require( 'goog.array' );
goog.require( 'goog.events');
goog.require( 'goog.History' );
goog.require( 'goog.Timer' );
goog.require( 'goog.history.Html5History' );
goog.require( 'goog.history.EventType' );

// IDK dependencies
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.events.Routed' );
goog.require( 'zz.services.BaseService' );

/**
 * Router class.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
zz.app.services.FERouter = function( ){

	goog.base( this );

	/**
	 * Envirinment service.
	 * @type {zz.environment.services.Environment}
	 * @private
	 */
	this.environment_ = zz.environment.services.Environment.getInstance( );

	/**
	 * Current route parameters.
	 * @type {Object}
	 */
	this.params = { };

	/**
	 * Current layout controller.
	 * @type {zz.controllers.FEBase}
	 * @private
	 */
	this.layout_ = undefined;

	/**
	 * Current view controller.
	 * @type {zz.controllers.FEBase}
	 * @private
	 */
	this.view_ = undefined;

	/**
	 * Routes settings.
	 * @type {Array}
	 * @private
	 */
	this.routes_ = [ ];

	/**
	 * Default url fragment.
	 * @type {string}
	 * @private
	 */
	this.defaultFragment_ = '';

	/**
	 * Current url fragment.
	 * @type {string}
	 * @private
	 */
	this.currentFragment_ = '';

	/**
	 * History event target object.
	 * @type {goog.history.Html5History|goog.History}
	 * @private
	 */
	this.history_ = goog.history.Html5History.isSupported( ) ?

		new goog.history.Html5History( ) :
		new goog.History( );

	/**
	 * Resize Timer id.
	 * @type {number}
	 * @private
	 */
	this.processingDelayId_;

	/**
	 * Browser history stack
	 * @type {Array}
	 * @private
	 */
	this.historyStack_ = [ ];

	/**
	 * Browser history stack for forward
	 * @type {Array}
	 * @private
	 */
	this.historyStackForward_ = [ ];

	if( this.history_.setUseFragment ){

		this.history_.setUseFragment( true );
	}
	this.history_.setEnabled( true );
	goog.events.listen(

		this.history_,
		goog.history.EventType.NAVIGATE,
		this.onChange_,
		false,
		this
	);
	goog.events.listen(

		this.environment_,
		zz.environment.enums.EventType.RESIZE,
		function( ){

			if( ~this.processingDelayId_ ){

				goog.Timer.clear( this.processingDelayId_ );
			}
			this.processingDelayId_ = goog.Timer.callOnce( this.onChange_, 150, this );
		},
		false,
		this
	);
};
goog.inherits( zz.app.services.FERouter, zz.services.BaseService );
goog.addSingletonGetter( zz.app.services.FERouter );

/**
 * Run route callback if route regexp matches fragment.
 * @param {Object} route
 * @param {string} fragment
 * @returns {boolean}
 * @private
 */
zz.app.services.FERouter.prototype.runRouteIfMatches_ = function( route, fragment ){

	// Clear params object.
	this.params = { };

	var args = route.route.exec( fragment );
	if( args ){

		// If route with params updating parameters object.
		if( route.params ){

			goog.array.forEach( route.params, function( param, index ){

				this.params[ param ] = args[ index + 1 ];

			}, this );
		}

		// If layout specified running router.
		if( route.layout ){

			if( !this.layout_ || route.layout !== this.layoutConstructor_ ){

				if ( this.layout_ ) {

					this.layout_.dispose( );
					this.layout_ = undefined;
					this.layoutConstructor_ = undefined;
				}

				// Setting up layout.
				this.layout_ = new route.layout( );
				this.layoutConstructor_ = route.layout;
			}
			this.layout_.setView( route.view );
		}
		if( route.callback ){

			route.callback.apply( route.context, args );
		}
		return true;
	}
	return false;
};

/**
 * History change events listener.
 * @private
 */
zz.app.services.FERouter.prototype.onChange_ = function( ){

	var fragment = this.history_.getToken( );

	if( fragment === goog.array.last( this.historyStack_ ) ){

		goog.array.removeLast( this.historyStack_, fragment );
		this.historyStackForward_.push(  this.currentFragment_ );

	}else if( fragment === goog.array.last( this.historyStackForward_ ) ){

		goog.array.removeLast( this.historyStackForward_, fragment );
		this.historyStack_.push(  this.currentFragment_ );

	}else{

		this.historyStack_.push(  this.currentFragment_ );
		goog.array.removeLast( this.historyStackForward_, this.currentFragment_ );
	}
	// TODO (buntarb): some globals here?
	if( true /*fragment !== this.currentFragment_*/ ){

		this.dispatchEvent( new zz.environment.events.Routed( this.currentFragment_, fragment ) );
		this.currentFragment_ = fragment;
		var isRouted = goog.array.find( this.routes_, function( route ){

			return this.runRouteIfMatches_( route, fragment );

		}, this );
		if( !isRouted ){

			this.setFragment( this.defaultFragment_ );
		}
	}

};

/**
 * Pass through the fragment for the URL.
 * @param {string} fragment
 */
zz.app.services.FERouter.prototype.setFragment = function( fragment ){

	this.history_.setToken( fragment );
};

/**
 * Returns current routed fragment.
 * @return {string}
 */
zz.app.services.FERouter.prototype.getFragment = function( ){

	return this.currentFragment_;
};

/**
 * Define route as string or regex.
 * @param {string|RegExp} route
 * @param {zz.controllers.FEBase=} opt_layoutCtrl
 * @param {zz.controllers.FEBase=} opt_viewCtrl
 * @param {Function=} opt_callback
 * @param {Object=} opt_context
 * @returns {zz.app.services.FERouter}
 */
zz.app.services.FERouter.prototype.when = function( route, opt_layoutCtrl, opt_viewCtrl, opt_callback, opt_context ){

	if( goog.isString( route ) ){

		var parsed = new RegExp( '^' + goog.string.regExpEscape( route )

				.replace( /\\:\w+/g, '([a-zA-Z0-9._-]+)' )
				.replace( /\\\*/g, '(.*)' )
				.replace( /\\\[/g, '(' )
				.replace( /\\\]/g, ')?' )
				.replace( /\\\{/g, '(?:' )
				.replace( /\\\}/g, ')?' ) + '$' );

		var paramsNames = route.match(/\:\w+/ig);
	}
	var completeRoute = {

		params: false,
		route: parsed,
		layout: opt_layoutCtrl,
		view: opt_viewCtrl,
		callback: opt_callback,
		context: opt_context
	};
	if( paramsNames ){

		completeRoute.params = [ ];
		goog.array.forEach( paramsNames, function( name ){

			completeRoute.params.push( name.replace( ':', '' ) );
		} );
	}
	this.routes_.push( completeRoute );
	return this;
};

/**
 * Fragment for default path.
 * @param {string} defaultFragment
 * @returns {zz.app.services.FERouter}
 */
zz.app.services.FERouter.prototype.otherwise = function( defaultFragment ){

	this.defaultFragment_ = defaultFragment;
	return this;
};

/**
 * Bootstrap router.
 */
zz.app.services.FERouter.prototype.bootstrap = function( ){

	var fragment = this.history_.getToken( );
	this.currentFragment_ = fragment;
	goog.array.find( this.routes_ || [ ], function( route ){

		return this.runRouteIfMatches_( route, fragment );

	}, this );
};

/**
 * Change rout to previous.
 */
zz.app.services.FERouter.prototype.back = function( ){

	this.setFragment( goog.array.last( this.historyStack_) );
	return this.historyStack_.length;
};

/**
 * Change rout to next.
 */
zz.app.services.FERouter.prototype.forward = function( ){

	this.setFragment( goog.array.last( this.historyStackForward_) );
	return this.historyStackForward_.length;
};

/**
 * Get history stack.
 */
zz.app.services.FERouter.prototype.getHistoryStack = function( ){

	return this.historyStack_;
};

/**
 * Get history stack for forward.
 */
zz.app.services.FERouter.prototype.getHistoryStackForward = function( ){

	return this.historyStackForward_;
};