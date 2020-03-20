/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IS_VALID = true;
    exports.IS_LIMIT = false;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, InputFollow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    InputFollow_1 = __importDefault(InputFollow_1);
    var instance = new InputFollow_1.default();
    exports.default = instance;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * jquery.inputfollow.js
 *
 * @version 2.0.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.inputfollow.js
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, InputFollowMethod_1, instance_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    InputFollowMethod_1 = __importDefault(InputFollowMethod_1);
    instance_1 = __importDefault(instance_1);
    $.fn.extend({
        inputfollow: function (param) {
            var target = this;
            if (!$(target).length) {
                return;
            }
            var method;
            if (!$(target).data('inputfollow_id')) {
                var index = instance_1.default.get_index();
                $(target).data('inputfollow_id', index);
                method = new InputFollowMethod_1.default($(target), index);
                instance_1.default.push_collection(index, method);
            }
            else {
                var index = $(target).data('inputfollow_id');
                method = instance_1.default.get_collection(index);
            }
            if (param && method !== null) {
                method.init(param);
            }
            return method;
        }
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(4), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1, InputFollowModel_1, instance_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    InputFollowModel_1 = __importDefault(InputFollowModel_1);
    instance_1 = __importDefault(instance_1);
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
            this.model = new InputFollowModel_1.default(target);
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
                .data('caret_pos', instance_1.default.get_caret_pos(target.get(0)));
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
                            var tcheck = instance_1.default.check_rules(r);
                            check = check || tcheck ? const_1.IS_VALID : const_1.IS_LIMIT;
                            if (tcheck === const_1.IS_VALID) {
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
                    else {
                        check = instance_1.default.check_rules(rule);
                        flag = _this.check_handler(rule, target);
                        if (check === const_1.IS_VALID) {
                            sub_target_rules.push(rule);
                        }
                        var messages = _this.model.get_messages();
                        if (Object.prototype.hasOwnProperty.call(messages, key) &&
                            Object.prototype.hasOwnProperty.call(messages[key], rule.type)) {
                            error = messages[key][rule.type];
                        }
                    }
                }
                if (check === const_1.IS_VALID) {
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
                                        class: 'inputfollow-error'
                                    }).text(error));
                                }
                                _this.toggle_error_visible(target, targets, sub_target_rules, flag);
                            }
                        }
                    }
                }
            });
            if ($.isFunction(this.on_validate)) {
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
                        if (targets[stv]) {
                            if (flag) {
                                targets[stv]
                                    .addClass(_this.valid_class)
                                    .removeClass(_this.error_class);
                            }
                            else {
                                targets[stv]
                                    .removeClass(_this.valid_class)
                                    .addClass(_this.error_class);
                            }
                        }
                    });
                }
                if (sv.if) {
                    Object.keys(sv.if).map(function (stv) {
                        if (targets[stv]) {
                            if (flag) {
                                targets[stv]
                                    .addClass(_this.valid_class)
                                    .removeClass(_this.error_class);
                            }
                            else {
                                targets[stv]
                                    .removeClass(_this.valid_class)
                                    .addClass(_this.error_class);
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
            var handler = instance_1.default.get_method(rule.type);
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
    exports.default = InputFollowMethod;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __assign = (this && this.__assign) || function () {
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            return this.wrap
                .find('input,select,textarea')
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
    exports.default = InputFollowModel;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputFollow = /** @class */ (function () {
        function InputFollow() {
            this.index = 0;
            this.collection = [];
            this.rules = {
                required: const_1.IS_VALID,
                email: const_1.IS_VALID,
                number: const_1.IS_LIMIT,
                code: const_1.IS_LIMIT
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
            if (this.rules.hasOwnProperty(rule.type)) {
                return this.rules[rule.type];
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
            return rule
                .split('_and_')
                .join('_or_')
                .split('_or_')
                .slice(1);
        };
        return InputFollow;
    }());
    exports.default = InputFollow;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);
//# sourceMappingURL=jquery.inputfollow.js.map