;( function( $ ) {
    $( function() {
        var target   = $('form');
        var validate = target.inputfollow( {
            'rules': {
                'name'     : 'required',
                'email'    : ['required', 'email'],
                'textarea' : 'required',
                'number'   : 'number'
            }
        } );
    } );
} )( jQuery );