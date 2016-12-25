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

goog.provide( 'zz.app.controllers.FERLVRoot' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.app.enums.CssClass' );

/**
 * Application root controller.
 * @param {zz.models.Dataset} model
 * @param {zz.views.FEBase} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.app.controllers.FERLVRoot = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};
goog.inherits(
    zz.app.controllers.FERLVRoot,
    zz.controllers.FEBase );

/**
 * Get layout wrapper. Should return DOM element where Layout
 * controller will be rendered.
 * @return {Element}
 */
zz.app.controllers.FERLVRoot.prototype.getLayoutWrapper = function( ){

    return goog.dom.getElementByClass(
        zz.app.enums.CssClass.LAYOUT_WRAPPER );
};