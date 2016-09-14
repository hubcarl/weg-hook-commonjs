var path = require('path');
var lookup = require('./lookup.js');
var wrapJs = require('./wrap.js');
var parseJs = require('./parser.js');

// 程序入口
var entry = module.exports = function(fis, opts) {
  lookup.init(fis, opts);

  fis.on('lookup:file', lookup);
  fis.on('standard:js', parseJs);
  fis.on('compile:postprocessor', function(file) {
    wrapJs(file, opts);
  });
  fis.on('components:info', function(componentsInfo) {
    var path = require('path');
    var componentsDir = path.relative(opts.baseUrl || '.', (fis.env().get('component.dir') || 'components/').replace(/\/$/, ''));
    Object.keys(componentsInfo).forEach(function(key) {
      var json = componentsInfo[key];
      opts.packages = opts.packages || [];
      opts.packages.unshift({
        name: json.name,
        main: json.main || 'index',
        location: path.join(componentsDir, json.name)
      });

      if (json.paths) {
        opts.paths = opts.paths || {};
        Object.keys(json.paths).forEach(function(key) {
          opts.paths[path.join(json.name, key)] = path.join(componentsDir, json.name, json.paths[key]);
        });
      }
    });
    lookup.init(fis, opts);
  });

  // 服务器客户端渲染require问题, fis分析完后,还原require路径为组件名称
  fis.on('compile:end', function(file){
    if (file.useCompile && file.useMap && file.isMod) {
      var _componentDir = fis.get('component.dir');
      var requires = file.requires||[];
      var content = file['_content'];
      if (file.useRequireReplace === false && /module\.exports/.test(content)) {
        requires.forEach(function (item) {
          var requirePath = item;
          var componentDir = _componentDir || path.basename(item, '.js');
          var componentName = requirePath.replace(componentDir + '/', '').replace('.js', '');
          var arr = componentName.split('\/');
          if (arr.length == 2 && arr[0] == arr[1]) {
            componentName = arr[0];
          }
          var reg = new RegExp(item, 'gm');
          file['_content'] = file['_content'].replace(reg, componentName);
        });
      }
    }
  });
};

entry.defaultOptions = {

  // 是否前置依赖，如果是 mod.js 千万别配置成 true
  // 给那种自己实现 loader 的用户使用的。
  forwardDeclaration: false,

  // 当前置依赖启动的时候才有效，用来控制是否把内建的 `require`, `exports`, `module` 从第二个参数中去掉。
  skipBuiltinModules: true,

  // 用来查找无后缀资源的
  extList: ['.js', '.coffee', '.jsx', '.es6'],

  // 设置包裹时，内容缩进的空格数。
  tab: 2
};