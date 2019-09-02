const chokidar = require('chokidar') // 监听文件改变，发生变化卸载接口路由重新注册
const bodyParser = require('body-parser')
const chalk = require('chalk') // 输出增色插件
const path = require('path')

// process.cwd() node命令执行时所在文件目录， __dirname是始终是被执行文件所在文件目录
const mockDir = path.join(process.cwd(), 'mock')

function registerRoutes(app) {
  let mockLastIndex
  const { default: mocks } = require('./index.js')
  for (const mock of mocks) { 
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocks).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

function unregisterRoutes() {
  // 在Node.js中，require.cache对象具有一个“键名/键值”结构，键名为每个模块的完整文件名，键值为各模块对象
  // 加载一个模块会，会缓存，再次调用直接返回缓存对象
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      // 在Node.js中，可以使用require.resolve函数来查询某个模块文件的带有完整绝对路径的文件名
      // 使用require.resolve函数查询模块文件名时并不会加载该模块
      delete require.cache[require.resolve(i)]
    }
  })
}

module.exports = app => {
  // es6 polyfill
  require('@babel/register')

  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        app._router.stack.splice(mockStartIndex, mockRoutesLength)

        // clear routes cache
        unregisterRoutes()

        const mockRoutes = registerRoutes(app)
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
