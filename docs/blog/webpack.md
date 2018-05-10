# webpack简介 --白溪阳


## 基本用法
  ### webpack 运行机制

    http://taobaofed.org/blog/2016/09/09/webpack-flow/

    ### npm init, 安装依赖

    ```
    npm init -y
    npm install webpack webpack-cli -D
    npm install lodash -S
    ```

    ### 目录结构

    ```
    .
    ├── dist
    │   └── index.html
    ├── package.json
    └── src
        └── main.js
    ```

    ### 代码

    - index.html
    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Title</title>
    </head><body>



    </body>

    <script src="bundle.js"></script>
    </html>

    ```

    * main.js
    ```

    import _ from 'lodash'
    var element = document.createElement('div')
    element.innerText = _.join(['hello', 'webpack'], ' ')
    document.body.appendChild(element)

    ```

    ### 4种运行webpack的方式
    // 下面npx 会自动寻找node_modules/.bin/ 下的可执行文件，全局安装webpack和webpack-cli 就不需要npx了
    + 直接使用命令行
    ```

    npx webpack src/main.js --output dist/bundle.js

    ```

    + 使用配置文件的方式

    //webpack.config.js
    ```javascript
    const path = require('path');
    module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        //打包根目录,用系统绝对地址表示
        path: path.resolve(__dirname, 'dist'),
        //项目打包玩后部署时的访问地址如:https://cdn.example.com/xxx/
        publicPath: '/xxx/'
    }
    };
    ```

    ```
    npx webpack --config webpack.config.js
    ```

    - 使用NPM script
    //package.json

    ```json
    {
    //...
    "scripts": {
        "build": "webpack"
    }
    //...
    }
    ```

    ```
    npm run build
    ```

    - api
    // 创建webpack.js

    ```
    let webpack = require ( 'webpack' )
    let path = require ( 'path' )
    webpack ( {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
    } ).run((err,stats)=>{
    console.log(err)
    })
    ```

    ```
    node webpack.js
    ```


<br/>

## html-webpack-plugin

### 可以自动生成html文件,自动引入js,还支持模板语法,

### 用法:
```
npm install HtmlWebpackPlugin -D
```

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
{
  plugins:[new HtmlWebpackPlugin(options)]
}
```

### 示例

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
{
  plugins:[new HtmlWebpackPlugin({
    tempate: './index.html',
    insert: 'body'
  })]
}
```

### options字段
|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`title`](#)**|`{String}`|``|The title to use for the generated HTML document|
|**[`filename`](#)**|`{String}`|`'index.html'`|The file to write the HTML to. Defaults to `index.html`. You can specify a subdirectory here too (eg: `assets/admin.html`)|
|**[`template`](#)**|`{String}`|``|`webpack` require path to the template. Please see the [docs](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md) for details|
|**[`inject`](#)**|`{Boolean\|String}`|`true`|`true \|\| 'head' \|\| 'body' \|\| false` Inject all assets into the given `template` or `templateContent`. When passing `true` or `'body'` all javascript resources will be placed at the bottom of the body element. `'head'` will place the scripts in the head element|
|**[`favicon`](#)**|`{String}`|``|Adds the given favicon path to the output HTML|
|**[`minify`](#)**|`{Boolean\|Object}`|`true`|Pass [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)'s options as object to minify the output|
|**[`hash`](#)**|`{Boolean}`|`false`|If `true` then append a unique `webpack` compilation hash to all included scripts and CSS files. This is useful for cache busting|
|**[`cache`](#)**|`{Boolean}`|`true`|Emit the file only if it was changed|
|**[`showErrors`](#)**|`{Boolean}`|`true`|Errors details will be written into the HTML page|
|**[`chunks`](#)**|`{?}`|`?`|Allows you to add only some chunks (e.g only the unit-test chunk)|
|**[`chunksSortMode`](#plugins)**|`{String\|Function}`|`auto`|Allows to control how chunks should be sorted before they are included to the HTML. Allowed values are `'none' \| 'auto' \| 'dependency' \| 'manual' \| {Function}`|
|**[`excludeChunks`](#)**|`{String}`|``|Allows you to skip some chunks (e.g don't add the unit-test chunk)|
|**[`xhtml`](#)**|`{Boolean}`|`false`|If `true` render the `link` tags as self-closing (XHTML compliant)|

<br/>



## loader

### loader的是用来解析不同类型的文件的,不用loader的情况下我们只能引入js模块,使用loader可以把任何类型的文件当成js模块

### loader使用方式

- js文件里面直接使用

```
import from 'style-loader!css-loader!xxx/xxx.css'
```

###### 为什么loader 从右往左写 https://segmentfault.com/q/1010000008622548

webpack 采用了函数式编程的方式,函数是编程看起来起来就是这样的 c(b(a(data)))

```
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const add1 = n => n + 1; //加1
const double = n => n * 2; // 乘2
const add1ThenDouble = compose(
  double,
  add1
);
add1ThenDouble(2);
```

- webpack.config.js 文件中配置,下面会介绍

### css,scss,less,以及图片影视字体文件

- install

  ```
  npm install --save-dev style-loader css-loader postcss-loader sass-loader node-sass less less-loader url-loader file-loader
  ```
- webpack.config.js

  ```
  // 基于项目根目录的assetsPath
  assetsPath = 'static/'
  module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 将css-loader解析成的模块用style标签的形式放到页面文档的header首部
          'style-loader',
          // 可将css文件解析成包含css数据js模块,
          'css-loader',
          // PostCSS 可以强化几乎无限的各种各样的插件来读取或操作你的 CSS。
          // 这里主要用它来添加前缀 如 box-sizing:border-box;
          // 需要在项目根目录添加postcss.config.js 文件
          // module.exports = {
          //   plugins: {
          //     'autoprefixer': {
          //       browsers: ["iOS >= 8",
          //         "Firefox >= 20",
          //         "Android > 4.4"]
          //     }
          //   }
          //}
          'postcss-loader'
        ]
        //loaders: 'style-loader!css-loader'
        //每个loader有options时写法
        //use:[
        //  {loader: 'style-loader', options:[]},{loader: 'css-loader'}
        //]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
  
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //url-loader模块依赖于file-loader,功能和file-loader大致一样,但是url-loader可在文件过大的时候解析成url字符串并把对应文件拷贝到配置路径下,其他情况解析成base64格式的字符串.
        //所以css文件中有引用图片等文件的时候必须配置url-loader, 不然会报模块无法解析的错误.
        loader: 'url-loader',
        //一个loader 有options 的情况下必须要用loader不能用use
        options: {
          limit: 10000,
          // 这个name包含路径加文件名,也是实际url基于output中的publish,目标文件路径基于output中的path
          name: assetsPath + 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath + 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath + 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
  //...
  }
  ```

### es6文件

- install

  ```
  npm install babel-loader babel-core babel-preset-env babel-plugin-transform-runtime babel-plugin-vue-jsx -D
  ```
- webpack.config.js

  ```
  const path = require('path')
  function resolve (dir) {
  return path.join(__dirname, '..', dir)
  }
  module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // resolve 方法用于解析成文件夹的根路径
        include: [resolve('src'), resolve('test')],
        // exclude: [],
        options: {
          presets: ['env'],
          // transform-runtime 提供了一些公共的工具函数,并且部分包含polyfill的功能,并且这些polyfill是按需引入的,对代码体积影响很小.https://www.jianshu.com/p/3b27dfc6785c
          // 缺点是某些方法还是不能实现如Array.prototype.include 如果入口文件里面引入了babel-polyfill的话就不用transform-runtime了.
          // 但是babel-polyfill体积过大是个问题.
          // transform-vue-jsx 可以编译jsx转化成vue createElement的形式,可以看vue官方文档
          plugins: ["transform-runtime", "transform-vue-jsx"]
        }
      },
    ]
  }
  }
  ```

  // options的内容可以放到项目根目录.babelrc文件中

<br/>

## code-splitting
### 用法1

```
// 运行到这行代码的时候会发请求引入这个js模块
import('xxx').then(function(module){
  module = module.default
  //do something
})
```

### vue示例

```
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component').then(d => d.default)
  }
})
```

### CommonJS require.ensure

```
require.ensure(dependencies: String[], callback: function(require), errorCallback: function(error), chunkName: String)
```

//chunkName, 打包的块名,相同块名会打包成一个js文件

### CommonsChunkPlugin

// 例子

```
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
{
  plugins:[
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: chunks,
      minChunks: chunks.length
    }),
  ]
}
```

### ExtractTextWebpackPlugin

```
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```

multiple

```
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Create multiple instances
const extractCSS = new ExtractTextPlugin({
  filename:  (getPath) => {
   return getPath('css/[name]-one.css')
  },
  // 默认是false ,只会处理initial chunks, true 还会处理additional chunks
  // 使用CommonsChunkPlugin的时候会出现additional chunks
  allChunks: true
});

const extractLESS = new ExtractTextPlugin({
  filename:  (getPath) => {
    return getPath('css/[name]-two.css')
  },
  allChunks: true
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader'],
          // allChunks 是false的时候,需要用style-loader来处理additional chunks中的部分
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },
    ]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
};
```
</br>

## target字段指定js的运行环境
### 语法

```
string | function(compiler)
```

### string


<table>
  <tr><th>Option</th><th>Description</th></tr>
  <tr><td>async-node</td><td>Compile for usage in a Node.js-like environment (uses fs and vm to load chunks asynchronously)</td></tr>
  <tr><td>atom(不推荐)</td><td>atom</td></tr>
  <tr><td>electron(不推荐)</td><td>Alias for electron-main</td></tr>
  <tr><td>electron-main</td><td>Compile for Electron for main process.</td></tr>
  <tr><td>node</td><td>Compile for usage in a Node.js-like environment (uses Node.js require to load chunks)</td></tr>
  <tr><td>node-webkit</td><td>Compile for usage in WebKit and uses JSONP for chunk loading. Allows importing of built-in Node.js modules and nw.gui (experimental)</td></tr>
  <tr><td>web</td><td>Compile for usage in a browser-like environment (default)</td></tr>
  <tr><td>webworker</td><td>Compile as WebWorker</td></tr>
</table>



### function 可以通过方法自定义打包的配置参数

例:

- 不需要任何配置

  ```
  const options = {
    target: () => undefined
  };
  ```
- 特殊配置

```
const webpack = require("webpack");

const options = {
  target: (compiler) => {
    compiler.apply(
      new webpack.JsonpTemplatePlugin(options.output),
      new webpack.LoaderTargetPlugin("web")
    );
  }
};
```
