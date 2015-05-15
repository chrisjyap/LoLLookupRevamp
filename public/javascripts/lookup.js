/**
 * Created by Chris on 5/15/2015.
 */
$(document).ready(function(){

    $('button').click(function(e){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/users');
        xhr.send('{}');
    });

});