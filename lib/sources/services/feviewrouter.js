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

goog.provide( 'zz.app.services.FEViewRouter' );
goog.require( 'zz.app.services.FEBaseRouter' );
goog.require( 'goog.asserts' );

/**
 * Simplest router implementation.
 * @constructor
 * @extends {zz.app.services.FEBaseRouter}
 */
zz.app.services.FEViewRouter = function( ){

	goog.base( this );

	/**
	 * Active view controller.
	 * @type {zz.controllers.FEBase}
	 * @private
	 */
	this.viewController_ = null;
};
goog.inherits(
	zz.app.services.FEViewRouter,
	zz.app.services.FEBaseRouter );

goog.addSingletonGetter(
	zz.app.services.FEViewRouter );

/**
 * Process new route.
 * @param {Object} config
 * @override
 */
zz.app.services.FEViewRouter.prototype.processRoute = function( config ){

	if( !this.viewController_ ||
		!( this.viewController_ instanceof config.viewControllerConstructor ) ){

		if ( this.viewController_ ){

			this.viewController_.dispose( );
			this.viewController_ = undefined;
		}
		this.viewController_ = new config.viewControllerConstructor( );
	}
};

/**
 * Define route as string and related view controller
 * constructor.
 * @param {string} route
 * @param {Function} viewControllerConstructor
 * @returns {zz.app.services.FEBaseRouter}
 */
zz.app.services.FEViewRouter.prototype.when = function( route, viewControllerConstructor ){

	this.setRoute( route, { viewControllerConstructor: viewControllerConstructor } );
	return this;
};