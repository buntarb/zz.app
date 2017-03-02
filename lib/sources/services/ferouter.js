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

goog.provide( 'zz.app.services.FERouter' );
goog.require( 'goog.asserts' );
goog.require( 'zz.app.services.FEBaseRouter' );

/**
 * Router for {@code RootController::LayoutController::ViewController}
 * application structure. Both - Layout and View are added to each
 * route. View is a child component for Layout which have public method
 * to change view (logic of changing View should be described in Layout).
 * Depend of route, Layout could be changed or not or Layout could change
 * View (described public method of Layout used for this).
 *
 * This structure is common for most Web application. It means, that
 * you can encapsulate some common ui stuff (header, navigation menu,
 * footer, modals etc.) in Layout, and only specific for current view
 * ui will be encapsulated in each your View.
 *
 * @constructor
 * @extends {zz.app.services.FEBaseRouter}
 */
zz.app.services.FERouter = function( ){

	goog.base( this );

	/**
	 * Active layout controller.
	 * @type {zz.controllers.FEBase}
	 * @private
	 */
	this.layoutController_ = null;

	/**
	 * Active view controller.
	 * @type {zz.controllers.FEBase}
	 * @private
	 */
	this.viewController_ = null;
};
goog.inherits(
	zz.app.services.FERouter,
	zz.app.services.FEBaseRouter );

goog.addSingletonGetter(
	zz.app.services.FERouter );

/**
 * Set root application controller.
 * @param {zz.app.controllers.FERootController} rootController
 */
zz.app.services.FERouter.prototype.setRootController = function( rootController ){

	/**
	 * Root application controller.
	 * @type {zz.app.controllers.FERootController}
	 */
	this.rootController_ = rootController;
};

//noinspection JSUnusedGlobalSymbols
/**
 * Define route as string and related view controller constructor.
 * constructor.
 * @param {string} route
 * @param {Function} layoutControllerConstructor
 * @param {Function} viewControllerConstructor
 * @returns {zz.app.services.FEBaseRouter}
 */
zz.app.services.FERouter.prototype.when = function(
	route, layoutControllerConstructor, viewControllerConstructor ){

	if( goog.DEBUG ){

		goog.asserts.assertFunction(
			layoutControllerConstructor,
			'zz.app.services.FERouter#when: ' +
			'layoutControllerConstructor should ' +
			'be View constructor function.' );

		goog.asserts.assertFunction(
			viewControllerConstructor,
			'zz.app.services.FERouter#when: ' +
			'viewControllerConstructor should ' +
			'be View constructor function.' );
	}
	this.setRoute( route, {

		layoutControllerConstructor: layoutControllerConstructor,
		viewControllerConstructor: viewControllerConstructor
	} );
	return this;
};

/**
 * Process new route.
 * @param {Object} config
 * @override
 */
zz.app.services.FERouter.prototype.processRoute = function( config ){

	if( !this.layoutController_ ||
		!( this.layoutController_ instanceof config.layoutControllerConstructor ) ){

		if ( this.layoutController_ ){

			this.layoutController_.dispose( );
			this.layoutController_ = undefined;
		}
		this.layoutController_ = new config.layoutControllerConstructor( );
		this.rootController_.addChild( this.layoutController_, false );
		this.layoutController_.render( this.rootController_.getLayoutWrapper( ) );
	}
	if( !this.viewController_ ||
		!( this.viewController_ instanceof config.viewControllerConstructor ) ){

		this.layoutController_.setViewController( config.viewControllerConstructor );
	}
};