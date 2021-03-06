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

goog.provide( 'zz.app.controllers.FELayoutController' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.app.enums.CssClass' );

/**
 * Layout controller.
 * @param {zz.models.Dataset} model
 * @param {zz.views.FEBase} view
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.app.controllers.FELayoutController = function( model, view ){

    goog.base( this, model, view );
};
goog.inherits(
    zz.app.controllers.FELayoutController,
    zz.controllers.FEBase );

/**
 * Get view wrapper. Should return DOM element where View
 * controller will be rendered.
 * @return {Element}
 */
zz.app.controllers.FELayoutController.prototype.getViewWrapper = function( ){

    return goog.dom.getElement(
        zz.app.enums.CssClass.VIEW_WRAPPER );
};

/**
 * Add view controller.
 * @param {Function} viewCtrl
 */
zz.app.controllers.FELayoutController.prototype.setViewInternal = function( viewCtrl ){

    this.viewCtrl_ = new viewCtrl( );
    this.addChild( this.viewCtrl_, false );
    this.viewCtrl_.render( this.getViewWrapper( ) );
};

/**
 * Remove view controller.
 */
zz.app.controllers.FELayoutController.prototype.removeViewInternal = function( ){

    if( this.viewCtrl_ ){

        this.viewCtrl_.dispose( );
    }
};

/**
 * Set view controller.
 * @param {Function} constructorFn
 */
zz.app.controllers.FELayoutController.prototype.setViewController = function( constructorFn ){

    this.removeViewInternal( );
    this.setViewInternal( constructorFn );
};

/**
 * Return view controller.
 * @return {zz.controllers.FEBase}
 */
zz.app.controllers.FELayoutController.prototype.getViewController = function( ){

    return this.viewCtrl_;
};