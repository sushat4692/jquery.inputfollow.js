/**
 * jquery.inputfollow.js
 *
 * @version 2.0.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.inputfollow.js
 */

import { InitialParam } from './types'
import InputFollowMethod from './InputFollowMethod'
import inputFollow from './instance'

$.fn.extend({
  inputfollow: function(param: InitialParam) {
    const target = this as HTMLElement

    if (!$(target).length) {
      return
    }
    let method: InputFollowMethod

    if (!$(target).data('inputfollow_id')) {
      const index = inputFollow.get_index()
      $(target).data('inputfollow_id', index)

      method = new InputFollowMethod($(target), index)
      inputFollow.push_collection(index, method)
    } else {
      const index = $(target).data('inputfollow_id')
      method = inputFollow.get_collection(index)
    }

    if (param && method !== null) {
      method.init(param)
    }

    return method
  }
})
