"use strict";
/**
 * jquery.inputfollow.js
 *
 * @version 2.0.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.inputfollow.js
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function ($) {
    "use strict";
    var IS_VALID = true;
    var IS_LIMIT = false;
    var InputFollow = /** @class */ (function () {
        function InputFollow() {
            this.index = 0;
            this.collection = [];
            this.rules = {
                required: IS_VALID,
                email: IS_VALID,
                number: IS_LIMIT,
                code: IS_LIMIT
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
            if (this.rules.hasOwnProperty(rule)) {
                return this.rules[rule];
            }
            var match;
            if (match = rule.match(/^(.*?)_(or|and)_.*$/i)) {
                if (this.rules.hasOwnProperty(match[1])) {
                    return this.rules[match[1]];
                }
            }
            return false;
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
            if (target.is('[type="radio"]') ||
                target.is('[type="checkbox"]')) {
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
            return /^([a-z0-9_]|\-|\.|\+)+@(([a-z0-9_]|\-)+\.)+[a-z]{2,6}$/
                .test(target.val() + '');
        };
        InputFollow.prototype.check_method_number = function (target) {
            var val = target.val() + '';
            var org = val;
            // Full width to Half width characters
            val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); });
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
            val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); });
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
            var pos = val.length -
                target.data('before_val').length +
                target.data('caret_pos');
            if (document.selection !== undefined) {
                var range = target.get(0).createTextRange();
                range.move('character', pos);
                range.select();
            }
            else {
                try {
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
                    if ($.isFunction(_this.on_success)) {
                        _this.on_success();
                    }
                    return true;
                }
                else {
                    if ($.isFunction(_this.on_error)) {
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
            if (param.hasOwnProperty('initial_error_view') && param.initial_error_view) {
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
            if ($.isFunction(func)) {
                this.on_validate = func;
            }
        };
        InputFollowMethod.prototype.set_on_success = function (func) {
            if ($.isFunction(func)) {
                this.on_success = func;
            }
        };
        InputFollowMethod.prototype.set_on_error = function (func) {
            if ($.isFunction(func)) {
                this.on_error = func;
            }
        };
        InputFollowMethod.prototype.set_event = function () {
            var that = this;
            this.model.get_wrap()
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
                .data('caret_pos', inputFollow.get_caret_pos(target.get(0)));
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
                var err_target = _this.model.get_wrap()
                    .find('.inputfollow-error')
                    .filter("[data-target=\"" + key + "\"]");
                if (err_target.length) {
                    hasErrorTarget = true;
                    err_target.attr('id', err_id);
                }
                if (target.length) {
                    if ($.isArray(rule) || $.isPlainObject(rule)) {
                        $.each(rule, function (k, r) {
                            var tcheck = inputFollow.check_rules(r);
                            check = check || tcheck ? IS_VALID : IS_LIMIT;
                            if (tcheck === IS_VALID) {
                                sub_target_rules.push(r);
                            }
                            if (!_this.check_handler(r, target)) {
                                flag = false;
                                if (error === null) {
                                    var messages = _this.model.get_messages();
                                    if (Object.prototype.hasOwnProperty.call(messages, key) &&
                                        Object.prototype.hasOwnProperty.call(messages[key], r)) {
                                        error = messages[key][r];
                                    }
                                }
                            }
                        });
                    }
                    else {
                        check = inputFollow.check_rules(rule);
                        flag = _this.check_handler(rule, target);
                        if (check === IS_VALID) {
                            sub_target_rules.push(rule);
                        }
                        var messages = _this.model.get_messages();
                        if (Object.prototype.hasOwnProperty.call(messages, key) &&
                            Object.prototype.hasOwnProperty.call(messages[key], rule)) {
                            error = messages[key][rule];
                        }
                    }
                }
                if (check === IS_VALID) {
                    var targets_1 = _this.model.get_target();
                    if (flag) {
                        target
                            .addClass(_this.valid_class)
                            .removeClass(_this.error_class);
                        $.each(sub_target_rules, function (si, sv) {
                            var sub_targets = inputFollow.split_related_rules(sv);
                            $.each(sub_targets, function (sti, stv) {
                                targets_1[stv]
                                    .addClass(_this.valid_class)
                                    .removeClass(_this.error_class);
                            });
                        });
                        // Remove Error Message
                        if (hasErrorTarget) {
                            $('#' + err_id).text('').addClass('inputfollow-error-empty');
                        }
                        else {
                            $('#' + err_id).remove();
                        }
                    }
                    else {
                        _this.model.increment_errors();
                        if (hasErrorTarget) {
                            $('#' + err_id).text('').addClass('inputfollow-error-empty');
                        }
                        else {
                            $('#' + err_id).remove();
                        }
                        // Display Error Message
                        if (error !== null) {
                            _this.model.push_error_mes(error);
                            if (target.data('is_focused') || _this.initial_error_view) {
                                if (hasErrorTarget) {
                                    $('#' + err_id).removeClass('inputfollow-error-empty').text(error);
                                }
                                else {
                                    target.eq(0).after($('<span>', { id: err_id, 'class': 'inputfollow-error' })
                                        .text(error));
                                }
                                target
                                    .removeClass(_this.valid_class)
                                    .addClass(_this.error_class);
                                // Add error class to related element
                                $.each(sub_target_rules, function (si, sv) {
                                    var sub_targets = inputFollow.split_related_rules(sv);
                                    $.each(sub_targets, function (sti, stv) {
                                        targets_1[stv]
                                            .removeClass(_this.valid_class)
                                            .addClass(_this.error_class);
                                    });
                                });
                            }
                        }
                    }
                }
            });
            if ($.isFunction(this.on_validate)) {
                this.on_validate();
            }
        };
        InputFollowMethod.prototype.get_errors = function () {
            return this.model.get_errors();
        };
        InputFollowMethod.prototype.check_handler = function (mode, target) {
            var handler = inputFollow.get_method(mode);
            if (handler !== false) {
                return handler(target);
            }
            var match;
            var targets = this.model.get_target();
            if (match = mode.match(/^(.*?)_or_.*$/i)) {
                handler = inputFollow.get_method(match[1]);
                if (handler !== false) {
                    var flag_1 = handler(target);
                    var sub_targets = mode.split('_or_').slice(1);
                    $.each(sub_targets, function (i, t) {
                        if (targets.hasOwnProperty(t)) {
                            flag_1 = flag_1 || handler(targets[t]);
                        }
                    });
                    return flag_1;
                }
            }
            else if (match = mode.match(/^(.*?)_and_(.*)$/i)) {
                handler = inputFollow.get_method(match[1]);
                if (handler !== false) {
                    var flag_2 = handler(target);
                    var sub_targets = mode.split('_and_').slice(1);
                    $.each(sub_targets, function (i, t) {
                        if (targets.hasOwnProperty(t)) {
                            flag_2 = flag_2 && handler(targets[t]);
                        }
                    });
                    return flag_2;
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
            this.rules = __assign({}, rules);
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
            this.messages = __assign({}, messages);
        };
        InputFollowModel.prototype.get_messages = function () {
            return this.messages;
        };
        InputFollowModel.prototype.reset_rules = function () {
            var _this = this;
            this.wrap.find('input, select, textarea')
                .off('focus.inputfollow_focus');
            var _loop_1 = function (key) {
                var parent_1 = this_1.filter_target(key);
                this_1.target[key] = this_1.initialize_target(parent_1);
                if ($.isArray(this_1.rules[key]) || $.isPlainObject(this_1.rules[key])) {
                    for (var i = 0, l = this_1.rules[key].length; i < l; i += 1) {
                        var targetRules = inputFollow.split_related_rules(this_1.rules[key][i]);
                        $.each(targetRules, function (key, val) {
                            _this.target[val] =
                                _this.initialize_target(_this.filter_target(val), parent_1);
                        });
                    }
                }
                else {
                    var targetRules = inputFollow.split_related_rules(this_1.rules[key]);
                    $.each(targetRules, function (key, val) {
                        _this.target[val] =
                            _this.initialize_target(_this.filter_target(val), parent_1);
                    });
                }
            };
            var this_1 = this;
            for (var key in this.rules) {
                _loop_1(key);
            }
        };
        InputFollowModel.prototype.enable_focus_flag = function (target) {
            return function () {
                target.data('is_focused', true);
            };
        };
        InputFollowModel.prototype.filter_target = function (key) {
            return this.wrap.find('input,select,textarea')
                .filter(function (index, element) {
                var pattern = new RegExp('^' + key + '\\[?', 'i');
                return pattern.test(element.getAttribute('name') || '');
            });
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
    var inputFollow = new InputFollow();
    $.fn.extend({
        'inputfollow': function (param) {
            if (!$(this).length) {
                return;
            }
            var method = null;
            if (!$(this).data('inputfollow_id')) {
                var index = inputFollow.get_index();
                $(this).data('inputfollow_id', index);
                method = new InputFollowMethod($(this), index);
                inputFollow.push_collection(index, method);
            }
            else {
                var index = $(this).data('inputfollow_id');
                method = inputFollow.get_collection(index);
            }
            if (param) {
                method.init(param);
            }
            return method;
        }
    });
})(jQuery);
