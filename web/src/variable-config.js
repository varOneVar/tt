export const SUCCESS_CODE = 1

const errSuffix = { type: 'error', duration: 5e3 }
export const ERR_STATUS_MSG = {
  403: { message: '禁止访问', ...errSuffix },
  404: { message: '接口错误，请刷新页面重试！', ...errSuffix },
  500: { message: '服务器错误，请联系后台人员！', ...errSuffix },
  502: { message: '服务器繁忙，请稍后再试！', ...errSuffix },
  503: { message: '服务器繁忙，请稍后再试！', ...errSuffix },
  504: { message: '请求超时', ...errSuffix }
}

export async function apiCommonFn(api, successFn, params, errorFn) {
  try {
    const { code, data, msg } = await api(params)
    if (code === SUCCESS_CODE) {
      successFn && successFn(data)
    } else {
      errorFn
        ? errorFn(code, msg)
        : this.$message({ message: msg, type: 'error' })
    }
  } catch (err) {
    console.log(err)
  }
}
