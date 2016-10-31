/**
* @fileoverview Provide zz.app base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.app' );
goog.require( 'Tmp' );

/**
* Base namespace for zz.app module.
* @const
*/
zz.app = zz.app || { };

/**
* Bootstrap module method.
*/
zz.app.bootstrap = function( ){

    var tmp = new Tmp( 2, 2 );
    console.log( tmp );
    console.log( tmp.calcArea( ) );
};
goog.exportSymbol( 'zz.app.bootstrap', zz.app.bootstrap );