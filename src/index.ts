import { InitialParam } from './types'
import InputFollowMethod from './InputFollowMethod'
import inputFollow from './instance'

$.fn.extend({
  inputfollow: function (param: InitialParam) {
    const target = this as HTMLElement

    if (!$(target).length) {
      return
    }
    let method: InputFollowMethod | undefined

    if (!$(target).data('inputfollow_id')) {
      const index = inputFollow.get_index()
      $(target).data('inputfollow_id', index)

      method = new InputFollowMethod($(target), index)
      inputFollow.push_collection(index, method)
    } else {
      const index = $(target).data('inputfollow_id')
      method = inputFollow.get_collection(index)
    }

    if (param && method) {
      method.init(param)
    }

    return method
  },
})
