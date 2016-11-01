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

goog.provide( 'zz.app.FEBaseLayout' );

goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.app.enums.CssClass' );

/**
 * Layout controller.
 * @param {zz.models.Dataset} model
 * @param {zz.views.FEBase} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Layout = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    zz.environment.services.Environment.getInstance( )

        .getRootController( )
        .addChild( this, true );
};

goog.inherits( zz.ide.controllers.Layout, zz.controllers.FEBase );


/**
 * Set view.
 * @param {zz.views.FEBase} view
 */
zz.app.FEBaseLayout.prototype.setView = function( view ){

    this.removeViewInternal( );
    this.setViewInternal( view );

};

/**
 * Add view.
 * @param {zz.views.FEBase} view
 */
zz.app.FEBaseLayout.prototype.setViewInternal = function( view ){

    this.addChild( view );
    view.render( zz.app.enums.CssClass.VIEW_WRAPPER );
};

/**
 * Remove view.
 */
zz.app.FEBaseLayout.prototype.removeViewInternal = function( ){

    this.removeChild( );
};