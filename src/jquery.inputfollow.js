/**
 * jquery.inputfollow.js
 *
 * @version 1.0.3
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
                this.wrap      = wrap;
                this.length    = 0;
                this.errors    = 0;
                this.error_mes = 0;
                this.rules     = {};
                this.target    = {};
                this.messages  = {};
            },
            'method': function( target, index ) {
                var that         = this;
                this.index       = index;
                this.model       = new $.inputfollow.model( target );
                this.error_class = 'error';
                this.valid_class = 'valid';
                this.initial_error_view = false;
                this.on_validate = function() {};
                this.on_success  = function() {};
                this.on_error    = function() {};

                target.submit( function() {
                    if ( that.model.errors <= 0 ) {
                        if( $.isFunction( that.on_success ) )
                            that.on_success();
                        return true;
                    } else {
                        if( $.isFunction( that.on_error ) )
                            that.on_error( that.model.error_mes );
                        return false;
                    }
                } );
            },
            '_check_rules': function( rule ) {
                if( $.inputfollow.rules[ rule ] ) {
                    return $.inputfollow.rules[ rule ];
                }

                var match;
                if( match = rule.match( /^(.*?)_(or|and)_.*$/i ) ) {
                    if( $.inputfollow.rules[ match[1] ] ) {
                        return $.inputfollow.rules[ match[1] ];
                    }
                }

                return -1;
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
                this.target[ key ] = this.wrap.find( 'input,select,textarea' ).filter( '[name="'+key+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).unbind( 'focus.inputfollow_focus' ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );

                var match;
                if( $.isArray( this.rules[ key ] ) ) {
                    for( var i=0, l=this.rules[ key ].length; i<l; i++ ) {
                        $.each( this.rules[ key ][i].split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 ), function( key, val ) {
                            that.target[ val ] = that.wrap.find( 'input,select,textarea' ).filter( '[name="'+val+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).unbind( 'focus.inputfollow_focus' ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );
                        } );
                    }
                } else {
                    $.each( this.rules[ key ].split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 ), function( key, val ) {
                        that.target[ val ] = that.wrap.find( 'input,select,textarea' ).filter( '[name="'+val+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).unbind( 'focus.inputfollow_focus' ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );
                    } );
                }
            }
        },
        'reset_rules': function() {
            this.wrap.find( 'input,select,textarea' ).unbind( 'focus.inputfollow_focus' );

            for( key in this.rules ) {
                this.target[ key ] = this.wrap.find( 'input,select,textarea' ).filter( '[name="'+key+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );

                var match;
                if( $.isArray( this.rules[ key ] ) ) {
                    for( var i=0, l=this.rules[ key ].length; i<l; i++ ) {
                        $.each( this.rules[ key ][i].split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 ), function( key, val ) {
                            that.target[ val ] = that.wrap.find( 'input,select,textarea' ).filter( '[name="'+val+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );
                        } );
                    }
                } else {
                    $.each( this.rules[ key ].split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 ), function( key, val ) {
                        that.target[ val ] = that.wrap.find( 'input,select,textarea' ).filter( '[name="'+val+'"]' ).data( 'is_inputfollow', true ).data( 'is_focused', false ).bind( 'focus.inputfollow_focus', this.enable_focus_flag );
                    } );
                }
            }
        },
        'set_messages': function( messages ) {
            var that = this;
            $.each( messages, function( key ) {
                that.messages[ key ] = messages[ key ];
            } );
        },
        'enable_focus_flag': function() {
            $(this).data( 'is_focused', true );
        }
    };
    $.inputfollow.method.prototype = {
        'init': function( param ) {
            var that = this;

            if( param.rules )
                this.set_rules( param.rules );
            if( param.messages )
                this.set_messages( param.messages );
            if( param.error_class )
                this.set_error_class( param.error_class );
            if( param.valid_class )
                this.set_valid_class( param.valid_class );
            if( param.initial_error_view )
                this.set_initial_error_view( param.initial_error_view );
            if( param.on_validate )
                this.set_on_validate( param.on_validate );
            if( param.on_success )
                this.set_on_success( param.on_success );
            if( param.on_error )
                this.set_on_error( param.on_error );

            this.set_event();
            this.validate_all();
        },
        'set_rules': function( rules ) {
            this.model.set_rules( rules );
        },
        'set_messages': function( messages ) {
            this.model.set_messages( messages );
        },
        'set_error_class': function( error_class ) {
            this.error_class = error_class;
        },
        'set_valid_class': function( valid_class ) {
            this.valid_class = valid_class;
        },
        'set_initial_error_view': function( initial_error_view ) {
            this.initial_error_view = initial_error_view;
        },
        'set_on_validate': function( func ) {
            if( $.isFunction( func ) )
                this.on_validate = func;
        },
        'set_on_success': function( func ) {
            if( $.isFunction( func ) )
                this.on_success = func;
        },
        'set_on_error': function( func ) {
            if( $.isFunction( func ) )
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

            this.model.errors    = 0;
            this.model.error_mes = '';
            $.each( this.model.target, function( key ) {
                var rules  = that.model.rules[ key ];
                if(! rules ) {
                    return;
                }
                var sub_target_rules = [];

                var target = that.model.target[ key ];
                var flag   = true;
                var check  = false;
                var error  = null;
                var err_id = 'inputfollow-error-'+that.index+'-'+key.replace( '[]', '' );

                if( target.length ) {
                    if( $.isArray( rules ) ) {
                        $.each( rules, function( k ) {
                            var tcheck = $.inputfollow._check_rules( rules[k] );
                            check = check || tcheck ? IS_VALID : IS_LIMIT;
                            if( tcheck === IS_VALID ) {
                                sub_target_rules.push( rules[k] );
                            }
                            if(! that.check_handler( rules[k], target ) ) {
                                flag = false;
                                if( error === null ) {
                                    if(
                                        Object.prototype.hasOwnProperty.call( that.model.messages, key ) &&
                                        Object.prototype.hasOwnProperty.call( that.model.messages[ key ], rules[k] )
                                    ) {
                                        error = that.model.messages[ key ][ rules[k] ];
                                    }
                                }
                            }
                        } );
                    } else {
                        check = $.inputfollow._check_rules( rules );
                        flag  = that.check_handler( rules, target );
                        if( check === IS_VALID ) {
                            sub_target_rules.push( rules );
                        }
                        if(
                            Object.prototype.hasOwnProperty.call( that.model.messages, key ) &&
                            Object.prototype.hasOwnProperty.call( that.model.messages[ key ], rules )
                        ) {
                            error = that.model.messages[ key ][ rules ];
                        }
                    }
                }

                if( check === IS_VALID ) {
                    if( flag ) {
                        target.addClass( that.valid_class ).removeClass( that.error_class );

                        // 連動入力フォームからもエラークラスを外す
                        $.each( sub_target_rules, function( si, sv ) {
                            var sub_targets = sv.split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 );
                            for( var i=0, l=sub_targets.length; i<l; i++ ) {
                                that.model.target[ sub_targets[i] ].addClass( that.valid_class ).removeClass( that.error_class );
                            }
                        } );

                        // エラーメッセージ削除
                        $( '#'+err_id ).remove();
                    } else {
                        that.model.errors ++;
                        target.removeClass( that.valid_class ).addClass( that.error_class );

                        // 連動入力フォームにもエラークラスを付ける
                        $.each( sub_target_rules, function( si, sv ) {
                            var sub_targets = sv.split( '_and_' ).join( '_or_' ).split( '_or_' ).slice( 1 );
                            for( var i=0, l=sub_targets.length; i<l; i++ ) {
                                that.model.target[ sub_targets[i] ].removeClass( that.valid_class ).addClass( that.error_class );
                            }
                        } );

                        // エラーメッセージ表示
                        $( '#'+err_id ).remove();
                        if( error !== null ) {
                            that.model.error_mes += '\n'+error;
                            if( target.data( 'is_focused' ) || that.initial_error_view ) {
                                target.eq( 0 ).after( $( '<span>', { 'id': err_id, 'class': 'inputfollow-error' } ).text( error ) );
                            }
                        }
                    }
                }

            } );

            if( typeof this.on_validate === 'function' )
                this.on_validate();
        },
        'get_errors': function() {
            return this.model.errors;
        },
        'check_handler': function( mode, target ) {
            var handler = $.inputfollow._check_method[ '_'+mode ];
            if( $.isFunction( handler ) ) {
                return handler( target );
            } else {
                var match;
                var sub = null;



                if( match = mode.match( /^(.*?)_or_.*$/i ) ) {
                    handler = $.inputfollow._check_method[ '_'+match[1] ];
                    if( $.isFunction( handler ) ) {
                        var flag = handler( target );

                        var sub_targets = mode.split( '_or_' ).slice( 1 );
                        for( var i=0, l=sub_targets.length; i<l; i++ ) {
                            flag = flag || handler( this.model.target[ sub_targets[i] ] );
                        }

                        return flag;
                    }
                } else if( match = mode.match( /^(.*?)_and_(.*)$/i ) ) {
                    handler = $.inputfollow._check_method[ '_'+match[1] ];
                    if( $.isFunction( handler ) ) {
                        var flag = handler( target );

                        var sub_targets = mode.split( '_and_' ).slice( 1 );
                        for( var i=0, l=sub_targets.length; i<l; i++ ) {
                            flag = flag && handler( this.model.target[ sub_targets[i] ] );
                        }

                        return flag;
                    }
                }
            }

            return true;
        },
        'reset': function() {
            this.model.reset_rules();
            this.set_event();
            this.validate_all();
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

                method = new $.inputfollow.method( $(this), index );

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
