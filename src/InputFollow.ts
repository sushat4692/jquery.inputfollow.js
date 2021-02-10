import { RuleFlag, RuleOption } from './types'
import { IS_LIMIT, IS_VALID } from './const'
import InputFollowMethod from './InputFollowMethod'

export default class InputFollow {
  private index = 0
  private collection: InputFollowMethod[] = []
  private rules: RuleFlag = {
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
  get_collection(index: number): InputFollowMethod | undefined {
    return this.collection[index]
  }

  check_rules(rule: RuleOption): boolean {
    return this.rules[rule.type] ?? false
  }

  get_method(key: string): any {
    switch (key) {
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
    if (target.is('[type="radio"]') || target.is('[type="checkbox"]')) {
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
    return /^([a-z0-9_]|-|\.|\+)+@(([a-z0-9_]|-)+\.)+[a-z]{2,6}$/.test(
      target.val() + ''
    )
  }

  check_method_number(target: JQuery): boolean {
    let val: string = target.val() + ''
    const org: string = val

    // Full width to Half width characters
    val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )

    // Remove text except for numbers
    val = val.replace(/[^0-9]/g, '')

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
    val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )

    // Convert dash
    val = val.replace(/[−ーー―]/g, '-')

    // Remove text except for numbers
    val = val.replace(/[^0-9]/g, '')

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
      val.length - target.data('before_val').length + target.data('caret_pos')

    if ((document as any).selection !== undefined) {
      const range = (target.get(0) as any).createTextRange()
      range.move('character', pos)
      range.select()
    } else {
      try {
        ;(target.get(0) as HTMLInputElement).setSelectionRange(pos, pos)
      } catch (e) {
        // Cannot change caret pos
      }
    }
  }

  get_caret_pos(target: HTMLInputElement): number {
    if ((document as any).selection !== undefined) {
      const range = (document as any).selection.createRange()
      let tmp = document.createRange() as any

      try {
        ;(tmp as any).moveToElementText(target)
        tmp.setEndPoint('StartToStart', range)
      } catch (e) {
        tmp = (target as any).createTextRange()
        tmp.setEndPoint('StartToStart', range)
      }

      return target.value.length - tmp.text.length
    } else {
      try {
        return target.selectionStart || 0
      } catch (e) {
        return 0
      }
    }
  }

  split_related_rules(rule: string): string[] {
    return rule.split('_and_').join('_or_').split('_or_').slice(1)
  }
}
