import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const modules = {};
// 文件夹目录（不能是变量，webpack编译无法定位），是否搜索子目录，匹配文件正则表达式
// 返回一个require函数，接收一个地址参数，请求这个地址模块，require函数有三个方法
//   resolve：func, 返回请求被解析后得到的模块id
//   keys: func, 返回数组，相对于文件夹目录的匹配的文件地址 './user.js'
//   id: 模块id
const files = require.content('./modules', false, /\.js$/);
files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
