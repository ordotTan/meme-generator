'use strict'

function sumObjectMap( objectMap ) {
    var sum = 0;
    for( var el in objectMap ) {
      if( objectMap.hasOwnProperty( el ) ) {
        sum += parseFloat( objectMap[el] );
      }
    }
    return sum;
  }
      