## 设备信息管理后台
  管理iphone进出货记录，支持生成条形码，扫码枪识别

### 技术栈
* vue-element-admin + egg + mysql

### 服务端
  - 登陆可以session或token， session使用egg-session, token使用node-jsonwebtoken,推荐token，扩展性好，与多项目合作也好处理

### 客户端
  - `@vue-cli` [环境变量文件.env,环境变量 必须以VUE_APP_开头](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

### 远程仓库
* [github](https://github.com/varOneVar/tt)

### 说明
* 设置 `git config --global core.autocrlf false` 以保证LF能提交，方便sh脚本在Linux执行
* 提交代码需要到 `web/` 目录下提交，在 `web/` 目录设置了 `husky` 检测代码是否符合 `eslint` 规则，不符合的能自动修复的就修复，修复不了的就阻止提交
