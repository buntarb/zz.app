goog.provide( 'Tmp' );

var Tmp = class {

    constructor( height, width ){

        this.height = height;
        this.width = width;
    }
    calcArea( ){

        return this.height * this.width;
    }
};