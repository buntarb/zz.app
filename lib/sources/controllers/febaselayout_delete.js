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

goog.require( 'zz.controllers.FEBase' );
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
zz.app.controllers.FEBaseLayout = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .addChild( this, false );

    this.render( zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutWrapper( ) );
};

goog.inherits( zz.app.controllers.FEBaseLayout, zz.controllers.FEBase );


/**
 * Set view.
 * @param {Function} viewCtrl
 */
zz.app.controllers.FEBaseLayout.prototype.setView = function( viewCtrl ){

    this.removeViewInternal( );
    this.setViewInternal( viewCtrl );
};

/**
 * Add view.
 * @param {Function} viewCtrl
 */
zz.app.controllers.FEBaseLayout.prototype.setViewInternal = function( viewCtrl ){


    this.viewCtrl_ = new viewCtrl( );
    this.addChild( this.viewCtrl_, false );
    this.viewCtrl_.render( this.getViewWrapper( ) );
};

/**
 * Remove view.
 */
zz.app.controllers.FEBaseLayout.prototype.removeViewInternal = function( ){

    if( this.viewCtrl_ ){

        this.viewCtrl_.dispose( );
    }
};

/**
 * Get view wrapper.
 * @return {Element}
 */
zz.app.controllers.FEBaseLayout.prototype.getViewWrapper = function( ){

    return goog.dom.getElement( zz.app.enums.CssClass.VIEW_WRAPPER );
};

/**
 * Return application layout.
 * @return {zz.controllers.FEBase}
 */
zz.app.controllers.FEBaseLayout.prototype.getViewController = function( ){

    return this.viewCtrl_;
};