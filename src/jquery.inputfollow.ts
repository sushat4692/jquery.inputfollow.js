/**
 * jquery.inputfollow.js
 *
 * @version 2.0.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.inputfollow.js
 */

interface RuleFlagInterface {
    [key: string]: boolean
}
interface RuleInterface {
    [key: string]: string | string[]
}
interface MessageInterface {
    [key: string]: {
        [key: string] : string
    }
}
interface TargetInterface {
    [key: string]: JQuery
}
interface InitialParamInterface {
    rules?: RuleInterface
    messages?: MessageInterface
    error_class?: string
    valid_class?: string
    initial_error_view?: boolean
    on_validate?: Function
    on_success?: Function
    on_error?: Function
}

(function($) {
    "use strict";

    const IS_VALID = true
    const IS_LIMIT = false

    class InputFollow {
        private index = 0
        private collection: InputFollowMethod[] = []
        private rules: RuleFlagInterface = {
            required: IS_VALID,
            email: IS_VALID,
            number: IS_LIMIT,
            code: IS_LIMIT,
        }

        get_index(): number {
            const index = this.index
            this.index += 1
            return index
        }

        push_collection(index: number, method: InputFollowMethod) {
            this.collection[index] = method
        }
        get_collection(index: number): InputFollowMethod {
            return this.collection[index]
        }

        check_rules(rule: string): boolean {
            if (this.rules.hasOwnProperty(rule)) {
                return this.rules[rule]
            }

            let match
            if (match = rule.match(/^(.*?)_(or|and)_.*$/i)) {
                if (this.rules.hasOwnProperty(match[1])) {
                    return this.rules[match[1]]
                }
            }

            return false
        }

        get_method(key: string): any {
            switch(key) {
                case 'required':
                    return this.check_method_required.bind(this)
                case 'email':
                    return this.check_method_email.bind(this)
                case 'number':
                    return this.check_method_number.bind(this)
                case 'code':
                    return this.check_method_code.bind(this)
            }

            return false
        }

        /**
         * Check required
         * @param target
         * @return boolean
         */
        check_method_required(target: JQuery): boolean {
            if (
                target.is('[type="radio"]') ||
                target.is('[type="checkbox"]')
            ) {
                return target.filter(':checked').length > 0
            }

            return target.val() !== ''
        }

        /**
         * Check email
         * @param target
         * @return boolean
         */
        check_method_email(target: JQuery): boolean {
            return /^([a-z0-9_]|\-|\.|\+)+@(([a-z0-9_]|\-)+\.)+[a-z]{2,6}$/
                    .test(target.val() + '')
        }

        check_method_number(target: JQuery): boolean {
            let val: string = target.val() + ''
            const org: string = val

            // Full width to Half width characters
            val = val.replace(
                /[Ａ-Ｚａ-ｚ０-９]/g,
                (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
            )

            // Remove text except for numbers
            val = val.replace( /[^0-9]/g, '' )

            if (val !== org) {
                target.val(val)

                if (target.is(':focus')) {
                    this.change_caret_pos(target, val)
                }
            }

            return true
        }

        check_method_code(target: JQuery): boolean {
            let val: string = target.val() + ''
            const org: string = val

            // Full width to Half width characters
            val = val.replace(
                /[Ａ-Ｚａ-ｚ０-９]/g,
                (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
            )

            // Convert dash
            val = val.replace( /[−ーー―]/g, '-' )

            // Remove text except for numbers
            val = val.replace( /[^0-9]/g, '' )

            if (val !== org) {
                target.val(val)

                if (target.is(':focus')) {
                    this.change_caret_pos(target, val)
                }
            }

            return true
        }

        change_caret_pos(target: JQuery, val: string) {
            const pos =
                val.length -
                target.data('before_val').length +
                target.data('caret_pos')

            if ((document as any).selection !== undefined) {
                const range = (target.get(0) as any).createTextRange()
                range.move('character', pos)
                range.select()
            } else {
                try {
                    (target.get(0) as HTMLInputElement).setSelectionRange(pos, pos)
                } catch(e) {
                    // Cannot change caret pos
                }
            }
        }

        get_caret_pos(target: HTMLInputElement): number {
            if ((document as any).selection !== undefined) {
                const range = (document as any).selection.createRange()
                let tmp = document.createRange() as any

                try {
                    (tmp as any).moveToElementText(target)
                    tmp.setEndPoint('StartToStart', range)
                } catch (e) {
                    tmp = (target as any).createTextRange()
                    tmp.setEndPoint('StartToStart', range)
                }

                return target.value.length - tmp.text.length
            } else {
                try {
                    return target.selectionStart || 0
                } catch(e) {
                    return 0
                }
            }
        }

        split_related_rules(rule: string): string[] {
            return rule.split('_and_').join('_or_').split('_or_').slice(1)
        }
    }

    class InputFollowMethod {
        private index: number = 0
        private model: InputFollowModel
        private error_class: string = 'error'
        private valid_class: string = 'valid'
        private initial_error_view: boolean = false
        private on_validate: Function = () => {}
        private on_success: Function = () => {}
        private on_error: Function = () => {}

        constructor(target: JQuery, index: number) {
            this.model = new InputFollowModel(target)
            this.index = index

            target.on('submit', () => {
                this.set_initial_error_view(true)
                this.validate_all()

                if (this.model.get_errors() <= 0) {
                    if ($.isFunction(this.on_success)) {
                        this.on_success()
                    }
                    return true
                } else {
                    if ($.isFunction(this.on_error)) {
                        this.on_error(this.model.get_error_mes())
                    }
                    return false
                }
            })
        }

        init(param: InitialParamInterface) {
            if (param.hasOwnProperty('rules') && param.rules) {
                this.set_rules(param.rules)
            }
            if (param.hasOwnProperty('messages') && param.messages) {
                this.set_messages(param.messages)
            }
            if (param.hasOwnProperty('error_class') && param.error_class) {
                this.set_error_class(param.error_class)
            }
            if (param.hasOwnProperty('valid_class') && param.valid_class) {
                this.set_valid_class(param.valid_class)
            }
            if (param.hasOwnProperty('initial_error_view') && param.initial_error_view) {
                this.set_initial_error_view(param.initial_error_view)
            }
            if (param.hasOwnProperty('on_validate') && param.on_validate) {
                this.set_on_validate(param.on_validate)
            }
            if (param.hasOwnProperty('on_success') && param.on_success) {
                this.set_on_success(param.on_success)
            }
            if (param.hasOwnProperty('on_error') && param.on_error) {
                this.set_on_error(param.on_error)
            }

            this.set_event()
            this.validate_all()
        }

        set_rules(rules: RuleInterface) {
            this.model.set_rules(rules)
        }

        set_messages(messages: MessageInterface) {
            this.model.set_messages(messages)
        }

        set_error_class(error_class: string) {
            this.error_class = error_class
        }

        set_valid_class(valid_class: string) {
            this.valid_class = valid_class
        }

        set_initial_error_view(initial_error_view: boolean) {
            this.initial_error_view = initial_error_view
        }

        set_on_validate(func: Function) {
            if ($.isFunction(func)) {
                this.on_validate = func
            }
        }

        set_on_success(func: Function) {
            if ($.isFunction(func)) {
                this.on_success = func
            }
        }

        set_on_error(func: Function) {
            if ($.isFunction(func)) {
                this.on_error = func
            }
        }

        set_event() {
            const that = this
            this.model.get_wrap()
                .find('input,select,textarea')
                .off('keydown.inputfollow')
                .on('keydown.inputfollow', function() {
                    that.validate_before($(this))
                })
                .off('click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow')
                .on('click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow',
                    function() {
                        that.validate($(this))
                    })
        }

        validate_before(target: JQuery) {
            if (! target.data('is_inputfollow') && target.is(':focus')) {
                return
            }

            target
                .data('before_val', target.val() + '')
                .data('caret_pos', inputFollow.get_caret_pos(target.get(0) as HTMLInputElement))
        }

        validate(target: JQuery) {
            if (! target.data('is_inputfollow')) {
                return
            }

            this.validate_all()
        }

        validate_all() {
            this.model.set_errors(0)
            this.model.set_error_mes('')

            $.each(this.model.get_target(), (key: string, target) => {
                const rules = this.model.get_rules()
                if (! rules.hasOwnProperty(key)) {
                    return
                }
                const rule = rules[key]
                const sub_target_rules = []

                let flag = true
                let check = false
                let error: any = null

                let hasErrorTarget = false
                const err_id = 'inputfollow-error-' + this.index + '-' + key.replace('[]', '')
                const err_target =
                    this.model.get_wrap()
                        .find('.inputfollow-error')
                        .filter(`[data-target="${key}"]`)
                if (err_target.length) {
                    hasErrorTarget = true
                    err_target.attr('id', err_id)
                }

                if (target.length) {
                    if ($.isArray(rule) || $.isPlainObject(rule)) {
                        $.each(rule, (k, r) => {
                            var tcheck = inputFollow.check_rules(r)
                            check = check || tcheck ? IS_VALID : IS_LIMIT

                            if (tcheck === IS_VALID) {
                                sub_target_rules.push(r)
                            }

                            if(! this.check_handler(r, target)) {
                                flag = false

                                if(error === null) {
                                    const messages = this.model.get_messages()
                                    if (
                                        Object.prototype.hasOwnProperty.call(messages, key) &&
                                        Object.prototype.hasOwnProperty.call(messages[key], r)
                                    ) {
                                        error = messages[key][r]
                                    }
                                }
                            }
                        })
                    } else {
                        check = inputFollow.check_rules(rule)
                        flag = this.check_handler(rule, target)

                        if (check === IS_VALID) {
                            sub_target_rules.push(rule)
                        }

                        const messages = this.model.get_messages()
                        if (
                            Object.prototype.hasOwnProperty.call(messages, key) &&
                            Object.prototype.hasOwnProperty.call(messages[key], rule)
                        ) {
                            error = messages[key][rule]
                        }
                    }
                }

                if (check === IS_VALID) {
                    const targets = this.model.get_target()
                    if (flag) {
                        target
                            .addClass(this.valid_class)
                            .removeClass(this.error_class)

                        $.each(sub_target_rules, (si, sv) => {
                            const sub_targets = inputFollow.split_related_rules(sv)
                            $.each(sub_targets, (sti, stv) => {
                                targets[stv]
                                    .addClass(this.valid_class)
                                    .removeClass(this.error_class)
                            })
                        })

                        // Remove Error Message
                        if (hasErrorTarget) {
                            $('#' + err_id).text('').addClass('inputfollow-error-empty')
                        } else {
                            $('#' + err_id).remove()
                        }
                    } else {
                        this.model.increment_errors()
                        if (hasErrorTarget) {
                            $('#' + err_id).text('').addClass('inputfollow-error-empty')
                        } else {
                            $('#' + err_id).remove()
                        }

                        // Display Error Message
                        if (error !== null) {
                            this.model.push_error_mes(error)
                            if (target.data('is_focused') || this.initial_error_view) {
                                if (hasErrorTarget) {
                                    $('#' + err_id).removeClass('inputfollow-error-empty').text(error)
                                } else {
                                    target.eq(0).after(
                                        $('<span>', {id: err_id, 'class': 'inputfollow-error'})
                                            .text(error)
                                    )
                                }

                                target
                                    .removeClass( this.valid_class )
                                    .addClass( this.error_class )

                                // Add error class to related element
                                $.each(sub_target_rules, (si, sv) => {
                                    const sub_targets = inputFollow.split_related_rules(sv)
                                    $.each(sub_targets, (sti, stv) => {
                                        targets[stv]
                                            .removeClass(this.valid_class)
                                            .addClass(this.error_class)
                                    })
                                })
                            }
                        }
                    }
                }
            })

            if ($.isFunction(this.on_validate)) {
                this.on_validate()
            }
        }

        get_errors() {
            return this.model.get_errors()
        }

        check_handler(mode: string, target: JQuery): boolean {
            let handler = inputFollow.get_method(mode)
            if (handler !== false) {
                return handler(target)
            }

            let match
            const targets = this.model.get_target()

            if (match = mode.match(/^(.*?)_or_.*$/i)) {
                handler = inputFollow.get_method(match[1])
                if (handler !== false) {
                    let flag = handler(target)

                    const sub_targets = mode.split('_or_').slice(1)
                    $.each(sub_targets, (i, t) => {
                        if (targets.hasOwnProperty(t)) {
                            flag = flag || handler(targets[t])
                        }
                    })

                    return flag
                }
            } else if (match = mode.match(/^(.*?)_and_(.*)$/i)) {
                handler = inputFollow.get_method(match[1])
                if (handler !== false) {
                    let flag = handler(target)

                    const sub_targets = mode.split('_and_').slice(1)
                    $.each(sub_targets, (i, t) => {
                        if (targets.hasOwnProperty(t)) {
                            flag = flag && handler(targets[t])
                        }
                    })

                    return flag
                }
            }

            return true
        }

        reset() {
            this.model.reset_rules()
            this.set_event()
            this.validate_all()
        }
    }

    class InputFollowModel {
        private wrap: JQuery
        private errors: number = 0
        private error_mes: string = ''
        private rules: RuleInterface = {}
        private target: TargetInterface = {}
        private messages: MessageInterface = {}

        constructor(wrap: JQuery) {
            this.wrap = wrap
        }

        get_wrap(): JQuery {
            return this.wrap
        }

        get_target(): TargetInterface {
            return this.target
        }

        set_rules(rules: RuleInterface): void {
            this.rules = {...rules}

            this.reset_rules()
        }
        get_rules(): RuleInterface {
            return this.rules
        }

        set_errors(errors: number) {
            this.errors = errors
        }
        increment_errors(increment: number = 1) {
            this.errors += increment
        }
        get_errors(): number {
            return this.errors
        }

        set_error_mes(error_mes: string): void {
            this.error_mes = error_mes
        }
        push_error_mes(error_mes: string): void {
            this.error_mes += '\n' + error_mes
        }
        get_error_mes(): string {
            return this.error_mes
        }

        set_messages(messages: MessageInterface): void {
            this.messages = {...messages}
        }
        get_messages(): MessageInterface {
            return this.messages
        }

        reset_rules(): void {
            this.wrap.find('input, select, textarea')
                .off('focus.inputfollow_focus')

            for(const key in this.rules) {
                const parent: JQuery = this.filter_target(key)
                this.target[key] = this.initialize_target(parent)

                if ($.isArray(this.rules[key]) || $.isPlainObject(this.rules[key])) {
                    for (let i = 0, l = this.rules[key].length; i < l; i += 1) {
                        const targetRules = inputFollow.split_related_rules(this.rules[key][i])
                        $.each(targetRules, (key, val) => {
                            this.target[val] =
                                this.initialize_target(this.filter_target(val), parent)
                        })
                    }
                } else {
                    const targetRules = inputFollow.split_related_rules(this.rules[key] as string)
                    $.each(targetRules, (key, val) => {
                        this.target[val] =
                            this.initialize_target(this.filter_target(val), parent)
                    })
                }
            }
        }

        enable_focus_flag(target: JQuery): any {
            return (): void => {
                target.data('is_focused', true)
            }
        }

        filter_target(key: string): JQuery {
            return this.wrap.find( 'input,select,textarea' )
                .filter((index: number, element: Element): boolean => {
                    const pattern = new RegExp('^' + key + '\\[?', 'i')
                    return pattern.test(element.getAttribute('name') || '')
                })
        }

        initialize_target(target: JQuery, parent: JQuery | null = null): JQuery {
            const focusTarget: JQuery = parent !== null ? parent as JQuery : target

            return target
                .data('is_inputfollow', true)
                .data('is_focused', false)
                .off('focus.inputfollow_focus')
                .on('focus.inputfollow_focus', this.enable_focus_flag(focusTarget))
        }
    }

    const inputFollow = new InputFollow()

    $.fn.extend({
        'inputfollow': function (param: InitialParamInterface) {
            if (! $(this).length) {
                return
            }
            let method = null

            if (! $(this).data('inputfollow_id')) {
                const index = inputFollow.get_index()
                $(this).data('inputfollow_id', index)

                method = new InputFollowMethod($(this), index)
                inputFollow.push_collection(index, method)
            } else {
                const index = $(this).data('inputfollow_id')
                method = inputFollow.get_collection(index)
            }

            if (param) {
                method.init(param)
            }

            return method
        }
    })

})(jQuery)