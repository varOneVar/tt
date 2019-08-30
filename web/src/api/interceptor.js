import Vue from 'vue'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 8e3, // 请求超时时间
  withCredentials: true,
  validateStatus(status) { // 当前范围内的状态码会进response，其他进err
    return status >= 200 && status <= 304
  }
})

// 请求错误统一处理
const err = error => {
  if (error.response) {
    if (error.response.status === 403) {
      Message({
        message: '禁止访问!',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 401) {

      MessageBox.confirm('登陆凭证失效', '提示', {
        confirmButtonText: '重新登陆',
        type: 'error',
        closeOnclickModal: false,
        showClose: false,
        showCancelButton: false,
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
  }
  if (error.toString().includes('timeout of')) {
    Message({
      message: '请求接口超时，请刷新页面重试或等一会再试！',
      type: 'error',
      duration: 5 * 1000
    })
  }
  store.commit('app/toggleWholePageLoading', false)
  store.commit('app/toggleWorkBenchLoading', false)
  return Promise.reject(error)
}

// 取消重复请求
const pending = []
const removePending = ({ url, method }) => {
  pending.forEach((item, index) => {
    if (item.url === `${url}&request_type=${method}`) {
      item.cancel()
      pending.splice(index, 1)
    }
  })
}
// request interceptor
service.interceptors.request.use(config => {
  // token
  if (store.getters.token) {
    config.headers['Access-Token'] = getToken(); // 让每个请求携带自定义 token 请根据实际情况自行修改
  }

  // loading动画
  const m = {
    post: 'data',
    get: 'params',
    put: 'data',
    delete: 'params'
  }
  const param = m[config.method]
  // wholePageLoading: 整个页面动画
  // noLoading: 不设置加载动画
  // workBenchLoading: 工作区加载动画，默认设置;
  if (config[param].wholePageLoading) {
    store.commit('app/toggleWholePageLoading', true)
    delete config[param].wholePageLoading
  } else if (config[param].noLoading) {
    store.commit('app/toggleWholePageLoading', false)
    store.commit('app/toggleWorkBenchLoading', false)
    delete config[param].noLoading
  } else {
    store.commit('app/toggleWorkBenchLoading', true)
  }

  // 重复请求调用，默认取消重复请求
  if (config[param].noCancel) {
    delete config[param].noCancel
  } else {
    removePending(config)
    config.cancelToken = new axios.CancelToken(c => {
      pending.push({
        url: `${config.url}&request_type=${config.method}`,
        cancel: c
      })
    })
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  const { status, config, data, data: { msg } } = response
  removePending(config)
  store.commit('app/toggleWholePageLoading', false)
  store.commit('app/toggleWorkBenchLoading', false)
  if (status === 200 && status === 304) {
    return data
  }
  Message({
    message: msg,
    type: 'error',
    duration: 5 * 1000
  })
  
  return response
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
