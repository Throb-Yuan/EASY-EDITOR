## 更新日志
*  1.基础样式内增加资源主键
   2.画布强制更改为16：9（800*450px）
   3.初步添加视频video组件
   4.其他初步修改
  2022-12-12 11：00 

* 项目基础部署 0.0.1
  2022-12-06 



## 工程目录结构

```
|-- client					--------前端项目界面代码
    |--common					--------前端界面对应静态资源
    |--components				--------组件
    |--config					--------配置文件
    |--eventBus					--------eventBus
    |--filter					--------过滤器
    |--mixins					--------混入
    |--pages					--------页面
    |--router					--------路由配置
    |--store					--------vuex状态管理
    |--service					--------axios封装
    |--App.vue					--------App
    |--main.js					--------入口文件
    |--permission.js			--------权限控制
|-- server					--------服务器端项目代码
    |--confog					--------配置文件
    |--controller				--------数据库链接相关
    |--extend					--------框架扩展
    |--model					-------Schema和Model
    |--middleware				--------中间件
    |--core						--------Koa MVC实现自动加载核心文件
    |--views					--------ejs页面模板
    |--public					--------静态资源
    |--router.js				--------路由
    |--app.js					--------服务端入口
|-- common					--------前后端公用代码模块（如加解密）
|-- engine-template			--------页面模板引擎，使用webpack打包成js提供页面引用
|-- docs					--------预留编写项目文档目录
|-- config.json				--------配置文件
```

## 本地开发
环境准备：mongodb （配置文件在/server/config/index.js） ⭐⭐⭐⭐⭐(重要)

### 启动前端
```
npm run dev-client
```
### 启动服务端
```
npm run dev-server
```

注意：
如果没有生成过引擎模板js文件的，需要先编辑引擎模板，否则预览页面加载页面引擎.js 404报错
##### 编译engine.js模板引擎
```
npm run lib:h5-swiper
```

## 本地部署
环境准备：mongodb （配置文件在/server/config/index.js） ⭐⭐⭐⭐⭐(重要)

需要全局安装pm2 
```
npm install pm2 -g
```
#### 启动命令
```
npm run start
```
