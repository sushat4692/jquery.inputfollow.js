import { InitialParam, Rule, Message, RuleOption, Target } from './types'
import { IS_LIMIT, IS_VALID } from './const'
import InputFollowModel from './InputFollowModel'
import inputFollow from './instance'

export default class InputFollowMethod {
  private index: number = 0
  private model: InputFollowModel
  private error_class: string = 'error'
  private valid_class: string = 'valid'
  private initial_error_view: boolean = false
  private on_validate: Function = () => {}
  private on_success: Function = () => {}
  private on_error: Function = () => {}

  constructor(target: JQuery<HTMLElement>, index: number) {
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

  init(param: InitialParam) {
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
    if (
      param.hasOwnProperty('initial_error_view') &&
      param.initial_error_view
    ) {
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

  set_rules(rules: Rule) {
    this.model.set_rules(rules)
  }

  set_messages(messages: Message) {
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
    this.model
      .get_wrap()
      .find('input,select,textarea')
      .off('keydown.inputfollow')
      .on('keydown.inputfollow', function() {
        that.validate_before($(this))
      })
      .off(
        'click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow'
      )
      .on(
        'click.inputfollow focus.inputfollow change.inputfollow keyup.inputfollow',
        function() {
          that.validate($(this))
        }
      )
  }

  validate_before(target: JQuery) {
    if (!target.data('is_inputfollow') && target.is(':focus')) {
      return
    }

    target
      .data('before_val', target.val() + '')
      .data(
        'caret_pos',
        inputFollow.get_caret_pos(target.get(0) as HTMLInputElement)
      )
  }

  validate(target: JQuery) {
    if (!target.data('is_inputfollow')) {
      return
    }

    this.validate_all()
  }

  validate_all() {
    this.model.set_errors(0)
    this.model.set_error_mes('')

    $.each(this.model.get_target(), (key: string, target) => {
      const rules = this.model.get_rules()
      if (!rules.hasOwnProperty(key)) {
        return
      }
      const rule = rules[key]
      const sub_target_rules: RuleOption[] = []

      let flag = true
      let check = false
      let error: any = null

      let hasErrorTarget = false
      const err_id =
        'inputfollow-error-' + this.index + '-' + key.replace('[]', '')
      const err_target = this.model
        .get_wrap()
        .find('.inputfollow-error')
        .filter(`[data-target="${key}"]`)
      if (err_target.length) {
        hasErrorTarget = true
        err_target.attr('id', err_id)
      }

      if (target.length) {
        if (Array.isArray(rule)) {
          rule.map(r => {
            var tcheck = inputFollow.check_rules(r)
            check = check || tcheck ? IS_VALID : IS_LIMIT

            if (tcheck === IS_VALID) {
              sub_target_rules.push(r)
            }

            if (!this.check_handler(r, target)) {
              flag = false

              if (error === null) {
                const messages = this.model.get_messages()
                if (
                  Object.prototype.hasOwnProperty.call(messages, key) &&
                  Object.prototype.hasOwnProperty.call(messages[key], r.type)
                ) {
                  error = messages[key][r.type]
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
            Object.prototype.hasOwnProperty.call(messages[key], rule.type)
          ) {
            error = messages[key][rule.type]
          }
        }
      }

      if (check === IS_VALID) {
        const targets = this.model.get_target()
        if (flag) {
          this.toggle_error_visible(target, targets, sub_target_rules, flag)

          // Remove Error Message
          if (hasErrorTarget) {
            $('#' + err_id)
              .text('')
              .addClass('inputfollow-error-empty')
          } else {
            $('#' + err_id).remove()
          }
        } else {
          // Clear Error Message
          this.model.increment_errors()
          if (hasErrorTarget) {
            $('#' + err_id)
              .text('')
              .addClass('inputfollow-error-empty')
          } else {
            $('#' + err_id).remove()
          }

          // Display Error Message
          if (error !== null) {
            this.model.push_error_mes(error)
            if (target.data('is_focused') || this.initial_error_view) {
              if (hasErrorTarget) {
                $('#' + err_id)
                  .removeClass('inputfollow-error-empty')
                  .text(error)
              } else {
                target.eq(0).after(
                  $('<span>', {
                    id: err_id,
                    class: 'inputfollow-error'
                  }).text(error)
                )
              }

              this.toggle_error_visible(target, targets, sub_target_rules, flag)
            }
          }
        }
      }
    })

    if ($.isFunction(this.on_validate)) {
      this.on_validate()
    }
  }

  toggle_error_visible(
    target: JQuery<HTMLElement>,
    targets: Target,
    sub_target_rules: RuleOption[],
    flag: boolean
  ) {
    if (flag) {
      target.addClass(this.valid_class).removeClass(this.error_class)
    } else {
      target.removeClass(this.valid_class).addClass(this.error_class)
    }

    sub_target_rules.map(sv => {
      if (Array.isArray(sv.with)) {
        sv.with.map(stv => {
          if (targets[stv]) {
            if (flag) {
              targets[stv]
                .addClass(this.valid_class)
                .removeClass(this.error_class)
            } else {
              targets[stv]
                .removeClass(this.valid_class)
                .addClass(this.error_class)
            }
          }
        })
      }
      if (sv.if) {
        Object.keys(sv.if).map(stv => {
          if (targets[stv]) {
            if (flag) {
              targets[stv]
                .addClass(this.valid_class)
                .removeClass(this.error_class)
            } else {
              targets[stv]
                .removeClass(this.valid_class)
                .addClass(this.error_class)
            }
          }
        })
      }
    })
  }

  get_errors() {
    return this.model.get_errors()
  }

  check_handler(rule: RuleOption, target: JQuery): boolean {
    const handler = inputFollow.get_method(rule.type)
    if (handler === false) {
      return true
    }

    const targets = this.model.get_target()

    if (rule.if) {
      let flag = true

      Object.keys(rule.if).map(target => {
        if (
          !rule.if ||
          !Object.prototype.hasOwnProperty.call(rule.if, target)
        ) {
          return
        }

        const value = rule.if[target]
        if (targets.hasOwnProperty(target)) {
          const t = targets[target]
          let compare
          if (t.is('[type="radio"]') || t.is('[type="checkbox"]')) {
            compare = t.filter(':checked').val()
          } else {
            compare = targets[target].val()
          }
          if (compare == value) {
            flag = false
          }
        }
      })

      if (flag === true) {
        return true
      }
    }

    if (!rule.mode && !rule.with) {
      return handler(target)
    }

    if (rule.mode && rule.with) {
      if (rule.mode.toLowerCase() === 'or') {
        let flag = handler(target)

        rule.with.map(t => {
          if (targets.hasOwnProperty(t)) {
            flag = flag || handler(targets[t])
          }
        })

        return flag
      } else if (rule.mode.toLowerCase() === 'and') {
        let flag = handler(target)

        rule.with.map(t => {
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
