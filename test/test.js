;( function( $ ) {
    $( function() {
        var target   = $('form');
        var validate = target.inputfollow( {
            'rules': {
                'name'     : 'required',
                'email'    : ['required', 'email'],
                'textarea' : ['number', 'required'],
                'number'   : 'number'
            }
        } );
    } );
} )( jQuery );