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

goog.provide( 'zz.app.controllers.FEBaseLayout' );

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
 * @param {zz.controllers.FEBase} viewCtrl
 */
zz.app.controllers.FEBaseLayout.prototype.setView = function( viewCtrl ){

    this.removeViewInternal( );
    this.setViewInternal( viewCtrl );
};

/**
 * Add view.
 * @param {zz.controllers.FEBase} viewCtrl
 */
zz.app.controllers.FEBaseLayout.prototype.setViewInternal = function( viewCtrl ){

    this.addChild( viewCtrl, false );
    viewCtrl.render( this.getViewWrapper( ) );
    this.viewCtrl_ = viewCtrl;
};

/**
 * Remove view.
 */
zz.app.controllers.FEBaseLayout.prototype.removeViewInternal = function( ){

    this.viewCtrl_.dispose( );
};

/**
 * Get view wrapper.
 * @return {Element}
 */
zz.app.controllers.FEBaseLayout.prototype.getViewWrapper = function( ){

    return goog.dom.getElement( zz.app.enums.CssClass.VIEW_WRAPPER );
};