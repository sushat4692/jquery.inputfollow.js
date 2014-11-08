;( function( $ ) {
    $( function() {
        var target   = $('form');
        var validate = target.inputfollow( {
            'rules': {
                'name'     : 'required',
                'email'    : ['required', 'email'],
                'textarea' : 'required',
                'number'   : 'number',
                'orreq01'  : 'required_or_orreq02',
                'andreq01' : 'required_and_andreq02'
            },
            'messages': {
                'name'     : { 'required': 'Name is Required.' },
                'email'    : { 'required': 'E-mail is Required.', 'email': 'E-mail is Invalid.' },
                'textarea' : { 'required': 'Textarea Required is Required.' },
                'orreq01'  : { 'required_or_orreq02': 'Input "or required" 01 or 02 is Required.' },
                'andreq01' : { 'required_and_andreq02': 'Input "and required" 01 and 02 is Required.' }
            }
        } );
    } );
} )( jQuery );