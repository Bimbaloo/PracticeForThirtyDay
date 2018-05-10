# 前端性能优化 --乔佬（乔乾）

> 深入理解http请求的过程是前端性能优化的核心

HTTP请求过程：
![http](http://owicv5j2l.bkt.clouddn.com/http.png)

1. dns是否可以通过缓存减少dns查询时间
2. 网络请求的过程走最近的网络环境
3. 相同的静态资源是否可以缓存
4. 能否减少请求http请求大小
5. 减少http请求
6. 服务端渲染

## 资源合并与压缩

目标：

1. 减少HTTP请求数量
2. 减少资源大小

### HTML压缩

1. node html-minifier
2. 后端模板引擎渲染(ejs,jade)
3. 在线网站压缩

压缩结果比较小，一般只有几kb

### CSS压缩

1. node html-minifier
2. clean-css
3. 在线网站压缩

### JS压缩与混乱

1. 无效字符的删除
2. 剔除注释
3. 代码语义的缩减和优化
4. 代码保护

利用uglifyjs2等

### 资源合并

可以减少http请求次数，但是存在以下的问题:

1. 首屏渲染
2. 缓存失效

公共文件打包，不同页面的文件单独打包，根据真实场景而定

方法：

1. node
2. 在线

## 图片优化

### 图片解析流程：

![图片解析](http://owicv5j2l.bkt.clouddn.com/imageAnalysis.png)

每种图片格式都有自己的特点，针对不同的业务场景选择不同的图片格式很重要

1. jpg有损压缩，压缩率高，不支持透明
2. png支持透明，浏览器兼容好,有(8,32,64可选)
3. webp压缩程度更好，在ios webview有兼容性问题 
4. svg矢量图，代码内嵌，相对较小，图片样式相对简单的场景

![选择图片格式](http://owicv5j2l.bkt.clouddn.com/choosePic.png)

### 图片优化方案

1、 图片sprite:多个图片合并成一个大图片，雪碧图样式生成网站([spritecow](http://www.spritecow.com/))

```
- 优点：减少http请求次数
- 缺点：合成图片过大时，会导致引用到的所有图片加载延迟，影响首屏性能
```

2、 image inline：用base64编码替代图片，直接inline到页面或css中

```
- 优点：减少http请求次数，可以放大后台数据库，构建方便
- 缺点：应用场景小，适合大小几kb的图片，页面引用图片次数不多的场景，否则会导致字符串过长
```

3、 css,svg,iconfont：css可以用来绘制相对简单的结构来替代图片，使用before或者after伪元素来丰富图案的复杂度。iconfont是一种web字体来代替图片的解决方案

```
- 优点：实现简单，体积小，简单的动态效果
- 缺点：css兼容性问题，绘制复制图案较难
```

4、 响应式图片：不同终端使用不同尺寸的图片

```
- 优点：减少不必要的图片加载
- 缺点：图片本身并没有优化
```

5、 使用更好的图片格式：webp，bpg等

```
- 优点：压缩更强,图片体积更小
- 缺点：兼容性(安卓,chrome支持)
```

### 图片压缩：

在线压缩：

[tinypng](https://tinypng.com/)

[webp](https://www.upyun.com/webp)

或者借助前端构建工具

## HTML渲染过程

HTML页面渲染过程

![dom](http://owicv5j2l.bkt.clouddn.com/dom.png)

## 重绘回流

回流：当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)，当页面布局和几何属性改变时就需要回流。

重绘：当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color，就叫称为重绘。

- 导致回流的操作

  > 1. 调整窗口大小（Resizing the window）  
  > 2. 改变字体（Changing the font）
  > 3. 增加或者移除样式表（Adding or removing a stylesheet）
  > 4. 内容变化，比如用户在input框中输入文字（Content changes, such as a user typing text in an input box）
  > 5. 激活 CSS 伪类，比如 :hover (IE 中为兄弟结点伪类的激活)（Activation of CSS pseudo classes such as :hover (in IE the activation of the pseudo class of a sibling)）
  > 6. 操作 class 属性（Manipulating the class attribute）
  > 7. 脚本操作 DOM（A script manipulating the DOM）
  > 8. 计算 offsetWidth 和 offsetHeight 属性（Calculating offsetWidth and offsetHeight）
  > 9. 设置 style 属性的值 （Setting a property of the style attribute）

- 浏览器新建DOM过程：

  > 1. 获取DOM后分割为多个图层
  > 2. 对每个图层的节点计算样式结果（Recalculate style--样式重计算）
  > 3. 为每个节点生成图形和位置（Layout--回流和重布局）
  > 4. 将每个节点绘制填充到图层位图中（Paint Setup和Paint--重绘）
  > 5. 图层作为纹理上传至GPU
  > 6. 符合多个图层到页面上生成最终屏幕图像（Composite Layers--图层重组）

所以，需要频繁触发回流的节点可以单独建立一个图层。在chrome控制台里可以打开layer功能，可以看到页面的所有图层。

- chrome上创建图层的条件

  > 1. 3D或透视变换（perspective transform）CSS属性
  > 2. 使用加速视频解码的`<video>`节点
  > 3. 拥有3D（WebGL）上下文或加速的2D上下文的`<canvas>`节点
  > 4. 混合插件（如Flash）
  > 5. 对自己的opacity做CSS动画或使用一个动画webkit变换的元素
  > 6. 拥有加速CSS过滤器的元素
  > 7. 元素有一个包含复合层的后代节点（一个元素拥有一个子元素，该子元素在自己的层里）
  > 8. 元素有一个z-index较低且包含一个复合层的兄弟元素（换句话说就是该元素在复合层上面渲染）

- 实际场景中优化方案

  > 1. 用translate替代top改变 
  > 2. 用opacity替代visibility
  > 3. 不要一条一条地修改DOM的样式，预先定义好class，然后修改DOM的className
  > 4. 把DOM离线后修改，比如：先把DOM给display:none(有一次回流)，然后你修改100次，然后再把它显示出来
  > 5. 不要把DOM结点的属性值放在一个循环里当成循环里的变量(比如offsetHeight，可以获取一次，存放在变量里)
  > 6. 不要使用table布局，可能很小的一个小改动会造成整个table的重新布局
  > 7. 动画实现的速度的选择
  > 8. 对于动画新建图层
  > 9. 启用GPU硬件加速
