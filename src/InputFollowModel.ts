import { Rule, Target, Message, RuleOption } from './types'

export default class InputFollowModel {
  private wrap: JQuery
  private errors: number = 0
  private error_mes: string = ''
  private rules: Rule = {}
  private target: Target = {}
  private messages: Message = {}

  constructor(wrap: JQuery) {
    this.wrap = wrap
  }

  get_wrap(): JQuery {
    return this.wrap
  }

  get_target(): Target {
    return this.target
  }

  set_rules(rules: Rule): void {
    this.rules = { ...rules }

    this.reset_rules()
  }
  get_rules(): Rule {
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

  set_messages(messages: Message): void {
    this.messages = { ...messages }
  }
  get_messages(): Message {
    return this.messages
  }

  reset_rules(): void {
    this.wrap.find('input, select, textarea').off('focus.inputfollow_focus')

    for (const key in this.rules) {
      const parent: JQuery = this.filter_target(key)
      this.target[key] = this.initialize_target(parent)

      if (Array.isArray(this.rules[key])) {
        for (
          let i = 0, l = (this.rules[key] as RuleOption[]).length;
          i < l;
          i += 1
        ) {
          const targetRule = (this.rules[key] as RuleOption[])[i]!
          this.reset_rule(targetRule, parent)
        }
      } else {
        const targetRule = this.rules[key] as RuleOption
        this.reset_rule(targetRule, parent)
      }
    }
  }

  reset_rule(targetRule: RuleOption, parent: JQuery) {
    if (Array.isArray(targetRule.with)) {
      targetRule.with.map((target) => {
        this.target[target] = this.initialize_target(
          this.filter_target(target),
          parent
        )
      })
    }
    if (targetRule.if) {
      Object.keys(targetRule.if).map((target) => {
        this.target[target] = this.initialize_target(
          this.filter_target(target),
          parent
        )
      })
    }
  }

  enable_focus_flag(target: JQuery): any {
    return (): void => {
      target.data('is_focused', true)
    }
  }

  filter_target(key: string): JQuery {
    return this.wrap.find(
      `input[name="${key}"],input[name^="${key}["],select[name="${key}"],select[name^="${key}["],textarea[name="${key}"],textarea[name^="${key}["]`
    )
  }

  initialize_target(target: JQuery, parent: JQuery | null = null): JQuery {
    const focusTarget: JQuery = parent !== null ? (parent as JQuery) : target

    return target
      .data('is_inputfollow', true)
      .data('is_focused', false)
      .off('focus.inputfollow_focus')
      .on('focus.inputfollow_focus', this.enable_focus_flag(focusTarget))
  }
}
