# 简易画板

## 项目背景
这是我学习Canvas时，做的一个小作品。
有不了解的API请查MDN文档

## 使用

将代码拉到本地仓库

运行`npx parcel src/index.html --no-cache`即可开启服务

## issue

本项目中使用了iconfont里面提供的svg代码链接，parcel在打包时无法执行，于是我花费时间查询资料，最终解决。
- 将使用xlink:href 的的地方改为 href
- 使用`npx parcel build src/index.html --no-cache --out-dir build --public-url ./`打包命令

```
--no-cache表示清除缓存
--out-dir build 表示建立打包到build文件夹下
--public-url ./ 表示静态资源文件夹路径
```




