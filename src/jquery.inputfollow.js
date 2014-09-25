/**
 * jquery.inputfollow.js
 *
 * @version 1.0.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.inputfollow.js
 */

;( function( $, U ) {

    var
        IS_VALID = true,
        IS_LIMIT = false;

    $.extend( {
        'inputfollow': {
            'index': 0,
            'collection': [],
            'rules': {
                'required': IS_VALID,
                'email':    IS_VALID,
                'number':   IS_LIMIT,
                'code':     IS_LIMIT
            },
            'model': function( wrap ) {
                this.wrap   = wrap;
                this.length = 0;
                this.errors = 0;
                this.rules  = {};
                this.target = {};
            },
            'method': function( target ) {
                var that         = this;
                this.model       = new $.inputfollow.model( target );
                this.error_class = 'error';
                this.valid_class = 'valid';
                this.on_validate = function() {};
                this.on_success  = function() {};
                this.on_error    = function() {};

                target.submit( function() {
                    if ( that.model.errors <= 0 ) {
                        if( typeof that.on_success === 'function' )
                            that.on_success();
                        return true;
                    } else {
                        if( typeof that.on_error === 'function' )
                            that.on_error();
                        return false;
                    }
                } );
            },
            '_check_handler': function( mode, target ) {
                switch( mode ) {
                    case 'required':
                        return $.inputfollow._check_method._required( target );
                        break;
                    case 'email':
                        return $.inputfollow._check_method._email( target );
                        break;
                    case 'number':
                        return $.inputfollow._check_method._number( target );
                        break;
                    case 'code':
                        return $.inputfollow._check_method._code( target );
                        break;
                }

                return true;
            },
            '_check_method': {
                '_required': function( target ) {
                    switch( true ) {
                        case target.is( '[type="radio"]' ):
                        case target.is( '[type="checkbox"]' ):
                            return ( target.filter( ':checked' ).length > 0 );
                            break;
                        default:
                            return target.val() != '';
                            break;
                    }
                },
                '_email': function( target ) {
                    return /^([a-z0-9_]|\-|\.|\+)+@(([a-z0-9_]|\-)+\.)+[a-z]{2,6}$/.test( target.val() );
                },
                '_number': function( target ) {
                    var val = target.val();
                    var org = val;
                    // 全角 -> 半角
                    val = val.replace( /[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                        return String.fromCharCode( s.charCodeAt(0) - 0xFEE0 );
                    } );
                    // 数字以外を削除
                    val = val.replace( /[^0-9]/g, '' );
                    if( val !== org ) {
                        target.val( val );
                        if( target.is( ':focus' ) ) {
                            var pos = val.length - target.data( 'before_val' ).length + target.data( 'caret_pos' );

                            if ( document.selection !== U ) {
                                var range = target.get(0).createTextRange();
                                range.move( 'character', pos );
                                range.select();
                            } else {
                                try {
                                    target.get(0).setSelectionRange( pos, pos );
                                } catch( e ) {
                                    // Chrome...
                                }
                            }
                        }
                    }
                    return true;
                },
                '_code': function( target ) {
                    var val = target.val();
                    var org = val;
                    // 全角 -> 半角
                    val = val.replace( /[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                        return String.fromCharCode( s.charCodeAt(0) - 0xFEE0 );
                    } );
                    val = val.replace( /[−ーー―]/g, '-' );
                    // 数字以外を削除
                    val = val.replace( /[^0-9_-]/g, '' );
                    if( val !== org ) {
                        target.val( val );
                        if( target.is( ':focus' ) ) {
                            var pos = val.length - target.data( 'before_val' ).length + target.data( 'caret_pos' );

                            if ( document.selection !== U ) {
                                var range = target.get(0).createTextRange();
                                range.move( 'character', pos );
                                range.select();
                            } else {
                                try {
                                    target.get(0).setSelectionRange( pos, pos );
                                } catch( e ) {
                                    // Chrome...
                                }
                            }
                        }
                    }
                    return true;
                }
            },
            '_get_caret_pos': function( target ) {
                if ( document.selection !== U ) {
                    var range = document.selection.createRange(),
                        tmp   = document.body.createTextRange();
                    try {
                        tmp.moveToElementText(target);
                        tmp.setEndPoint('StartToStart', range);
                    } catch (e) {
                        tmp = target.createTextRange();
                        tmp.setEndPoint('StartToStart', range);
                    }

                    return target.value.length - tmp.text.length;
                } else {
                    try {
                        return target.selectionStart;
                    } catch( e ) {
                        return 0;
                    }
                }
            }
        }
    } );
    $.inputfollow.model.prototype = {
        'set_rules': function( rules ) {
            var that = this;
            $.each( rules, function( key ) {
                that.rules[ key ] = rules[ key ];
            } );

            for( key in this.rules ) {
                this.target[ key ] = this.wrap.find( 'input,select,textarea' ).filter( '[name="'+key+'"]' ).data( 'is_inputfollow', true );
            }
        }
    };
    $.inputfollow.method.prototype = {
        'init': function( param ) {
            var that = this;

            if( param.rules )
                this.set_rules( param.rules );
            if( param.valid_class )
                this.set_valid_class( param.valid_class );
            if( param.on_validate )
                this.set_on_validate( param.on_validate );

            this.set_event();
            this.validate_all();
        },
        'set_rules': function( rules ) {
            this.model.set_rules( rules );
        },
        'set_valid_class': function( valid_class ) {
            this.valid_class = valid_class;
        },
        'set_on_validate': function( func ) {
            if( typeof func === 'function' )
                this.on_validate = func;
        },
        'set_on_success': function( func ) {
            if( typeof func === 'function' )
                this.on_success = func;
        },
        'set_on_error': function( func ) {
            if( typeof func === 'function' )
                this.on_error = func;
        },
        'set_event': function() {
            var that = this;
            this.model.wrap.find( 'input,select,textarea' )
                .unbind( 'keydown.inputfollow' )
                .bind(   'keydown.inputfollow', function() {
                    that.validate_before( $(this) );
                } );
            this.model.wrap.find( 'input,select,textarea' )
                .unbind( 'click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow' )
                .bind(   'click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow', function() {
                    that.validate( $(this) );
                } );
        },
        'validate_before': function( target ) {
            if(! target.data( 'is_inputfollow' ) && target.is(':focus') )
                return;

            target.data( 'before_val', target.val() );
            target.data( 'caret_pos', $.inputfollow._get_caret_pos( target.get(0) ) );
        },
        'validate': function( target ) {
            if(! target.data( 'is_inputfollow' ) )
                return;

            this.validate_all();
        },
        'validate_all': function() {
            var that = this;

            this.model.errors = 0;
            $.each( this.model.target, function( key ) {
                var target = that.model.target[ key ];
                var rules  = that.model.rules[ key ];
                var flag   = true;
                var check  = false;

                if( target.length ) {
                    if( $.isArray( rules ) ) {
                        $.each( rules, function( k ) {
                            check = check || $.inputfollow.rules[ rules[k] ] ? true : false;
                            flag  = flag  && $.inputfollow._check_handler( rules[k], target ) ? true : false;
                        } );
                    } else {
                        check = $.inputfollow.rules[ rules ];
                        flag  = $.inputfollow._check_handler( rules, target );
                    }
                }

                if( check ) {
                    if( flag ) {
                        target.addClass( that.valid_class ).removeClass( that.error_class );
                    } else {
                        that.model.errors ++;
                        target.removeClass( that.valid_class ).addClass( that.error_class );
                    }
                }

            } );

            if( typeof this.on_validate === 'function' )
                this.on_validate();
        },
        'get_errors': function() {
            return this.model.errors;
        }
    };

    $.fn.extend( {
        'inputfollow': function( param ) {
            if(! $(this).length )
                return;
            var method = null;

            if(! $(this).data( 'inputfollow_id' ) ) {
                var index = $.inputfollow.index;
                $(this).data( 'inputfollow_id', index );
                $.inputfollow.index ++;

                method = new $.inputfollow.method( $(this) );

                $.inputfollow.collection[ index ] = method;
            } else {
                method = $.inputfollow.collection[ $(this).data( 'inputfollow_id' ) ];
            }

            if( param )
                method.init( param );

            return method;
        }
    } );

} )( jQuery );