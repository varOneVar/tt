import { SUCCESS_CODE, apiCommonFn } from './variable-config'
import _ from 'lodash'

export default {
  protoBind(Vue) {
    Object.defineProperties(Vue.prototype, {
      _: {
        value: _,
        writeable: false
      },
      apiCommonFn: {
        value: apiCommonFn,
        writeable: false
      },
      SUCCESS_CODE: {
        value: SUCCESS_CODE,
        writeable: false
      }
    })
  }
}
