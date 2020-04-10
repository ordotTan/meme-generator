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
      

  function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}
