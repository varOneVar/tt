## 设备信息管理后台
  管理iphone进出货记录，支持生成条形码，扫码枪识别

### 技术栈
* vue-antd-pro + egg + mysql

### 远程仓库
* [github](https://github.com/varOneVar/tt)

### 说明
* 设置 `git config --global core.autocrlf false` 以保证LF能提交，方便sh脚本在Linux执行
* 提交代码需要到 `site/` 目录下提交，在 `site/` 目录设置了 `husky` 检测代码是否符合 `eslint` 规则，不符合的能自动修复的就修复，修复不了的就阻止提交
