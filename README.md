## 更新日志  

*  1.图片视频混播功能
   2.字体库完善


*  1.组件属性-事件-增加返回上一页  
   2.完成新增pdf功能组件  
   3.增加倒计时、星期组件
   4.增加打开/安装apk事件
   2023-02-06
     
*  1.完成预览功能（测试环境）  
   2.媒体资源相关组件 属性编辑区域调整   
   3.bug修复，项目优化,发布初版本   
   2023-01-13   

*  1.原登录相关逻辑拆除，新增登录逻辑  
   2.iframe标签宽高修复  
   4.轮播图增加、修改覆盖功能优化完善。  
   3.视频音乐增加循环播放loop设置  
   4.视频、图片、音乐资源拖拽至组件属性url区域实现覆盖  
   **5.增加滚动字幕模板组件**  
   **6.增加二维码模板组件**  
   **7.增加日期时间组件**  
   8.项目初步打包部署至服务器  
   2023-01-06  

*  **1.媒体资源列表插入**  
   **2.资源列表支持拖拽至画布生成对应元素（图片、视频、音频）**  
   **3.添加事件增加节目跳转功能**   
   4.资源相关模块增加必要的资源主键、本地路径字段  
   5.读取环境控制编辑器与模板加载的资源路径转换  
  2022-12-23 

*  **1.新增视频组件**  
   2.部分页面模块迁入  
   3.前后端分离，节目增删改查完成  
   4.其他初步修改   
  2022-12-19

*  1.基础样式内增加资源主键  
   2.画布强制更改为16：9（800*450px）  
   3.初步添加视频video组件  
   4.其他初步修改  
  2022-12-12
  
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
  
```

```

### 启动前端
```
npm run dev
```

注意：
如果没有生成过引擎模板js文件的，需要先编辑引擎模板，否则预览页面加载页面引擎.js 404报错
##### 编译engine.js模板引擎
```
npm run lib:h5-swiper
```

#### 启动命令
```
npm run start
```