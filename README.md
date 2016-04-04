# weg-hook-commonjs

weg 已经默认不自带模块化开发支持，那么如果需要采用 commonjs 规范作为模块化开发，请使用此插件。

请配合 [mod.js](https://github.com/fex-team/mod/blob/master/mod.js) 一起使用。

注意：需要对目标文件设置 `isMod` 属性，说明这些文件是模块化代码。


```js
fis.match('/modules/**.js', {
  isMod: true
})
``` 

这样才会被自动包装成 `amd`，才能在浏览器里面运行（当然还得依靠 mod.js）。

另外，所有 `isMod` 为 `true` 的文件都会被包裹成 AMD, 如果不想包裹，请设置  `wrap` 属性为 `false`。

设置了 `isMod` 为 true 的文件可以在 js 里面直接通过 `require('文件路径')` 的方式来使用，支持相对路径和绝对路径。

```js
var $ = require('/static/lib/jquery.js');

require('./index.js');
```

## 自定义模块ID

插件默认使用资源的绝对路径作为模块ID，如果希望更改模块ID，需要对目标文件设置 `moduleId` 属性

```js
fis.match('/modules/(**).js', {
  isMod: true,
  moduleId: '$1'
})
``` 

通过上述配置，我们可以将 `/modules/A.js` 的模块ID由 `modules/A` 改变为 `A`

## 安装

已被weg内置,全局安装或者本地安装都可以。

```
npm install -g weg-hook-commonjs
```

或者

```
npm install weg-hook-commonjs
```

## 用法

在 fis-conf.js 中加入以下代码。


```js
fis.hook('commonjs', {
  // 配置项
});
```

## 注意

虽然支持 paths 和 packages 设置，目的主要是为了迁移代码用的，从零开发，推荐直接使用 `require('文件路径')` 的方式，更简单明了。

