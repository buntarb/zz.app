// Copyright 2016 Artem Lytvynov <buntarb@gmail.com>. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.app.services.FEBaseRouter' );

// GCL dependencies
goog.require( 'goog.string' );
goog.require( 'goog.array' );
goog.require( 'goog.events');
goog.require( 'goog.asserts' );
goog.require( 'goog.History' );
goog.require( 'goog.history.Html5History' );
goog.require( 'goog.history.EventType' );

// IDK dependencies
goog.require( 'zz.environment.events.Routed' );
goog.require( 'zz.services.BaseService' );

/**
 * Router class.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
zz.app.services.FEBaseRouter = function( ){

	goog.base( this );

	/**
	 * Routes settings.
	 * @type {Array}
	 * @private
	 */
	this.routes_ = [ ];

	/**
	 * Current route parameters.
	 * @type {Object}
	 */
	this.params = { };

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
};
goog.inherits( zz.app.services.FEBaseRouter, zz.services.BaseService );
goog.addSingletonGetter( zz.app.services.FEBaseRouter );

/**
 * Run route callback if route regexp matches fragment.
 * @param {Object} config
 * @param {string} fragment
 * @returns {boolean}
 * @private
 */
zz.app.services.FEBaseRouter.prototype.runRouteIfMatches_ = function( config, fragment ){

	// Clear params object.
	this.params = { };
	var args = config.route.exec( fragment );
	if( args ){

		// If route with params updating parameters object.
		if( config.params ){

			goog.array.forEach( config.params, function( param, index ){

				this.params[ param ] = args[ index + 1 ];

			}, this );
		}
		this.processRoute( config );
		return true;
	}
	return false;
};

/**
 * History change events listener.
 * @private
 */
zz.app.services.FEBaseRouter.prototype.onChange_ = function( ){

	var prevFragment = this.currentFragment_;
	this.currentFragment_ = this.history_.getToken( );
	var isRouted = goog.array.find( this.routes_, function( route ){

		return this.runRouteIfMatches_( route, this.currentFragment_ );

	}, this );
	this.dispatchEvent(

		new zz.environment.events.Routed(

			prevFragment,
			this.currentFragment_ ) );

	if( !isRouted ){

		this.setFragment( this.defaultFragment_ );
	}
};

/**
 * Set default fragment to router.
 * @param {string} fragment
 */
zz.app.services.FEBaseRouter.prototype.setDefaultFragment = function( fragment ){

	this.defaultFragment_ = fragment;
};

/**
 * Pass through the fragment for the URL.
 * @param {string} fragment
 */
zz.app.services.FEBaseRouter.prototype.setFragment = function( fragment ){

	this.history_.setToken( fragment );
};

/**
 * Returns current routed fragment.
 * @return {string}
 */
zz.app.services.FEBaseRouter.prototype.getFragment = function( ){

	return this.currentFragment_;
};

/**
 *
 * @param {string} route
 * @param {Object} config
 */
zz.app.services.FEBaseRouter.prototype.setRoute = function( route, config ){

	goog.asserts.assertString( route );
	var parsed = new RegExp( '^' + goog.string.regExpEscape( route )

			.replace( /\\:\w+/g, '([a-zA-Z0-9._-]+)' )
			.replace( /\\\*/g, '(.*)' )
			.replace( /\\\[/g, '(' )
			.replace( /\\\]/g, ')?' )
			.replace( /\\\{/g, '(?:' )
			.replace( /\\\}/g, ')?' ) + '$' );

	var paramsNames = route.match(/\:\w+/ig);
	config.params = false;
	config.route = goog.isString( route ) ? parsed : route;
	if( paramsNames ){

		config.params = [ ];
		goog.array.forEach( paramsNames, function( name ){

			config.params[ config.params.length ] = name.replace( ':', '' );
		} );
	}
	this.routes_[ this.routes_.length ] = config;
};

/**
 * This method will be called after new {@code fragment} will be
 * parsed and all parameters extracted. {@code config} parameter
 * is the same object which was passed to
 * {@code zz.app.services.FEBaseRouter#setRoute} method, but it also
 * contain {@code route} and {@code params} properties (RegExp for
 * fragments and parameters names array). By default do nothing.
 * Should be override in child classes.
 * @param {Object} config
 */
zz.app.services.FEBaseRouter.prototype.processRoute = function( config ){ };

/**
 * Proxy function for {@code zz.app.services.FEBaseRouter#setRoute}
 * with chain support. Should be override in children class.
 * @param {string} route
 * @returns {zz.app.services.FEBaseRouter}
 */
zz.app.services.FEBaseRouter.prototype.when = function( route ){

	this.setRoute( route, { } );
	return this;
};

/**
 * Proxy function for {@code zz.app.services.FEBaseRouter#setDefaultFragment}
 * with chain support.
 * @param {string} defaultFragment
 * @returns {zz.app.services.FEBaseRouter}
 */
zz.app.services.FEBaseRouter.prototype.otherwise = function( defaultFragment ){

	this.setDefaultFragment( defaultFragment );
	return this;
};

/**
 * Bootstrap router.
 */
zz.app.services.FEBaseRouter.prototype.bootstrap = function( ){

	var fragment = this.history_.getToken( );
	this.currentFragment_ = fragment;
	goog.array.find( this.routes_ || [ ], function( route ){

		return this.runRouteIfMatches_( route, fragment );

	}, this );
};