/*!
  jquery.inputfollow.js v2.1.0
  https://github.com/sushat4692/jquery.inputfollow.js#readme
  Released under the MIT License.
*/
(function () {
    'use strict';

    var IS_VALID = true;
    var IS_LIMIT = false;

    var _assign = function __assign() {
      _assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

      return _assign.apply(this, arguments);
    };

    var InputFollowModel = /** @class */ (function () {
        function InputFollowModel(wrap) {
            this.errors = 0;
            this.error_mes = '';
            this.rules = {};
            this.target = {};
            this.messages = {};
            this.wrap = wrap;
        }
        InputFollowModel.prototype.get_wrap = function () {
            return this.wrap;
        };
        InputFollowModel.prototype.get_target = function () {
            return this.target;
        };
        InputFollowModel.prototype.set_rules = function (rules) {
            this.rules = _assign({}, rules);
            this.reset_rules();
        };
        InputFollowModel.prototype.get_rules = function () {
            return this.rules;
        };
        InputFollowModel.prototype.set_errors = function (errors) {
            this.errors = errors;
        };
        InputFollowModel.prototype.increment_errors = function (increment) {
            if (increment === void 0) { increment = 1; }
            this.errors += increment;
        };
        InputFollowModel.prototype.get_errors = function () {
            return this.errors;
        };
        InputFollowModel.prototype.set_error_mes = function (error_mes) {
            this.error_mes = error_mes;
        };
        InputFollowModel.prototype.push_error_mes = function (error_mes) {
            this.error_mes += '\n' + error_mes;
        };
        InputFollowModel.prototype.get_error_mes = function () {
            return this.error_mes;
        };
        InputFollowModel.prototype.set_messages = function (messages) {
            this.messages = _assign({}, messages);
        };
        InputFollowModel.prototype.get_messages = function () {
            return this.messages;
        };
        InputFollowModel.prototype.reset_rules = function () {
            this.wrap.find('input, select, textarea').off('focus.inputfollow_focus');
            for (var key in this.rules) {
                var parent_1 = this.filter_target(key);
                this.target[key] = this.initialize_target(parent_1);
                if (Array.isArray(this.rules[key])) {
                    for (var i = 0, l = this.rules[key].length; i < l; i += 1) {
                        var targetRule = this.rules[key][i];
                        this.reset_rule(targetRule, parent_1);
                    }
                }
                else {
                    var targetRule = this.rules[key];
                    this.reset_rule(targetRule, parent_1);
                }
            }
        };
        InputFollowModel.prototype.reset_rule = function (targetRule, parent) {
            var _this = this;
            if (Array.isArray(targetRule.with)) {
                targetRule.with.map(function (target) {
                    _this.target[target] = _this.initialize_target(_this.filter_target(target), parent);
                });
            }
            if (targetRule.if) {
                Object.keys(targetRule.if).map(function (target) {
                    _this.target[target] = _this.initialize_target(_this.filter_target(target), parent);
                });
            }
        };
        InputFollowModel.prototype.enable_focus_flag = function (target) {
            return function () {
                target.data('is_focused', true);
            };
        };
        InputFollowModel.prototype.filter_target = function (key) {
            return this.wrap.find("input[name=\"" + key + "\"],input[name^=\"" + key + "[\"],select[name=\"" + key + "\"],select[name^=\"" + key + "[\"],textarea[name=\"" + key + "\"],textarea[name^=\"" + key + "[\"]");
        };
        InputFollowModel.prototype.initialize_target = function (target, parent) {
            if (parent === void 0) { parent = null; }
            var focusTarget = parent !== null ? parent : target;
            return target
                .data('is_inputfollow', true)
                .data('is_focused', false)
                .off('focus.inputfollow_focus')
                .on('focus.inputfollow_focus', this.enable_focus_flag(focusTarget));
        };
        return InputFollowModel;
    }());

    var InputFollow = /** @class */ (function () {
        function InputFollow() {
            this.index = 0;
            this.collection = [];
            this.rules = {
                required: IS_VALID,
                email: IS_VALID,
                number: IS_LIMIT,
                code: IS_LIMIT,
            };
        }
        InputFollow.prototype.get_index = function () {
            var index = this.index;
            this.index += 1;
            return index;
        };
        InputFollow.prototype.push_collection = function (index, method) {
            this.collection[index] = method;
        };
        InputFollow.prototype.get_collection = function (index) {
            return this.collection[index];
        };
        InputFollow.prototype.check_rules = function (rule) {
            var _a;
            return (_a = this.rules[rule.type]) !== null && _a !== void 0 ? _a : false;
        };
        InputFollow.prototype.get_method = function (key) {
            switch (key) {
                case 'required':
                    return this.check_method_required.bind(this);
                case 'email':
                    return this.check_method_email.bind(this);
                case 'number':
                    return this.check_method_number.bind(this);
                case 'code':
                    return this.check_method_code.bind(this);
            }
            return false;
        };
        /**
         * Check required
         * @param target
         * @return boolean
         */
        InputFollow.prototype.check_method_required = function (target) {
            if (target.is('[type="radio"]') || target.is('[type="checkbox"]')) {
                return target.filter(':checked').length > 0;
            }
            return target.val() !== '';
        };
        /**
         * Check email
         * @param target
         * @return boolean
         */
        InputFollow.prototype.check_method_email = function (target) {
            return /^([a-z0-9_]|-|\.|\+)+@(([a-z0-9_]|-)+\.)+[a-z]{2,6}$/.test(target.val() + '');
        };
        InputFollow.prototype.check_method_number = function (target) {
            var val = target.val() + '';
            var org = val;
            // Full width to Half width characters
            val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
            });
            // Remove text except for numbers
            val = val.replace(/[^0-9]/g, '');
            if (val !== org) {
                target.val(val);
                if (target.is(':focus')) {
                    this.change_caret_pos(target, val);
                }
            }
            return true;
        };
        InputFollow.prototype.check_method_code = function (target) {
            var val = target.val() + '';
            var org = val;
            // Full width to Half width characters
            val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
            });
            // Convert dash
            val = val.replace(/[−ーー―]/g, '-');
            // Remove text except for numbers
            val = val.replace(/[^0-9]/g, '');
            if (val !== org) {
                target.val(val);
                if (target.is(':focus')) {
                    this.change_caret_pos(target, val);
                }
            }
            return true;
        };
        InputFollow.prototype.change_caret_pos = function (target, val) {
            var pos = val.length - target.data('before_val').length + target.data('caret_pos');
            if (document.selection !== undefined) {
                var range = target.get(0).createTextRange();
                range.move('character', pos);
                range.select();
            }
            else {
                try {
                    ;
                    target.get(0).setSelectionRange(pos, pos);
                }
                catch (e) {
                    // Cannot change caret pos
                }
            }
        };
        InputFollow.prototype.get_caret_pos = function (target) {
            if (document.selection !== undefined) {
                var range = document.selection.createRange();
                var tmp = document.createRange();
                try {
                    ;
                    tmp.moveToElementText(target);
                    tmp.setEndPoint('StartToStart', range);
                }
                catch (e) {
                    tmp = target.createTextRange();
                    tmp.setEndPoint('StartToStart', range);
                }
                return target.value.length - tmp.text.length;
            }
            else {
                try {
                    return target.selectionStart || 0;
                }
                catch (e) {
                    return 0;
                }
            }
        };
        InputFollow.prototype.split_related_rules = function (rule) {
            return rule.split('_and_').join('_or_').split('_or_').slice(1);
        };
        return InputFollow;
    }());

    var instance = new InputFollow();

    var InputFollowMethod = /** @class */ (function () {
        function InputFollowMethod(target, index) {
            var _this = this;
            this.index = 0;
            this.error_class = 'error';
            this.valid_class = 'valid';
            this.initial_error_view = false;
            this.on_validate = function () { };
            this.on_success = function () { };
            this.on_error = function () { };
            this.model = new InputFollowModel(target);
            this.index = index;
            target.on('submit', function () {
                _this.set_initial_error_view(true);
                _this.validate_all();
                if (_this.model.get_errors() <= 0) {
                    if (typeof _this.on_success === 'function') {
                        _this.on_success();
                    }
                    return true;
                }
                else {
                    if (typeof _this.on_error === 'function') {
                        _this.on_error(_this.model.get_error_mes());
                    }
                    return false;
                }
            });
        }
        InputFollowMethod.prototype.init = function (param) {
            if (param.hasOwnProperty('rules') && param.rules) {
                this.set_rules(param.rules);
            }
            if (param.hasOwnProperty('messages') && param.messages) {
                this.set_messages(param.messages);
            }
            if (param.hasOwnProperty('error_class') && param.error_class) {
                this.set_error_class(param.error_class);
            }
            if (param.hasOwnProperty('valid_class') && param.valid_class) {
                this.set_valid_class(param.valid_class);
            }
            if (param.hasOwnProperty('initial_error_view') &&
                param.initial_error_view) {
                this.set_initial_error_view(param.initial_error_view);
            }
            if (param.hasOwnProperty('on_validate') && param.on_validate) {
                this.set_on_validate(param.on_validate);
            }
            if (param.hasOwnProperty('on_success') && param.on_success) {
                this.set_on_success(param.on_success);
            }
            if (param.hasOwnProperty('on_error') && param.on_error) {
                this.set_on_error(param.on_error);
            }
            this.set_event();
            this.validate_all();
        };
        InputFollowMethod.prototype.set_rules = function (rules) {
            this.model.set_rules(rules);
        };
        InputFollowMethod.prototype.set_messages = function (messages) {
            this.model.set_messages(messages);
        };
        InputFollowMethod.prototype.set_error_class = function (error_class) {
            this.error_class = error_class;
        };
        InputFollowMethod.prototype.set_valid_class = function (valid_class) {
            this.valid_class = valid_class;
        };
        InputFollowMethod.prototype.set_initial_error_view = function (initial_error_view) {
            this.initial_error_view = initial_error_view;
        };
        InputFollowMethod.prototype.set_on_validate = function (func) {
            if (typeof func === 'function') {
                this.on_validate = func;
            }
        };
        InputFollowMethod.prototype.set_on_success = function (func) {
            if (typeof func === 'function') {
                this.on_success = func;
            }
        };
        InputFollowMethod.prototype.set_on_error = function (func) {
            if (typeof func === 'function') {
                this.on_error = func;
            }
        };
        InputFollowMethod.prototype.set_event = function () {
            var that = this;
            this.model
                .get_wrap()
                .find('input,select,textarea')
                .off('keydown.inputfollow')
                .on('keydown.inputfollow', function () {
                that.validate_before($(this));
            })
                .off('click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow')
                .on('click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow', function () {
                that.validate($(this));
            });
        };
        InputFollowMethod.prototype.validate_before = function (target) {
            if (!target.data('is_inputfollow') && target.is(':focus')) {
                return;
            }
            target
                .data('before_val', target.val() + '')
                .data('caret_pos', instance.get_caret_pos(target.get(0)));
        };
        InputFollowMethod.prototype.validate = function (target) {
            if (!target.data('is_inputfollow')) {
                return;
            }
            this.validate_all();
        };
        InputFollowMethod.prototype.validate_all = function () {
            var _this = this;
            this.model.set_errors(0);
            this.model.set_error_mes('');
            $.each(this.model.get_target(), function (key, target) {
                var rules = _this.model.get_rules();
                if (!rules.hasOwnProperty(key)) {
                    return;
                }
                var rule = rules[key];
                var sub_target_rules = [];
                var flag = true;
                var check = false;
                var error = null;
                var hasErrorTarget = false;
                var err_id = 'inputfollow-error-' + _this.index + '-' + key.replace('[]', '');
                var err_target = _this.model
                    .get_wrap()
                    .find('.inputfollow-error')
                    .filter("[data-target=\"" + key + "\"]");
                if (err_target.length) {
                    hasErrorTarget = true;
                    err_target.attr('id', err_id);
                }
                if (target.length) {
                    if (Array.isArray(rule)) {
                        rule.map(function (r) {
                            var tcheck = instance.check_rules(r);
                            check = check || tcheck ? IS_VALID : IS_LIMIT;
                            if (tcheck === IS_VALID) {
                                sub_target_rules.push(r);
                            }
                            if (!_this.check_handler(r, target)) {
                                flag = false;
                                if (error === null) {
                                    var messages = _this.model.get_messages();
                                    if (Object.prototype.hasOwnProperty.call(messages, key) &&
                                        Object.prototype.hasOwnProperty.call(messages[key], r.type)) {
                                        error = messages[key][r.type];
                                    }
                                }
                            }
                        });
                    }
                    else if (rule) {
                        check = instance.check_rules(rule);
                        flag = _this.check_handler(rule, target);
                        if (check === IS_VALID) {
                            sub_target_rules.push(rule);
                        }
                        var messages = _this.model.get_messages();
                        if (Object.prototype.hasOwnProperty.call(messages, key) &&
                            Object.prototype.hasOwnProperty.call(messages[key], rule.type)) {
                            error = messages[key][rule.type];
                        }
                    }
                }
                if (check === IS_VALID) {
                    var targets = _this.model.get_target();
                    if (flag) {
                        _this.toggle_error_visible(target, targets, sub_target_rules, flag);
                        // Remove Error Message
                        if (hasErrorTarget) {
                            $('#' + err_id)
                                .text('')
                                .addClass('inputfollow-error-empty');
                        }
                        else {
                            $('#' + err_id).remove();
                        }
                    }
                    else {
                        // Clear Error Message
                        _this.model.increment_errors();
                        if (hasErrorTarget) {
                            $('#' + err_id)
                                .text('')
                                .addClass('inputfollow-error-empty');
                        }
                        else {
                            $('#' + err_id).remove();
                        }
                        // Display Error Message
                        if (error !== null) {
                            _this.model.push_error_mes(error);
                            if (target.data('is_focused') || _this.initial_error_view) {
                                if (hasErrorTarget) {
                                    $('#' + err_id)
                                        .removeClass('inputfollow-error-empty')
                                        .text(error);
                                }
                                else {
                                    target.eq(0).after($('<span>', {
                                        id: err_id,
                                        class: 'inputfollow-error',
                                    }).text(error));
                                }
                                _this.toggle_error_visible(target, targets, sub_target_rules, flag);
                            }
                        }
                    }
                }
            });
            if (typeof this.on_validate === 'function') {
                this.on_validate();
            }
        };
        InputFollowMethod.prototype.toggle_error_visible = function (target, targets, sub_target_rules, flag) {
            var _this = this;
            if (flag) {
                target.addClass(this.valid_class).removeClass(this.error_class);
            }
            else {
                target.removeClass(this.valid_class).addClass(this.error_class);
            }
            sub_target_rules.map(function (sv) {
                if (Array.isArray(sv.with)) {
                    sv.with.map(function (stv) {
                        if (Object.prototype.hasOwnProperty.call(targets, stv)) {
                            if (flag) {
                                targets[stv].addClass(_this.valid_class).removeClass(_this.error_class);
                            }
                            else {
                                targets[stv].removeClass(_this.valid_class).addClass(_this.error_class);
                            }
                        }
                    });
                }
                if (sv.if) {
                    Object.keys(sv.if).map(function (stv) {
                        if (Object.prototype.hasOwnProperty.call(targets, stv)) {
                            if (flag) {
                                targets[stv].addClass(_this.valid_class).removeClass(_this.error_class);
                            }
                            else {
                                targets[stv].removeClass(_this.valid_class).addClass(_this.error_class);
                            }
                        }
                    });
                }
            });
        };
        InputFollowMethod.prototype.get_errors = function () {
            return this.model.get_errors();
        };
        InputFollowMethod.prototype.check_handler = function (rule, target) {
            var handler = instance.get_method(rule.type);
            if (handler === false) {
                return true;
            }
            var targets = this.model.get_target();
            if (rule.if) {
                var flag_1 = true;
                Object.keys(rule.if).map(function (target) {
                    if (!rule.if ||
                        !Object.prototype.hasOwnProperty.call(rule.if, target)) {
                        return;
                    }
                    var value = rule.if[target];
                    if (targets.hasOwnProperty(target)) {
                        var t = targets[target];
                        var compare = void 0;
                        if (t.is('[type="radio"]') || t.is('[type="checkbox"]')) {
                            compare = t.filter(':checked').val();
                        }
                        else {
                            compare = targets[target].val();
                        }
                        if (compare == value) {
                            flag_1 = false;
                        }
                    }
                });
                if (flag_1 === true) {
                    return true;
                }
            }
            if (!rule.mode && !rule.with) {
                return handler(target);
            }
            if (rule.mode && rule.with) {
                if (rule.mode.toLowerCase() === 'or') {
                    var flag_2 = handler(target);
                    rule.with.map(function (t) {
                        if (targets.hasOwnProperty(t)) {
                            flag_2 = flag_2 || handler(targets[t]);
                        }
                    });
                    return flag_2;
                }
                else if (rule.mode.toLowerCase() === 'and') {
                    var flag_3 = handler(target);
                    rule.with.map(function (t) {
                        if (targets.hasOwnProperty(t)) {
                            flag_3 = flag_3 && handler(targets[t]);
                        }
                    });
                    return flag_3;
                }
            }
            return true;
        };
        InputFollowMethod.prototype.reset = function () {
            this.model.reset_rules();
            this.set_event();
            this.validate_all();
        };
        return InputFollowMethod;
    }());

    $.fn.extend({
        inputfollow: function (param) {
            var target = this;
            if (!$(target).length) {
                return;
            }
            var method;
            if (!$(target).data('inputfollow_id')) {
                var index = instance.get_index();
                $(target).data('inputfollow_id', index);
                method = new InputFollowMethod($(target), index);
                instance.push_collection(index, method);
            }
            else {
                var index = $(target).data('inputfollow_id');
                method = instance.get_collection(index);
            }
            if (param && method) {
                method.init(param);
            }
            return method;
        },
    });

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianF1ZXJ5LmlucHV0Zm9sbG93LmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29uc3QudHMiLCIuLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vc3JjL0lucHV0Rm9sbG93TW9kZWwudHMiLCIuLi9zcmMvSW5wdXRGb2xsb3cudHMiLCIuLi9zcmMvaW5zdGFuY2UudHMiLCIuLi9zcmMvSW5wdXRGb2xsb3dNZXRob2QudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IElTX1ZBTElEID0gdHJ1ZVxuZXhwb3J0IGNvbnN0IElTX0xJTUlUID0gZmFsc2VcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NyZWF0ZUJpbmRpbmcobywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IFJ1bGUsIFRhcmdldCwgTWVzc2FnZSwgUnVsZU9wdGlvbiB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0Rm9sbG93TW9kZWwge1xuICBwcml2YXRlIHdyYXA6IEpRdWVyeVxuICBwcml2YXRlIGVycm9yczogbnVtYmVyID0gMFxuICBwcml2YXRlIGVycm9yX21lczogc3RyaW5nID0gJydcbiAgcHJpdmF0ZSBydWxlczogUnVsZSA9IHt9XG4gIHByaXZhdGUgdGFyZ2V0OiBUYXJnZXQgPSB7fVxuICBwcml2YXRlIG1lc3NhZ2VzOiBNZXNzYWdlID0ge31cblxuICBjb25zdHJ1Y3Rvcih3cmFwOiBKUXVlcnkpIHtcbiAgICB0aGlzLndyYXAgPSB3cmFwXG4gIH1cblxuICBnZXRfd3JhcCgpOiBKUXVlcnkge1xuICAgIHJldHVybiB0aGlzLndyYXBcbiAgfVxuXG4gIGdldF90YXJnZXQoKTogVGFyZ2V0IHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRcbiAgfVxuXG4gIHNldF9ydWxlcyhydWxlczogUnVsZSk6IHZvaWQge1xuICAgIHRoaXMucnVsZXMgPSB7IC4uLnJ1bGVzIH1cblxuICAgIHRoaXMucmVzZXRfcnVsZXMoKVxuICB9XG4gIGdldF9ydWxlcygpOiBSdWxlIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlc1xuICB9XG5cbiAgc2V0X2Vycm9ycyhlcnJvcnM6IG51bWJlcikge1xuICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gIH1cbiAgaW5jcmVtZW50X2Vycm9ycyhpbmNyZW1lbnQ6IG51bWJlciA9IDEpIHtcbiAgICB0aGlzLmVycm9ycyArPSBpbmNyZW1lbnRcbiAgfVxuICBnZXRfZXJyb3JzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3JzXG4gIH1cblxuICBzZXRfZXJyb3JfbWVzKGVycm9yX21lczogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5lcnJvcl9tZXMgPSBlcnJvcl9tZXNcbiAgfVxuICBwdXNoX2Vycm9yX21lcyhlcnJvcl9tZXM6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZXJyb3JfbWVzICs9ICdcXG4nICsgZXJyb3JfbWVzXG4gIH1cbiAgZ2V0X2Vycm9yX21lcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVycm9yX21lc1xuICB9XG5cbiAgc2V0X21lc3NhZ2VzKG1lc3NhZ2VzOiBNZXNzYWdlKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IHsgLi4ubWVzc2FnZXMgfVxuICB9XG4gIGdldF9tZXNzYWdlcygpOiBNZXNzYWdlIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1xuICB9XG5cbiAgcmVzZXRfcnVsZXMoKTogdm9pZCB7XG4gICAgdGhpcy53cmFwLmZpbmQoJ2lucHV0LCBzZWxlY3QsIHRleHRhcmVhJykub2ZmKCdmb2N1cy5pbnB1dGZvbGxvd19mb2N1cycpXG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnJ1bGVzKSB7XG4gICAgICBjb25zdCBwYXJlbnQ6IEpRdWVyeSA9IHRoaXMuZmlsdGVyX3RhcmdldChrZXkpXG4gICAgICB0aGlzLnRhcmdldFtrZXldID0gdGhpcy5pbml0aWFsaXplX3RhcmdldChwYXJlbnQpXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucnVsZXNba2V5XSkpIHtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBsZXQgaSA9IDAsIGwgPSAodGhpcy5ydWxlc1trZXldIGFzIFJ1bGVPcHRpb25bXSkubGVuZ3RoO1xuICAgICAgICAgIGkgPCBsO1xuICAgICAgICAgIGkgKz0gMVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXRSdWxlID0gKHRoaXMucnVsZXNba2V5XSBhcyBSdWxlT3B0aW9uW10pW2ldIVxuICAgICAgICAgIHRoaXMucmVzZXRfcnVsZSh0YXJnZXRSdWxlLCBwYXJlbnQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRhcmdldFJ1bGUgPSB0aGlzLnJ1bGVzW2tleV0gYXMgUnVsZU9wdGlvblxuICAgICAgICB0aGlzLnJlc2V0X3J1bGUodGFyZ2V0UnVsZSwgcGFyZW50KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0X3J1bGUodGFyZ2V0UnVsZTogUnVsZU9wdGlvbiwgcGFyZW50OiBKUXVlcnkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRSdWxlLndpdGgpKSB7XG4gICAgICB0YXJnZXRSdWxlLndpdGgubWFwKCh0YXJnZXQpID0+IHtcbiAgICAgICAgdGhpcy50YXJnZXRbdGFyZ2V0XSA9IHRoaXMuaW5pdGlhbGl6ZV90YXJnZXQoXG4gICAgICAgICAgdGhpcy5maWx0ZXJfdGFyZ2V0KHRhcmdldCksXG4gICAgICAgICAgcGFyZW50XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh0YXJnZXRSdWxlLmlmKSB7XG4gICAgICBPYmplY3Qua2V5cyh0YXJnZXRSdWxlLmlmKS5tYXAoKHRhcmdldCkgPT4ge1xuICAgICAgICB0aGlzLnRhcmdldFt0YXJnZXRdID0gdGhpcy5pbml0aWFsaXplX3RhcmdldChcbiAgICAgICAgICB0aGlzLmZpbHRlcl90YXJnZXQodGFyZ2V0KSxcbiAgICAgICAgICBwYXJlbnRcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBlbmFibGVfZm9jdXNfZmxhZyh0YXJnZXQ6IEpRdWVyeSk6IGFueSB7XG4gICAgcmV0dXJuICgpOiB2b2lkID0+IHtcbiAgICAgIHRhcmdldC5kYXRhKCdpc19mb2N1c2VkJywgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBmaWx0ZXJfdGFyZ2V0KGtleTogc3RyaW5nKTogSlF1ZXJ5IHtcbiAgICByZXR1cm4gdGhpcy53cmFwLmZpbmQoXG4gICAgICBgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXSxpbnB1dFtuYW1lXj1cIiR7a2V5fVtcIl0sc2VsZWN0W25hbWU9XCIke2tleX1cIl0sc2VsZWN0W25hbWVePVwiJHtrZXl9W1wiXSx0ZXh0YXJlYVtuYW1lPVwiJHtrZXl9XCJdLHRleHRhcmVhW25hbWVePVwiJHtrZXl9W1wiXWBcbiAgICApXG4gIH1cblxuICBpbml0aWFsaXplX3RhcmdldCh0YXJnZXQ6IEpRdWVyeSwgcGFyZW50OiBKUXVlcnkgfCBudWxsID0gbnVsbCk6IEpRdWVyeSB7XG4gICAgY29uc3QgZm9jdXNUYXJnZXQ6IEpRdWVyeSA9IHBhcmVudCAhPT0gbnVsbCA/IChwYXJlbnQgYXMgSlF1ZXJ5KSA6IHRhcmdldFxuXG4gICAgcmV0dXJuIHRhcmdldFxuICAgICAgLmRhdGEoJ2lzX2lucHV0Zm9sbG93JywgdHJ1ZSlcbiAgICAgIC5kYXRhKCdpc19mb2N1c2VkJywgZmFsc2UpXG4gICAgICAub2ZmKCdmb2N1cy5pbnB1dGZvbGxvd19mb2N1cycpXG4gICAgICAub24oJ2ZvY3VzLmlucHV0Zm9sbG93X2ZvY3VzJywgdGhpcy5lbmFibGVfZm9jdXNfZmxhZyhmb2N1c1RhcmdldCkpXG4gIH1cbn1cbiIsImltcG9ydCB7IFJ1bGVGbGFnLCBSdWxlT3B0aW9uIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IElTX0xJTUlULCBJU19WQUxJRCB9IGZyb20gJy4vY29uc3QnXG5pbXBvcnQgSW5wdXRGb2xsb3dNZXRob2QgZnJvbSAnLi9JbnB1dEZvbGxvd01ldGhvZCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRGb2xsb3cge1xuICBwcml2YXRlIGluZGV4ID0gMFxuICBwcml2YXRlIGNvbGxlY3Rpb246IElucHV0Rm9sbG93TWV0aG9kW10gPSBbXVxuICBwcml2YXRlIHJ1bGVzOiBSdWxlRmxhZyA9IHtcbiAgICByZXF1aXJlZDogSVNfVkFMSUQsXG4gICAgZW1haWw6IElTX1ZBTElELFxuICAgIG51bWJlcjogSVNfTElNSVQsXG4gICAgY29kZTogSVNfTElNSVQsXG4gIH1cblxuICBnZXRfaW5kZXgoKTogbnVtYmVyIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXhcbiAgICB0aGlzLmluZGV4ICs9IDFcbiAgICByZXR1cm4gaW5kZXhcbiAgfVxuXG4gIHB1c2hfY29sbGVjdGlvbihpbmRleDogbnVtYmVyLCBtZXRob2Q6IElucHV0Rm9sbG93TWV0aG9kKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uW2luZGV4XSA9IG1ldGhvZFxuICB9XG4gIGdldF9jb2xsZWN0aW9uKGluZGV4OiBudW1iZXIpOiBJbnB1dEZvbGxvd01ldGhvZCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbltpbmRleF1cbiAgfVxuXG4gIGNoZWNrX3J1bGVzKHJ1bGU6IFJ1bGVPcHRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlc1tydWxlLnR5cGVdID8/IGZhbHNlXG4gIH1cblxuICBnZXRfbWV0aG9kKGtleTogc3RyaW5nKTogYW55IHtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja19tZXRob2RfcmVxdWlyZWQuYmluZCh0aGlzKVxuICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja19tZXRob2RfZW1haWwuYmluZCh0aGlzKVxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tfbWV0aG9kX251bWJlci5iaW5kKHRoaXMpXG4gICAgICBjYXNlICdjb2RlJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tfbWV0aG9kX2NvZGUuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHJlcXVpcmVkXG4gICAqIEBwYXJhbSB0YXJnZXRcbiAgICogQHJldHVybiBib29sZWFuXG4gICAqL1xuICBjaGVja19tZXRob2RfcmVxdWlyZWQodGFyZ2V0OiBKUXVlcnkpOiBib29sZWFuIHtcbiAgICBpZiAodGFyZ2V0LmlzKCdbdHlwZT1cInJhZGlvXCJdJykgfHwgdGFyZ2V0LmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykpIHtcbiAgICAgIHJldHVybiB0YXJnZXQuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA+IDBcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0LnZhbCgpICE9PSAnJ1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGVtYWlsXG4gICAqIEBwYXJhbSB0YXJnZXRcbiAgICogQHJldHVybiBib29sZWFuXG4gICAqL1xuICBjaGVja19tZXRob2RfZW1haWwodGFyZ2V0OiBKUXVlcnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gL14oW2EtejAtOV9dfC18XFwufFxcKykrQCgoW2EtejAtOV9dfC0pK1xcLikrW2Etel17Miw2fSQvLnRlc3QoXG4gICAgICB0YXJnZXQudmFsKCkgKyAnJ1xuICAgIClcbiAgfVxuXG4gIGNoZWNrX21ldGhvZF9udW1iZXIodGFyZ2V0OiBKUXVlcnkpOiBib29sZWFuIHtcbiAgICBsZXQgdmFsOiBzdHJpbmcgPSB0YXJnZXQudmFsKCkgKyAnJ1xuICAgIGNvbnN0IG9yZzogc3RyaW5nID0gdmFsXG5cbiAgICAvLyBGdWxsIHdpZHRoIHRvIEhhbGYgd2lkdGggY2hhcmFjdGVyc1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC9b77yhLe+8uu+9gS3vvZrvvJAt77yZXS9nLCAocykgPT5cbiAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUocy5jaGFyQ29kZUF0KDApIC0gMHhmZWUwKVxuICAgIClcblxuICAgIC8vIFJlbW92ZSB0ZXh0IGV4Y2VwdCBmb3IgbnVtYmVyc1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC9bXjAtOV0vZywgJycpXG5cbiAgICBpZiAodmFsICE9PSBvcmcpIHtcbiAgICAgIHRhcmdldC52YWwodmFsKVxuXG4gICAgICBpZiAodGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xuICAgICAgICB0aGlzLmNoYW5nZV9jYXJldF9wb3ModGFyZ2V0LCB2YWwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNoZWNrX21ldGhvZF9jb2RlKHRhcmdldDogSlF1ZXJ5KTogYm9vbGVhbiB7XG4gICAgbGV0IHZhbDogc3RyaW5nID0gdGFyZ2V0LnZhbCgpICsgJydcbiAgICBjb25zdCBvcmc6IHN0cmluZyA9IHZhbFxuXG4gICAgLy8gRnVsbCB3aWR0aCB0byBIYWxmIHdpZHRoIGNoYXJhY3RlcnNcbiAgICB2YWwgPSB2YWwucmVwbGFjZSgvW++8oS3vvLrvvYEt772a77yQLe+8mV0vZywgKHMpID0+XG4gICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKHMuY2hhckNvZGVBdCgwKSAtIDB4ZmVlMClcbiAgICApXG5cbiAgICAvLyBDb252ZXJ0IGRhc2hcbiAgICB2YWwgPSB2YWwucmVwbGFjZSgvW+KIkuODvOODvOKAlV0vZywgJy0nKVxuXG4gICAgLy8gUmVtb3ZlIHRleHQgZXhjZXB0IGZvciBudW1iZXJzXG4gICAgdmFsID0gdmFsLnJlcGxhY2UoL1teMC05XS9nLCAnJylcblxuICAgIGlmICh2YWwgIT09IG9yZykge1xuICAgICAgdGFyZ2V0LnZhbCh2YWwpXG5cbiAgICAgIGlmICh0YXJnZXQuaXMoJzpmb2N1cycpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlX2NhcmV0X3Bvcyh0YXJnZXQsIHZhbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2hhbmdlX2NhcmV0X3Bvcyh0YXJnZXQ6IEpRdWVyeSwgdmFsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb3MgPVxuICAgICAgdmFsLmxlbmd0aCAtIHRhcmdldC5kYXRhKCdiZWZvcmVfdmFsJykubGVuZ3RoICsgdGFyZ2V0LmRhdGEoJ2NhcmV0X3BvcycpXG5cbiAgICBpZiAoKGRvY3VtZW50IGFzIGFueSkuc2VsZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gKHRhcmdldC5nZXQoMCkgYXMgYW55KS5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgcmFuZ2UubW92ZSgnY2hhcmFjdGVyJywgcG9zKVxuICAgICAgcmFuZ2Uuc2VsZWN0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgOyh0YXJnZXQuZ2V0KDApIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnNldFNlbGVjdGlvblJhbmdlKHBvcywgcG9zKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBDYW5ub3QgY2hhbmdlIGNhcmV0IHBvc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldF9jYXJldF9wb3ModGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgICBpZiAoKGRvY3VtZW50IGFzIGFueSkuc2VsZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gKGRvY3VtZW50IGFzIGFueSkuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGxldCB0bXAgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpIGFzIGFueVxuXG4gICAgICB0cnkge1xuICAgICAgICA7KHRtcCBhcyBhbnkpLm1vdmVUb0VsZW1lbnRUZXh0KHRhcmdldClcbiAgICAgICAgdG1wLnNldEVuZFBvaW50KCdTdGFydFRvU3RhcnQnLCByYW5nZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG1wID0gKHRhcmdldCBhcyBhbnkpLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHRtcC5zZXRFbmRQb2ludCgnU3RhcnRUb1N0YXJ0JywgcmFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXQudmFsdWUubGVuZ3RoIC0gdG1wLnRleHQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQuc2VsZWN0aW9uU3RhcnQgfHwgMFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gMFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNwbGl0X3JlbGF0ZWRfcnVsZXMocnVsZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBydWxlLnNwbGl0KCdfYW5kXycpLmpvaW4oJ19vcl8nKS5zcGxpdCgnX29yXycpLnNsaWNlKDEpXG4gIH1cbn1cbiIsImltcG9ydCBJbnB1dEZvbGxvdyBmcm9tICcuL0lucHV0Rm9sbG93J1xuXG5jb25zdCBpbnN0YW5jZSA9IG5ldyBJbnB1dEZvbGxvdygpXG5leHBvcnQgZGVmYXVsdCBpbnN0YW5jZVxuIiwiaW1wb3J0IHsgSW5pdGlhbFBhcmFtLCBSdWxlLCBNZXNzYWdlLCBSdWxlT3B0aW9uLCBUYXJnZXQgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgSVNfTElNSVQsIElTX1ZBTElEIH0gZnJvbSAnLi9jb25zdCdcbmltcG9ydCBJbnB1dEZvbGxvd01vZGVsIGZyb20gJy4vSW5wdXRGb2xsb3dNb2RlbCdcbmltcG9ydCBpbnB1dEZvbGxvdyBmcm9tICcuL2luc3RhbmNlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dEZvbGxvd01ldGhvZCB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcbiAgcHJpdmF0ZSBtb2RlbDogSW5wdXRGb2xsb3dNb2RlbFxuICBwcml2YXRlIGVycm9yX2NsYXNzOiBzdHJpbmcgPSAnZXJyb3InXG4gIHByaXZhdGUgdmFsaWRfY2xhc3M6IHN0cmluZyA9ICd2YWxpZCdcbiAgcHJpdmF0ZSBpbml0aWFsX2Vycm9yX3ZpZXc6IGJvb2xlYW4gPSBmYWxzZVxuICBwcml2YXRlIG9uX3ZhbGlkYXRlOiBGdW5jdGlvbiA9ICgpID0+IHt9XG4gIHByaXZhdGUgb25fc3VjY2VzczogRnVuY3Rpb24gPSAoKSA9PiB7fVxuICBwcml2YXRlIG9uX2Vycm9yOiBGdW5jdGlvbiA9ICgpID0+IHt9XG5cbiAgY29uc3RydWN0b3IodGFyZ2V0OiBKUXVlcnk8SFRNTEVsZW1lbnQ+LCBpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbCA9IG5ldyBJbnB1dEZvbGxvd01vZGVsKHRhcmdldClcbiAgICB0aGlzLmluZGV4ID0gaW5kZXhcblxuICAgIHRhcmdldC5vbignc3VibWl0JywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRfaW5pdGlhbF9lcnJvcl92aWV3KHRydWUpXG4gICAgICB0aGlzLnZhbGlkYXRlX2FsbCgpXG5cbiAgICAgIGlmICh0aGlzLm1vZGVsLmdldF9lcnJvcnMoKSA8PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbl9zdWNjZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5vbl9zdWNjZXNzKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uX2Vycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5vbl9lcnJvcih0aGlzLm1vZGVsLmdldF9lcnJvcl9tZXMoKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaW5pdChwYXJhbTogSW5pdGlhbFBhcmFtKSB7XG4gICAgaWYgKHBhcmFtLmhhc093blByb3BlcnR5KCdydWxlcycpICYmIHBhcmFtLnJ1bGVzKSB7XG4gICAgICB0aGlzLnNldF9ydWxlcyhwYXJhbS5ydWxlcylcbiAgICB9XG4gICAgaWYgKHBhcmFtLmhhc093blByb3BlcnR5KCdtZXNzYWdlcycpICYmIHBhcmFtLm1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLnNldF9tZXNzYWdlcyhwYXJhbS5tZXNzYWdlcylcbiAgICB9XG4gICAgaWYgKHBhcmFtLmhhc093blByb3BlcnR5KCdlcnJvcl9jbGFzcycpICYmIHBhcmFtLmVycm9yX2NsYXNzKSB7XG4gICAgICB0aGlzLnNldF9lcnJvcl9jbGFzcyhwYXJhbS5lcnJvcl9jbGFzcylcbiAgICB9XG4gICAgaWYgKHBhcmFtLmhhc093blByb3BlcnR5KCd2YWxpZF9jbGFzcycpICYmIHBhcmFtLnZhbGlkX2NsYXNzKSB7XG4gICAgICB0aGlzLnNldF92YWxpZF9jbGFzcyhwYXJhbS52YWxpZF9jbGFzcylcbiAgICB9XG4gICAgaWYgKFxuICAgICAgcGFyYW0uaGFzT3duUHJvcGVydHkoJ2luaXRpYWxfZXJyb3JfdmlldycpICYmXG4gICAgICBwYXJhbS5pbml0aWFsX2Vycm9yX3ZpZXdcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0X2luaXRpYWxfZXJyb3JfdmlldyhwYXJhbS5pbml0aWFsX2Vycm9yX3ZpZXcpXG4gICAgfVxuICAgIGlmIChwYXJhbS5oYXNPd25Qcm9wZXJ0eSgnb25fdmFsaWRhdGUnKSAmJiBwYXJhbS5vbl92YWxpZGF0ZSkge1xuICAgICAgdGhpcy5zZXRfb25fdmFsaWRhdGUocGFyYW0ub25fdmFsaWRhdGUpXG4gICAgfVxuICAgIGlmIChwYXJhbS5oYXNPd25Qcm9wZXJ0eSgnb25fc3VjY2VzcycpICYmIHBhcmFtLm9uX3N1Y2Nlc3MpIHtcbiAgICAgIHRoaXMuc2V0X29uX3N1Y2Nlc3MocGFyYW0ub25fc3VjY2VzcylcbiAgICB9XG4gICAgaWYgKHBhcmFtLmhhc093blByb3BlcnR5KCdvbl9lcnJvcicpICYmIHBhcmFtLm9uX2Vycm9yKSB7XG4gICAgICB0aGlzLnNldF9vbl9lcnJvcihwYXJhbS5vbl9lcnJvcilcbiAgICB9XG5cbiAgICB0aGlzLnNldF9ldmVudCgpXG4gICAgdGhpcy52YWxpZGF0ZV9hbGwoKVxuICB9XG5cbiAgc2V0X3J1bGVzKHJ1bGVzOiBSdWxlKSB7XG4gICAgdGhpcy5tb2RlbC5zZXRfcnVsZXMocnVsZXMpXG4gIH1cblxuICBzZXRfbWVzc2FnZXMobWVzc2FnZXM6IE1lc3NhZ2UpIHtcbiAgICB0aGlzLm1vZGVsLnNldF9tZXNzYWdlcyhtZXNzYWdlcylcbiAgfVxuXG4gIHNldF9lcnJvcl9jbGFzcyhlcnJvcl9jbGFzczogc3RyaW5nKSB7XG4gICAgdGhpcy5lcnJvcl9jbGFzcyA9IGVycm9yX2NsYXNzXG4gIH1cblxuICBzZXRfdmFsaWRfY2xhc3ModmFsaWRfY2xhc3M6IHN0cmluZykge1xuICAgIHRoaXMudmFsaWRfY2xhc3MgPSB2YWxpZF9jbGFzc1xuICB9XG5cbiAgc2V0X2luaXRpYWxfZXJyb3Jfdmlldyhpbml0aWFsX2Vycm9yX3ZpZXc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmluaXRpYWxfZXJyb3JfdmlldyA9IGluaXRpYWxfZXJyb3Jfdmlld1xuICB9XG5cbiAgc2V0X29uX3ZhbGlkYXRlKGZ1bmM6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uX3ZhbGlkYXRlID0gZnVuY1xuICAgIH1cbiAgfVxuXG4gIHNldF9vbl9zdWNjZXNzKGZ1bmM6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uX3N1Y2Nlc3MgPSBmdW5jXG4gICAgfVxuICB9XG5cbiAgc2V0X29uX2Vycm9yKGZ1bmM6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uX2Vycm9yID0gZnVuY1xuICAgIH1cbiAgfVxuXG4gIHNldF9ldmVudCgpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpc1xuICAgIHRoaXMubW9kZWxcbiAgICAgIC5nZXRfd3JhcCgpXG4gICAgICAuZmluZCgnaW5wdXQsc2VsZWN0LHRleHRhcmVhJylcbiAgICAgIC5vZmYoJ2tleWRvd24uaW5wdXRmb2xsb3cnKVxuICAgICAgLm9uKCdrZXlkb3duLmlucHV0Zm9sbG93JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnZhbGlkYXRlX2JlZm9yZSgkKHRoaXMpKVxuICAgICAgfSlcbiAgICAgIC5vZmYoXG4gICAgICAgICdjbGljay5pbnB1dGZvbGxvdyBmb2N1cy5pbnB1dGZvbGxvdyBjaGFuZ2UuaW5wdXRmb2xsb3cga2V5dXAuaW5wdXRmb2xsb3cnXG4gICAgICApXG4gICAgICAub24oXG4gICAgICAgICdjbGljay5pbnB1dGZvbGxvdyBmb2N1cy5pbnB1dGZvbGxvdyBjaGFuZ2UuaW5wdXRmb2xsb3cga2V5dXAuaW5wdXRmb2xsb3cnLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhhdC52YWxpZGF0ZSgkKHRoaXMpKVxuICAgICAgICB9XG4gICAgICApXG4gIH1cblxuICB2YWxpZGF0ZV9iZWZvcmUodGFyZ2V0OiBKUXVlcnkpIHtcbiAgICBpZiAoIXRhcmdldC5kYXRhKCdpc19pbnB1dGZvbGxvdycpICYmIHRhcmdldC5pcygnOmZvY3VzJykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRhcmdldFxuICAgICAgLmRhdGEoJ2JlZm9yZV92YWwnLCB0YXJnZXQudmFsKCkgKyAnJylcbiAgICAgIC5kYXRhKFxuICAgICAgICAnY2FyZXRfcG9zJyxcbiAgICAgICAgaW5wdXRGb2xsb3cuZ2V0X2NhcmV0X3Bvcyh0YXJnZXQuZ2V0KDApIGFzIEhUTUxJbnB1dEVsZW1lbnQpXG4gICAgICApXG4gIH1cblxuICB2YWxpZGF0ZSh0YXJnZXQ6IEpRdWVyeSkge1xuICAgIGlmICghdGFyZ2V0LmRhdGEoJ2lzX2lucHV0Zm9sbG93JykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMudmFsaWRhdGVfYWxsKClcbiAgfVxuXG4gIHZhbGlkYXRlX2FsbCgpIHtcbiAgICB0aGlzLm1vZGVsLnNldF9lcnJvcnMoMClcbiAgICB0aGlzLm1vZGVsLnNldF9lcnJvcl9tZXMoJycpXG5cbiAgICAkLmVhY2godGhpcy5tb2RlbC5nZXRfdGFyZ2V0KCksIChrZXk6IHN0cmluZywgdGFyZ2V0KSA9PiB7XG4gICAgICBjb25zdCBydWxlcyA9IHRoaXMubW9kZWwuZ2V0X3J1bGVzKClcbiAgICAgIGlmICghcnVsZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJ1bGUgPSBydWxlc1trZXldXG4gICAgICBjb25zdCBzdWJfdGFyZ2V0X3J1bGVzOiBSdWxlT3B0aW9uW10gPSBbXVxuXG4gICAgICBsZXQgZmxhZyA9IHRydWVcbiAgICAgIGxldCBjaGVjayA9IGZhbHNlXG4gICAgICBsZXQgZXJyb3I6IGFueSA9IG51bGxcblxuICAgICAgbGV0IGhhc0Vycm9yVGFyZ2V0ID0gZmFsc2VcbiAgICAgIGNvbnN0IGVycl9pZCA9XG4gICAgICAgICdpbnB1dGZvbGxvdy1lcnJvci0nICsgdGhpcy5pbmRleCArICctJyArIGtleS5yZXBsYWNlKCdbXScsICcnKVxuICAgICAgY29uc3QgZXJyX3RhcmdldCA9IHRoaXMubW9kZWxcbiAgICAgICAgLmdldF93cmFwKClcbiAgICAgICAgLmZpbmQoJy5pbnB1dGZvbGxvdy1lcnJvcicpXG4gICAgICAgIC5maWx0ZXIoYFtkYXRhLXRhcmdldD1cIiR7a2V5fVwiXWApXG4gICAgICBpZiAoZXJyX3RhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgaGFzRXJyb3JUYXJnZXQgPSB0cnVlXG4gICAgICAgIGVycl90YXJnZXQuYXR0cignaWQnLCBlcnJfaWQpXG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJ1bGUpKSB7XG4gICAgICAgICAgcnVsZS5tYXAoKHIpID0+IHtcbiAgICAgICAgICAgIHZhciB0Y2hlY2sgPSBpbnB1dEZvbGxvdy5jaGVja19ydWxlcyhyKVxuICAgICAgICAgICAgY2hlY2sgPSBjaGVjayB8fCB0Y2hlY2sgPyBJU19WQUxJRCA6IElTX0xJTUlUXG5cbiAgICAgICAgICAgIGlmICh0Y2hlY2sgPT09IElTX1ZBTElEKSB7XG4gICAgICAgICAgICAgIHN1Yl90YXJnZXRfcnVsZXMucHVzaChyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tfaGFuZGxlcihyLCB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIGZsYWcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIGlmIChlcnJvciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tb2RlbC5nZXRfbWVzc2FnZXMoKVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZXNzYWdlcywga2V5KSAmJlxuICAgICAgICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1lc3NhZ2VzW2tleV0sIHIudHlwZSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGVycm9yID0gbWVzc2FnZXNba2V5XSFbci50eXBlXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAocnVsZSkge1xuICAgICAgICAgIGNoZWNrID0gaW5wdXRGb2xsb3cuY2hlY2tfcnVsZXMocnVsZSlcbiAgICAgICAgICBmbGFnID0gdGhpcy5jaGVja19oYW5kbGVyKHJ1bGUsIHRhcmdldClcblxuICAgICAgICAgIGlmIChjaGVjayA9PT0gSVNfVkFMSUQpIHtcbiAgICAgICAgICAgIHN1Yl90YXJnZXRfcnVsZXMucHVzaChydWxlKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tb2RlbC5nZXRfbWVzc2FnZXMoKVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZXNzYWdlcywga2V5KSAmJlxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1lc3NhZ2VzW2tleV0sIHJ1bGUudHlwZSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGVycm9yID0gbWVzc2FnZXNba2V5XSFbcnVsZS50eXBlXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2hlY2sgPT09IElTX1ZBTElEKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldHMgPSB0aGlzLm1vZGVsLmdldF90YXJnZXQoKVxuICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlX2Vycm9yX3Zpc2libGUodGFyZ2V0LCB0YXJnZXRzLCBzdWJfdGFyZ2V0X3J1bGVzLCBmbGFnKVxuXG4gICAgICAgICAgLy8gUmVtb3ZlIEVycm9yIE1lc3NhZ2VcbiAgICAgICAgICBpZiAoaGFzRXJyb3JUYXJnZXQpIHtcbiAgICAgICAgICAgICQoJyMnICsgZXJyX2lkKVxuICAgICAgICAgICAgICAudGV4dCgnJylcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdpbnB1dGZvbGxvdy1lcnJvci1lbXB0eScpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyMnICsgZXJyX2lkKS5yZW1vdmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDbGVhciBFcnJvciBNZXNzYWdlXG4gICAgICAgICAgdGhpcy5tb2RlbC5pbmNyZW1lbnRfZXJyb3JzKClcbiAgICAgICAgICBpZiAoaGFzRXJyb3JUYXJnZXQpIHtcbiAgICAgICAgICAgICQoJyMnICsgZXJyX2lkKVxuICAgICAgICAgICAgICAudGV4dCgnJylcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdpbnB1dGZvbGxvdy1lcnJvci1lbXB0eScpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyMnICsgZXJyX2lkKS5yZW1vdmUoKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERpc3BsYXkgRXJyb3IgTWVzc2FnZVxuICAgICAgICAgIGlmIChlcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5wdXNoX2Vycm9yX21lcyhlcnJvcilcbiAgICAgICAgICAgIGlmICh0YXJnZXQuZGF0YSgnaXNfZm9jdXNlZCcpIHx8IHRoaXMuaW5pdGlhbF9lcnJvcl92aWV3KSB7XG4gICAgICAgICAgICAgIGlmIChoYXNFcnJvclRhcmdldCkge1xuICAgICAgICAgICAgICAgICQoJyMnICsgZXJyX2lkKVxuICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpbnB1dGZvbGxvdy1lcnJvci1lbXB0eScpXG4gICAgICAgICAgICAgICAgICAudGV4dChlcnJvcilcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuZXEoMCkuYWZ0ZXIoXG4gICAgICAgICAgICAgICAgICAkKCc8c3Bhbj4nLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBlcnJfaWQsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXRmb2xsb3ctZXJyb3InLFxuICAgICAgICAgICAgICAgICAgfSkudGV4dChlcnJvcilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLnRvZ2dsZV9lcnJvcl92aXNpYmxlKHRhcmdldCwgdGFyZ2V0cywgc3ViX3RhcmdldF9ydWxlcywgZmxhZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uX3ZhbGlkYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uX3ZhbGlkYXRlKClcbiAgICB9XG4gIH1cblxuICB0b2dnbGVfZXJyb3JfdmlzaWJsZShcbiAgICB0YXJnZXQ6IEpRdWVyeTxIVE1MRWxlbWVudD4sXG4gICAgdGFyZ2V0czogVGFyZ2V0LFxuICAgIHN1Yl90YXJnZXRfcnVsZXM6IFJ1bGVPcHRpb25bXSxcbiAgICBmbGFnOiBib29sZWFuXG4gICkge1xuICAgIGlmIChmbGFnKSB7XG4gICAgICB0YXJnZXQuYWRkQ2xhc3ModGhpcy52YWxpZF9jbGFzcykucmVtb3ZlQ2xhc3ModGhpcy5lcnJvcl9jbGFzcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUNsYXNzKHRoaXMudmFsaWRfY2xhc3MpLmFkZENsYXNzKHRoaXMuZXJyb3JfY2xhc3MpXG4gICAgfVxuXG4gICAgc3ViX3RhcmdldF9ydWxlcy5tYXAoKHN2KSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzdi53aXRoKSkge1xuICAgICAgICBzdi53aXRoLm1hcCgoc3R2KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXRzLCBzdHYpKSB7XG4gICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICB0YXJnZXRzW3N0dl0hLmFkZENsYXNzKHRoaXMudmFsaWRfY2xhc3MpLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JfY2xhc3NcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0c1tzdHZdIS5yZW1vdmVDbGFzcyh0aGlzLnZhbGlkX2NsYXNzKS5hZGRDbGFzcyhcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yX2NsYXNzXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAoc3YuaWYpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc3YuaWYpLm1hcCgoc3R2KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXRzLCBzdHYpKSB7XG4gICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICB0YXJnZXRzW3N0dl0hLmFkZENsYXNzKHRoaXMudmFsaWRfY2xhc3MpLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JfY2xhc3NcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0c1tzdHZdIS5yZW1vdmVDbGFzcyh0aGlzLnZhbGlkX2NsYXNzKS5hZGRDbGFzcyhcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yX2NsYXNzXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldF9lcnJvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0X2Vycm9ycygpXG4gIH1cblxuICBjaGVja19oYW5kbGVyKHJ1bGU6IFJ1bGVPcHRpb24sIHRhcmdldDogSlF1ZXJ5KTogYm9vbGVhbiB7XG4gICAgY29uc3QgaGFuZGxlciA9IGlucHV0Rm9sbG93LmdldF9tZXRob2QocnVsZS50eXBlKVxuICAgIGlmIChoYW5kbGVyID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRzID0gdGhpcy5tb2RlbC5nZXRfdGFyZ2V0KClcblxuICAgIGlmIChydWxlLmlmKSB7XG4gICAgICBsZXQgZmxhZyA9IHRydWVcblxuICAgICAgT2JqZWN0LmtleXMocnVsZS5pZikubWFwKCh0YXJnZXQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFydWxlLmlmIHx8XG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChydWxlLmlmLCB0YXJnZXQpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBydWxlLmlmW3RhcmdldF1cbiAgICAgICAgaWYgKHRhcmdldHMuaGFzT3duUHJvcGVydHkodGFyZ2V0KSkge1xuICAgICAgICAgIGNvbnN0IHQgPSB0YXJnZXRzW3RhcmdldF0hXG4gICAgICAgICAgbGV0IGNvbXBhcmVcbiAgICAgICAgICBpZiAodC5pcygnW3R5cGU9XCJyYWRpb1wiXScpIHx8IHQuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSkge1xuICAgICAgICAgICAgY29tcGFyZSA9IHQuZmlsdGVyKCc6Y2hlY2tlZCcpLnZhbCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0YXJnZXRzW3RhcmdldF0hLnZhbCgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb21wYXJlID09IHZhbHVlKSB7XG4gICAgICAgICAgICBmbGFnID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChmbGFnID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFydWxlLm1vZGUgJiYgIXJ1bGUud2l0aCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIodGFyZ2V0KVxuICAgIH1cblxuICAgIGlmIChydWxlLm1vZGUgJiYgcnVsZS53aXRoKSB7XG4gICAgICBpZiAocnVsZS5tb2RlLnRvTG93ZXJDYXNlKCkgPT09ICdvcicpIHtcbiAgICAgICAgbGV0IGZsYWcgPSBoYW5kbGVyKHRhcmdldClcblxuICAgICAgICBydWxlLndpdGgubWFwKCh0KSA9PiB7XG4gICAgICAgICAgaWYgKHRhcmdldHMuaGFzT3duUHJvcGVydHkodCkpIHtcbiAgICAgICAgICAgIGZsYWcgPSBmbGFnIHx8IGhhbmRsZXIodGFyZ2V0c1t0XSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGZsYWdcbiAgICAgIH0gZWxzZSBpZiAocnVsZS5tb2RlLnRvTG93ZXJDYXNlKCkgPT09ICdhbmQnKSB7XG4gICAgICAgIGxldCBmbGFnID0gaGFuZGxlcih0YXJnZXQpXG5cbiAgICAgICAgcnVsZS53aXRoLm1hcCgodCkgPT4ge1xuICAgICAgICAgIGlmICh0YXJnZXRzLmhhc093blByb3BlcnR5KHQpKSB7XG4gICAgICAgICAgICBmbGFnID0gZmxhZyAmJiBoYW5kbGVyKHRhcmdldHNbdF0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBmbGFnXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubW9kZWwucmVzZXRfcnVsZXMoKVxuICAgIHRoaXMuc2V0X2V2ZW50KClcbiAgICB0aGlzLnZhbGlkYXRlX2FsbCgpXG4gIH1cbn1cbiIsImltcG9ydCB7IEluaXRpYWxQYXJhbSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgSW5wdXRGb2xsb3dNZXRob2QgZnJvbSAnLi9JbnB1dEZvbGxvd01ldGhvZCdcbmltcG9ydCBpbnB1dEZvbGxvdyBmcm9tICcuL2luc3RhbmNlJ1xuXG4kLmZuLmV4dGVuZCh7XG4gIGlucHV0Zm9sbG93OiBmdW5jdGlvbiAocGFyYW06IEluaXRpYWxQYXJhbSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgYXMgSFRNTEVsZW1lbnRcblxuICAgIGlmICghJCh0YXJnZXQpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBtZXRob2Q6IElucHV0Rm9sbG93TWV0aG9kIHwgdW5kZWZpbmVkXG5cbiAgICBpZiAoISQodGFyZ2V0KS5kYXRhKCdpbnB1dGZvbGxvd19pZCcpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGlucHV0Rm9sbG93LmdldF9pbmRleCgpXG4gICAgICAkKHRhcmdldCkuZGF0YSgnaW5wdXRmb2xsb3dfaWQnLCBpbmRleClcblxuICAgICAgbWV0aG9kID0gbmV3IElucHV0Rm9sbG93TWV0aG9kKCQodGFyZ2V0KSwgaW5kZXgpXG4gICAgICBpbnB1dEZvbGxvdy5wdXNoX2NvbGxlY3Rpb24oaW5kZXgsIG1ldGhvZClcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSAkKHRhcmdldCkuZGF0YSgnaW5wdXRmb2xsb3dfaWQnKVxuICAgICAgbWV0aG9kID0gaW5wdXRGb2xsb3cuZ2V0X2NvbGxlY3Rpb24oaW5kZXgpXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtICYmIG1ldGhvZCkge1xuICAgICAgbWV0aG9kLmluaXQocGFyYW0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZFxuICB9LFxufSlcbiJdLCJuYW1lcyI6WyJfX2Fzc2lnbiIsIk9iamVjdCIsImFzc2lnbiIsInQiLCJzIiwiaSIsIm4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiYXBwbHkiLCJpbnB1dEZvbGxvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFBTyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUE7SUFDckIsSUFBTSxRQUFRLEdBQUcsS0FBSzs7SUM0QnRCLElBQUlBLE9BQVEsR0FBRyxvQkFBVztJQUM3QkEsRUFBQUEsT0FBUSxHQUFHQyxNQUFNLENBQUNDLE1BQVAsSUFBaUIsU0FBU0YsUUFBVCxDQUFrQkcsQ0FBbEIsRUFBcUI7SUFDN0MsU0FBSyxJQUFJQyxDQUFKLEVBQU9DLENBQUMsR0FBRyxDQUFYLEVBQWNDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFqQyxFQUF5Q0gsQ0FBQyxHQUFHQyxDQUE3QyxFQUFnREQsQ0FBQyxFQUFqRCxFQUFxRDtJQUNqREQsTUFBQUEsQ0FBQyxHQUFHRyxTQUFTLENBQUNGLENBQUQsQ0FBYjs7SUFDQSxXQUFLLElBQUlJLENBQVQsSUFBY0wsQ0FBZDtJ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
