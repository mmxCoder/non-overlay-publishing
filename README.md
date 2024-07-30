# non-overlay-publishing
模拟非覆盖式发布流程

## 运行

```js

// cd ./assetsServer
// 运行资源服务器
npm i
node index.js

// cd ./server
// 运行访问服务器
npm i
node index.js

// cd ./frontProject
// 打包前端项目
// 注意: 一定需要前面两个服务运行后才可以打包前端项目
npm i
npm run build

```

打包后可以观察到.

1. assetsServer/public 文件夹下多了一个资源文件夹, 文件夹以打包时间命名, 内容为所有打包的文件.
这个文件夹内保存所有的历史版本.  
2. server/public 文件夹下的 **`index.html`** 文件会被更新.
3. 运行 http://localhost:3001/ 可以看到内部的资源路径都指向了 assetsServer 服务



## assetsServer 资源服务器(模拟 oss)

存放 css / js / 图片 等等资源...

> 这个服务需要提供一个上传资源的接口, 用于打包时将资源发送到服务器里面.

## server 访问的服务器

这里相当于自己的服务器, 用来存在 index.html, 类似于服务器上的 nginx.

## frontProject 前端项目(vue3 + vite)

这个前端项目为 vite 初始化项目, 目前没有做任何的修改.

## script 脚本

- push: 简单的代码推送脚本, 在根目录执行下面的命令将自动推送代码到git

```js

npm run push

```