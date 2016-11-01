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

goog.provide( 'zz.app.FEBaseApplication' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.app.services.FEBaseRouter' );

/**
 * Application controller.
 * @param {zz.models.Dataset} model
 * @param {zz.views.FEBase} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.app.FEBaseApplication = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.wsc_ = new zz.net.WebSocketClient( );
    this.router_ = zz.app.services.FEBaseRouter.getInstance( );
    this.router_.bootstrap( );
};

goog.inherits( zz.app.FEBaseApplication, zz.controllers.FEBase );

/**
 * Get web socket client.
 * @return {zz.net.WebSocketClient}
 */
zz.app.FEBaseApplication.prototype.getWSClient = function( ){

    return this.wsc_;
};

/**
 * Get router.
 * @return {zz.app.services.FEBaseRouter}
 */
zz.app.FEBaseApplication.prototype.getRouter = function( ){

    return this.router_;
};


