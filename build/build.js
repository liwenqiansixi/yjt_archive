// https://github.com/shelljs/shelljs
//看构建环境下的配置
// loading动画
// 删除创建目标文件夹
// webpack编译
// 输出信息
// 检查NodeJS和npm的版本
require('./check-versions')();
require('shelljs/global');
env.NODE_ENV = 'production';
//终端路径
var ora = require('ora');
var path = require('path');

// 执行Unix命令行的插件
var shell = require('shelljs')
var config = require('../config');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

// 开启loading动画
var spinner = ora('building for production...');
spinner.start();
// 输出文件的目标文件夹
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);

// 递归删除旧的目标文件夹
shell.rm('-rf', assetsPath);
// 重新创建文件夹
shell.mkdir('-p', assetsPath);
// 将public文件夹复制到输出的目标文件夹
shell.cp('-R', 'public/*', assetsPath);
// webpack编译
webpack(webpackConfig, function (err, stats) {
  spinner.stop();// 停止loading动画
  if (err) throw err; // 有出错则输出相关信息
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
});
