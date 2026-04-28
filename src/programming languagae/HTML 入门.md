---
title: HTML 入门
date: 2025-09-26
tags:
  - HTML
category:
  - 编程语言
---
# 前言

学习阮一峰老师的 [HTML 教程](https://wangdoc.com/html/) 和尚硅谷的 JavaWeb 课程。

<!-- more -->

IDEA 中运行 html 文件失败，显示“找不到可调试的浏览器。请确保您的浏览器设置中已启用基于 Chromium 的浏览器”：

1. 打开 IDEA 设置：`File` → `Settings` → `Tools` → `Web Browsers`
2. 点击 `+` 添加 Chrome
3. 选择 `Chrome` 类型
4. 在 `Path` 字段输入：`/usr/bin/google-chrome-stable`

# HTML 简介

浏览器的网页开发，涉及三种技术：HTML、CSS 和 JavaScript。HTML 语言定义网页的结构和内容，CSS 样式表定义网页的样式，JavaScript 语言定义网页与用户的互动行为。

HTML 语言是网页开发的基础，CSS 和 JavaScript 都是基于 HTML 才能生效，即使没有这两者，HTML 本身也能使用，可以完成基本的内容展示。

HTML是一种『标记语言』是因为它不是像Java这样的『编程语言』，因为它是由一系列『标签』组成的，没有常量、变量、流程控制、异常处理、IO等等这些功能。HTML很简单，每个标签都有它固定的含义和确定的页面显示效果。

- 标签：代码中的一个 `<>` 叫做一个标签，有些标签成对出现，称之为双标签，有些标签单独出现，称之为单标签
- 属性：一般在开始标签中，用于定义标签的一些特征，表现为键值对。
- 文本：双标签中间的文字,包含空格换行等结构
- 元素：经过浏览器解析后,每一个完整的标签（标签+属性+文本）可以称之为一个元素

元素的概念是从标签中抽象出来的，类似数据结构和它的具体实现。元素分为块级元素和行内元素。块级元素会占据网页的一整行，比如 `<p></p>` ，行内元素在块级元素中为文本添加样式，比如给文本加粗的 `b` 元素。

```html
<!-- 双标签 <p></p> -->
<p>HTML is a very popular fore-end technology.</p>

<!-- 单标签 <input/>，属性：type、name -->
<input type="text" name="username" />
```

> 在线帮助文档： https://www.w3school.com.cn/

# HTML 基础结构

一个 HTML 编写的网页模板：

- HTML5 版本的文档类型声明 `<!DOCTYPE html>`
- 根标签 `<html>`
- 头部元素
	- `<head>`标签用于定义文档的头部，其他头部元素都放在head标签里。
	- 头部元素包括meta标签、title标签、script标签、style标签、link标签等等。
- 主体元素
	- `<body>`标签定义网页的主体内容，在浏览器窗口内显示的内容都定义到body标签内。
- 注释 `<!-- 这是一个注释 -->` 

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>网页标题</title>
</head>
<body>
	<header>页眉</header>
	<main>
	<article>
		<h1>文章标题</h1>
		<p>文章内容</p>
	</article>
	</main>
	<aside>侧边栏</aside>
	<footer>页尾</footer>
</body>
</html>
```

- `<header>` 标签用在网页的头部，也称为“页眉”。网站导航和搜索栏通常会放在 `<header>` 里面。`<header>` 用在文章的头部，则可以把文章标题、作者等信息放进去
- `<main>` 标签表示**页面的主体内容**，一个页面只能有一个 `<main>`
- `<article>` 标签表示页面里面一段完整的内容，即使页面的其他部分不存在，也具有独立使用的意义，通常用来**表示一篇文章**或者一个论坛帖子
- `<aside>` 标签用来放置与网页或文章主要内容间接相关的部分。
	- 网页级别的 `<aside>`，可以用来放置侧边栏，但不一定就在页面的侧边；
	- 文章级别的 `<aside>`，可以用来放置补充信息、评论或注释
- `<footer>` 标签表示网页、文章或章节的尾部。如果用于整张网页的尾部，就称为“页尾”，通常包含版权信息或者其他相关信息

其他：

- `<section>` 标签表示一个含有主题的独立部分，通常用在文档里面**表示一个章节**
- `<nav>` 标签用于放置**页面或文档的导航**信息。一个页面可以有多个 `<nav>`，比如一个用于站点导航，另一个用于文章导航
- `<hgroup>` 标签适用于主标题包含多级标题（比如带有副标题），将多级标题放在其中

# HTML 标签

> 网页的主要功能是文本展示。所以，HTML 提供了大量的文本处理标签。

## 标题标签

标题标签一般用于在页面上定义一些标题性的内容，如新闻标题、文章标题等，有h1到h6六级标题。

```html
<body>
    <h1>一级标题</h1>
    <h2>二级标题</h2>
    <h3>三级标题</h3>
    <h4>四级标题</h4>
    <h5>五级标题</h5>
    <h6>六级标题</h6>
</body>
```

## 段落标签

段落标签 `<p>` 是块级元素，代表文章的一个段落（paragraph）。不仅是文本，任何想以段落显示的内容，比如图片和表单项，都可以放进 `<p>` 元素

```html
<body>
    <p> 
        近年来，我国算力基础设施发展成效显著，梯次优化的算力供给体系初步构建，算力基础设施的综合能力显著提升。
    </p>
	<p>
		当前，算力正朝智能敏捷、绿色低碳、安全可靠方向发展。
	</p>
</body>
```

## 换行标签

换行标签 `<br>` 产生**换行**效果。注意，块级元素的间隔，不要使用 `<br>` 来产生，而要使用 CSS 指定

分隔线标签 `<hr>` 用来在一篇文章中分隔两个不同的主题，表现为一根**水平线**

```html
<body>
		床前明月光
    <br>
        疑似地上霜
    <hr>
        鹅鹅鹅
</body>
```

> `<hr>` 是历史遗留下来的，建议尽量避免使用。主题之间的分隔可以使用 `<section>`，如果想要水平线的效果，可以使用 CSS 。

## 列表标签

有序列表，分条列项展示数据的标签, 其每一项前面的符号带有顺序特征。

- 列表标签 `ol`
- 列表项标签 `li`

```html
<ol>
    <li>JAVA</li>
    <li>前端</li>
    <li>大数据</li>
</ol>
```

> [!info] 列表标签 `<ol>` 有以下属性：
> - `reversed` 属性产生倒序的数字列表 
> - `start` 属性，指定数字列表的起始编号
> - `type` 属性指定数字编号的样式。可选值有  `a`（小写字母）、 `A`（大写字母）、 `i`（小写罗马数字）、 `I`（大写罗马数字）、 `1`（整数，默认值）。

无序列表，分条列项展示数据的标签, 其每一项前面的符号不带有顺序特征。

- 列表标签 `ul`
- 列表项标签 `li`

```html
<ul>
    <li>JAVASE</li>
    <li>JAVAEE</li>
    <li>数据库</li>
</ul>
```

嵌套列表，列表和列表之前可以签到，实现某一项内容详细展示。

```html
<ol>
    <li>
        JAVA
        <ul>
            <li>JAVASE</li>
            <li>JAVAEE</li>
            <li>数据库</li>
        </ul>
    </li>
    <li>前端</li>
    <li>大数据</li>
</ol>
```

## 超链接标签

链接（hyperlink）是互联网的核心。它允许用户在页面上，从一个网址跳转到另一个网址，从而把所有资源联系在一起。

`<a>` 标签表示一个可以跳转的链接。它不仅可以跳转到其他页面，也可以跳转到文本、图像、文件等资源，甚至当前页面的某个位置。可以这样说，所有互联网上的资源，都可以通过 `<a>` 访问。

`<a>` 标签有以下属性：

- `href` 属性用于定义连接。它的值可以是一个 URL 或者锚点
- `target` 属性指定如何展示打开的链接。它可以是在指定的窗口打开，也可以在 `<iframe>` 里面打开。`target` 属性值保留了4个关键字：`_self`、`_blank`、`_parent`、`_top`
	- `_self` 在当前窗口中打开目标资源
	- `_blank` 在新窗口中打开目标资源
- `title` 属性给出链接的说明信息。鼠标悬停在链接上方时，浏览器会将这个属性的值，以提示块的形式显示出来
- `rel` 属性说明链接与当前页面的关系
- `type` 属性给出链接 URL 的 MIME 类型，比如到底是网页，还是图像或文件。没有实际功能
- `download` 属性表明当前链接用于下载，而不是跳转到另一个 URL。`download` 属性只在链接与网址同源时，才会生效

```html
<body>
    <!-- 
        href属性用于定义连接
            href中可以使用绝对路径,以/开头,始终以一个路径作为基准路径作为出发点
            href中也可以使用相对路径,不以/开头,以当前文件所在路径为出发点
            href中也可以定义完整的URL
     -->
   <a href="01html的基本结构.html" target="_blank">相对路径本地资源连接</a> <br>
   <a href="/day01-html/01html的基本结构.html" target="_self">绝对路径本地资源连接</a> <br>
   <a href="http://www.atguigu.com" target="_blank">外部资源链接</a> <br>
   
</body>
```

一些常见的 `rel` 属性值：

- `author` 作者链接
- `alternate` 当前文档的另一种形式，比如翻译
- `bookmark` 用作书签的永久地址
- `external` 当前文档的外部参考文档
- `help` 帮助链接
- `license` 许可证链接
- `prev` 系列文档的上一篇
- `next` 系列文档的下一篇
- `nofollow` 告诉搜索引擎忽略该链接，主要用于用户提交的内容，防止有人企图通过添加链接，提高该链接的搜索排名
- `search` 文档的搜索链接
- `tag` 文档的标签链接

## 多媒体标签

### img 标签

`<img>` 图片标签用于在页面上插入图片。

```html
<!-- 
src
	用于定义图片的连接
title
	用于定义鼠标悬停时显示的文字
alt
	用于定义图片加载失败时显示的提示文字
loading 
	指定图片的懒加载。由于行内图片的懒加载，可能会导致页面布局重排，最好指定图片的高和宽
srcset 
	指定多张图像，适应不同像素密度的屏幕
sizes 
	用来解决屏幕大小的适配。使用 sizes 属性必须与 srcset 属性搭配使用
-->
<img src="img/logo.png"  title="尚硅谷" alt="尚硅谷logo" />
```

### picture 标签

> `<img>` 标签的 `srcset` 属性和 `sizes` 属性分别解决了像素密度和屏幕大小的适配，但如果要同时适配不同像素密度、不同大小的屏幕，就要用到 `<picture>` 标签。

`<picture>` 是容器标签，内部使用 `<source>` 和 `<img>`，指定不同情况下加载的图像。该标签的用法类似 C 语言中的 switch ：

- `<source>` 是条件分支
- `<img>` 是默认情况
- `srcset` 指定多张图像，适应不同像素密度的屏幕
- `media` 是判断条件，给出屏幕尺寸的适配条件

```html
<picture>
  <source srcset="homepage-person@desktop.png,
                  homepage-person@desktop-2x.png 2x"
          media="(min-width: 990px)">
  <source srcset="homepage-person@tablet.png,
                  homepage-person@tablet-2x.png 2x"
          media="(min-width: 750px)">
  <img srcset="homepage-person@mobile.png,
               homepage-person@mobile-2x.png 2x"
       alt="Shopify Merchant, Corrine Anestopoulos">
</picture>
```

### video 标签

`<video>` 标签用于在页面上引入一段视频。如果浏览器支持加载的视频格式，就会显示一个播放器，否则显示 `<video>` 内部的子元素。

```html
<!-- 
src
	用于定义目标视频资源
autoplay
	用于控制打开页面时是否自动播放
controls
	用于控制是否展示控制面板
loop
	用于控制是否进行循环播放
--> 
<video src="img/movie.mp4" autoplay="autoplay" controls="controls" loop="loop" width="400px" />
```

> `<track>` 标签用于指定视频的字幕，格式是 WebVTT （`.vtt` 文件），放置在 `<video>` 标签内部。它是一个单独使用的标签。

### audio 标签

`<audio>` 标签用于在页面上引入一段声音。

```html
<!-- 
src
	用于定义目标声音资源
autoplay
	用于控制打开页面时是否自动播放
controls
	用于控制是否展示控制面板
loop
	用于控制是否进行循环播放
--> 
<audio src="img/music.mp3" autoplay="autoplay" controls="controls" loop="loop" />
```

## 表格标签

> 表格（table）以行（row）和列（column）的形式展示数据。

`<table>` 标签，代表表格，是一个块级容器标签，所有表格内容都要放在这个标签里面。

- `<tr>` 标签表示表格的一行（Table Row）
- `<thead>`标签，表示表头，可以省略不写
- `<tbody>`标签，表示表体，可以省略不写
- `<tfoot>`标签，表示表尾，可以省略不写
- `<th>` 和 `<td>` 都用来定义表格的单元格
	- `<th>` 是标题单元格，自带加粗和居中效果的td
	- `<td>` 是数据单元格，表示行内的一格

```html
<h3 style="text-align: center;">员工技能竞赛评分表</h3>
<table  border="1px" style="width: 400px; margin: 0px auto;">
    <tr>
        <th>排名</th>
        <th>姓名</th>
        <th>分数</th>
    </tr>
    <tr>
        <td>1</td>
        <td>张小明</td>
        <td>100</td>
    </tr>
    <tr>
        <td>2</td>
        <td>李小东</td>
        <td>99</td>
    </tr>
    <tr>
        <td>3</td>
        <td>王小虎</td>
        <td>98</td>
    </tr>
</table>
```

展示效果：

![展示效果|500x0](https://vip.123pan.cn/1844935313/obsidian/20260418091441304.png)

### 单元格跨行

单元格会出现跨越多行或多列的情况，这要通过 `colspan` 属性和 `rowspan` 属性设置，

- `colspan` 表示单元格跨越的列数
- `rowspan` 表示单元格跨越的行数

```html
<h3 style="text-align: center;">员工技能竞赛评分表</h3>
<table  border="1px" style="width: 400px; margin: 0px auto;">
    <tr>
        <th>排名</th>
        <th>姓名</th>
        <th>分数</th>
        <th>备注</th>
    </tr>
    <tr>
        <td>1</td>
        <td>张小明</td>
        <td>100</td>
		<!-- 单元格上下跨行 -->
        <td rowspan="6">
            前三名升职加薪
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>李小东</td>
        <td>99</td>
    </tr>
    <tr>
        <td>3</td>
        <td>王小虎</td>
        <td>98</td>
    </tr>
    <tr>
        <td>总人数</td>
		<!-- 单元格左右跨列 -->
        <td colspan="2">2000</td>
    </tr>
    <tr>
        <td>平均分</td>
        <td colspan="2">90</td>
    </tr>
    <tr>
        <td>及格率</td>
        <td colspan="2">80%</td>
    </tr>
</table>
```

展示单元格上下跨行、左右跨列：

![展示效果|500x0](https://vip.123pan.cn/1844935313/obsidian/20260418093621455.png)

## 表单标签

> 表单（form）是用户输入信息与网页互动的一种形式。表单由一种或多种的小部件组成，比如输入框、按钮、单选框或复选框。这些小部件称为控件（controls）。

表单标签 `<form>` ，其内部用于定义可以让用户输入信息的**表单项标签**。

- `action` 属性，用于定义信息提交的服务器的地址
- `method` 属性，用于定义信息的提交方式
	- `get`方式，数据会缀到url后，以 `?` 作为参数开始的标识，多个参数用 `&` 隔开
	- `post`方式，数据会通过请求体发送，不会在缀到url后

表单项标签 `<input>` 用于定义表单项。

- `type` 属性，用于定义表单项类型
	- `text` 文本框，是默认值
	- `password` 密码框，用户的输入会被遮挡，字符通常显示星号（`*`）或点（`·`）
	- `file` 文件选择框，允许用户选择一个或多个文件，常用于文件上传功能
	- `radio` 单选框。注意，多个单选框的 name 属性的值，应该都是一致的
	- `checkbox` 复选框
	- `hidden` 隐藏域，被其修饰的控件不显示在页面，用来向服务器传递一些隐藏信息
- `name` 属性，用于定义提交的参数名

`<input>` 标签是行内元素，用来接收用户的输入。它有多种类型，取决于 `type` 属性的值：

- `search` 是一个用于搜索的文本输入框，在输入框的尾部显示一个删除按钮
- `image` 表示将一个图像文件作为提交按钮
- `email` 是一个只能输入电子邮箱的文本输入框
- `number` 表示数字输入框，只能输入数字
- `range` 表示**滑块**，用户拖动滑块，选择给定范围之中的一个数值。常用于调节音量
- `url` 表示只能输入网址的文本框
- `tel` 表示只能输入电话号码的输入框
- `color` 是一个选择颜色的控件，它的值一律都是 `#rrggbb` 格式
- `date` 是一个只能输入日期的输入框。输入格式是 `YYYY-MM-DD`
- `time` 是一个只能输入时间的输入框。日期格式是24小时制的 `hh:mm`，包括秒数的格式是`hh:mm:ss`

```html
<form action="http://www.atguigu.com" method="get">
    用户名 <input type="text" name="username" /> <br>
    密&nbsp;&nbsp;&nbsp;码 <input type="password" name="password" /> <br>
    <input type="submit" value="登录" />
    <input type="reset" value="重置" />
</form>
```

展示效果：

![](https://vip.123pan.cn/1844935313/obsidian/20260418114504282.png)

> 用户名输入 12，密码输入 123，点击登录按钮，浏览器会跳转到 atguigu.com 网址： https://www.atguigu.com/?username=12&password=123

## 表单项标签

```html
<!-- 
text
	单行文本框 
password
	密码框
file
	文件标签
-->
用户名：<input type="text" name="signal"/><br/>

密码：<input type="password" name="secret"/><br/>

头像:<input type="file" name="file"/>
```

![展示效果|350x0](https://vip.123pan.cn/1844935313/obsidian/20260418122159543.png)

```html
<!-- 
radio
	单选框
	- name属性相同的radio为一组，组内互斥
	- 设置checked="checked"属性设置默认被选中的radio
checkbox
	复选框
<select>
	下拉框
	- 在option标签中设置selected="selected"属性实现默认选中的效果
	- 如果属性名和属性值一样的话，可以省略属性值，只写checked即可
-->
你的性别是：
<input type="radio" name="sex" value="spring" />男
<input type="radio" name="sex" value="summer" checked="checked" />女
<br>
你喜欢的球队是：
<input type="checkbox" name="team" value="Brazil"/>巴西
<input type="checkbox" name="team" value="German" checked/>德国
<input type="checkbox" name="team" value="France"/>法国
<input type="checkbox" name="team" value="China" checked="checked"/>中国
<input type="checkbox" name="team" value="Italian"/>意大利
<br>
你喜欢的运动是：
<select name="interesting">
    <option value="swimming">游泳</option>
    <option value="running">跑步</option>
    <option value="shooting" selected="selected">射击</option>
    <option value="skating">溜冰</option>
</select>
```

![展示效果|550x0](https://vip.123pan.cn/1844935313/obsidian/20260418122355417.png)

按钮标签 `<button>` 会生成一个可以点击的按钮，没有默认行为，通常需要用 `type` 属性或脚本指定按钮的功能。

- `button` 属性：普通按钮，点击后无效果，需要通过JavaScript绑定单击响应函数
- `reset` 属性：重置按钮，点击后将表单内的所有表单项都恢复为默认值
- `submit` 属性：提交按钮，点击后提交表单

```html
<button type="button">普通按钮</button>或<input type="button" value="普通按钮"/>
<button type="reset">重置按钮</button>或<input type="reset" value="重置按钮"/>
<button type="submit">提交按钮</button>或<input type="submit" value="提交按钮"/>
```

> `<button>` 内部不仅放置文字，还可以放置图像，这可以形成图像按钮。

type 属性 `hidden` 是隐藏域，通过表单隐藏域设置的表单项不会显示到页面上，用户看不到。但是提交表单时会一起被提交。用来设置一些需要和表单一起提交但是不希望用户看到的数据，例如：用户id等等。

```html
<input type="hidden" name="userId" value="2233"/>
```

多行文本框标签 `<textarea>` 。

```html
自我介绍：<textarea name="desc"></textarea>
```

## 布局相关标签

`<div>` 标签表示一个区块（division），俗称“块”，主要用于划分页面结构，做页面布局

`<span>` 俗称“层”，主要用于划分元素范围，配合CSS做页面元素样式。

```html
<div style="width: 500px; height: 400px;background-color: cadetblue;">
	<div style="width: 400px; height: 100px;background-color: beige;margin: 10px auto;">
		<span style="color: blueviolet;">页面开头部分</span>
	</div> 
	<div style="width: 400px; height: 100px;background-color: blanchedalmond;margin: 10px auto;">
		<span style="color: blueviolet;">页面中间部分</span>
	</div> 
	<div style="width: 400px; height: 100px;background-color: burlywood;margin: 10px auto;">
		<span style="color: blueviolet;">页面结尾部分</span>
	</div> 
</div>
```

![展示效果|500x0](https://vip.123pan.cn/1844935313/obsidian/20260418123828124.png)

## link 标签

> `<link>` 标签主要用于将当前网页与相关的外部资源联系起来，通常放在 `<head>` 元素里面。最常见的用途就是加载 CSS 样式表。

```html
<link rel="stylesheet" type="text/css" href="theme.css">
```

`<link>` 还可以加载网站的 favicon 图标文件。

```html
<link rel="icon" href="/favicon.ico" type="image/x-icon">
```

`<link>` 也用于提供文档的相关链接，比如下面是给出文档的 RSS Feed 地址。

```html
<link rel="alternate" type="application/atom+xml" href="/blog/news/atom">
```

`<link>` 通过设置 `rel` 属性的值，可以提供资源预加载，有五个关键字：`preload`、`prefetch`、`preconnect`、`dns-prefetch`、`prerender`。

## script 标签

> `<script>` 用于加载脚本代码，比如 JavaScript 代码。可以在 HTML 中直接给出代码，也可以利用 `src` 属性加载外部脚本。

`type` 属性给出脚本的类型，默认是 JavaScript 代码，可省略。完整的写法如下：

```html
<script type="text/javascript" src="javascript.js"></script>
```

`type` 属性也可以设成 `module`，表示这是一个 ES6 模块，不是传统脚本。

```html
<script type="module" src="main.js"></script>
```

`<noscript>` 标签用于浏览器不支持或关闭 JavaScript 时，所要显示的内容。用户关闭 JavaScript 可能是为了节省带宽，以延长手机电池寿命，或者为了防止追踪，保护隐私。

## iframe 标签

> `<iframe>` 标签生成一个指定区域，在该区域中**嵌入其他网页**。它是一个容器元素，如果浏览器不支持 `<iframe>`，就会显示内部的子元素。

```html
<iframe src="https://www.example.com"
        width="100%" height="500" frameborder="0"
        allowfullscreen sandbox>
  <p><a href="https://www.example.com">点击打开嵌入页面</a></p>
</iframe>
```

嵌入的网页默认具有正常权限，比如执行脚本、提交表单、弹出窗口等。如果嵌入的网页是其他网站的页面，你不了解对方会执行什么操作，因此就存在安全风险。为了限制 `<iframe>` 的风险，HTML 提供了 `sandbox` 属性，允许设置嵌入的网页的权限，等同于提供了一个隔离层，即“沙箱”。

`sandbox`可以当作布尔属性使用，表示打开所有限制。`sandbox` 属性可以设置具体的值，表示逐项打开限制。

`<iframe>` 指定的网页会立即加载，有时这不是希望的行为。`<iframe>`滚动进入视口以后再加载，这样会比较节省带宽。

`loading` 属性可以触发 `<iframe>` 网页的懒加载。

## 其他标签

`<fieldset>` 标签是块级容器标签，表示控件的集合，用于将一组相关控件组合成一组。有点类似前面的 `<div>` 标签。

`<legend>` 标签用来设置 `<fieldset>` 控件组的标题，通常是 `<fieldset>` 内部的第一个元素，会嵌入显示在控件组的上边框里面。

`<datalist>` 标签是一个容器标签，用于为指定控件提供一组相关数据，通常用于生成输入提示。注意，`<option>` 在这里可以不需要闭合标签。

```html
<label for="ice-cream-choice">冰淇淋：</label>
<input type="text" list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice">

<datalist id="ice-cream-flavors">
  <option value="巧克力">
  <option value="椰子">
  <option value="薄荷">
</datalist>
```

`<output>` 标签是行内元素，用于显示用户操作的结果。

`<progress>` 标签是一个行内元素，表示任务的完成进度。浏览器通常会将显示为进度条。

`<meter>` 标签是一个行内元素，表示指示器，用来显示已知范围内的一个值，很适合用于任务的当前进度、磁盘已用空间、充电量等带有比例性质的场合。浏览器通常会将其显示为一个不会滚动的指示条

`<dialog>` 标签表示一个可以关闭的对话框。默认情况下，对话框是隐藏的，不会在网页上显示。如果要让对话框显示，加上 `open` 属性。

`<details>` 标签用来折叠内容，浏览器会折叠显示该标签的内容。`<details>` 标签的 `open` 属性，用于默认打开折叠。

`<summary>` 标签用来定制折叠内容的标题。

- `<wbr>` 标签表示一个可选的断行。如果一行的宽度足够，则不断行；如果宽度不够，需要断行，就在 `<wbr>` 的位置的断行
- `<pre>` 是块级元素，表示保留原来的格式（preformatted），即浏览器会**保留该标签内部原始的换行和空格**
- `<strong>` 是行内元素，表示它包含的内容具有很强的重要性，需要引起注意。浏览器会以**粗体**显示内容
- `<em>` 是行内标签，表示强调（emphasize），浏览器会以**斜体**显示它包含的内容
- `<sub>` 标签将内容变为**下标**，`<sup>` 标签将内容变为**上标**。它们都是行内元素
- `<u>` 标签是行内元素，表现为一根**下划线**，提醒用户这里可能有问题，基本上只用来表示拼写错误
- `<s>` 标签是行内元素，为内容加上**删除线**
- `<blockquote>` 是块级标签，表示**引用**他人的话
- `<cite>` 标签表示**引言出处**或者作者，浏览器默认使用斜体显示这部分内容
- `<q>` 是行内标签，也表示引用。它与 `<blockquote>` 的区别，就是它不会产生换行。注意，浏览器默认会斜体显示 `<q>` 的内容，并且会自动添加半角的双引号
- `<code>` 标签是行内元素，表示**计算机代码**。要表示多行代码，`<code>` 标签必须放在 `<pre>` 内部
- `<mark>` 是行内标签，表示突出显示的内容。Chrome 默认是黄色**高亮**背景
- `<small>` 是行内标签，将内容以小一号的字号显示。它通常用于文章附带的**版权信息**或法律信息
- `<time>` 是行内标签，为跟时间相关的内容提供机器可读的格式
- `<data>` 标签与 `<time>` 类似，也是提供机器可读的内容，但是用于非时间的场合
- `<address>` 标签是块级元素，表示某人或某个组织的联系方式。通常 `<address>` 会放在`<footer>` 里面
- `<abbr>` 标签是行内元素，表示标签内容是一个**缩写**。它的 `title` 属性给出缩写的完整形式，或者缩写的描述。鼠标悬停在该元素上方时，`title` 属性值作为提示而显示出来
- `<ins>` 标签是一个行内元素，表示原始文档添加（insert）的内容。`<del>` 与之类似，表示删除（delete）的内容。它们通常用于展示文档的删改。
- `<dfn>` 是行内元素，表示标签内容是一个术语（definition），本段或本句包含它的定义。为了脚本操作的方便，可以把术语的定义写入 `<dfn>` 标签的 `title` 属性
- `<ruby>` 标签表示文字的语音注释，主要用于东亚文字，比如汉语拼音和日语的片假名。它默认将语音注释，以小字体显示在文字的上方
- `<bdo>` 标签是行内元素，表示文字方向与网页主体内容的方向不一致
- `<bdi>` 标签用于不确定文字方向的情况，由浏览器自行决定

# 字符编码

## 码点表示法

网页可以使用不同语言的编码方式，但是最常用的编码是 UTF-8。

每个字符有一个 Unicode 号码，称为码点（code point）。如果知道码点，就能查到这是什么字符。HTML 允许使用 Unicode 码点表示字符，浏览器会自动将码点转成对应的字符。

字符的**码点表示法**是 `&#N;`（十进制，`N` 代表码点）或者 `&#xN;`（十六进制，`N` 代表码点）。使用码点可以突破键盘能输出的字符限制，输出所有 Unicode 字符。

```html
<p>hello</p>
<!-- 等同于 -->
<p>&#104;&#101;&#108;&#108;&#111;</p>
<!-- 等同于 -->
<p>&#x68;&#x65;&#x6c;&#x6c;&#x6f;</p>
```

> 注意，HTML 标签本身不能使用码点表示，否则浏览器会认为这是所要显示的文本内容，而不是标签。比如，`<p>` 一旦写成 `<&#112;>` 或者 `&#60;&#112;&#62;`，浏览器就不再认为这是标签了，而会当作文本内容将其显示为 `<p>`。

## 实体表示法

码点表示法的不方便之处，在于必须知道每个字符的码点，很难记忆。为了能够快速输入，HTML 为一些特殊字符，规定了容易记忆的名字，允许通过名字来表示它们，这称为实体表示法。

实体的写法是 `&name;`，其中的 `name` 是字符的名字。下面是其中一些特殊字符，及其对应的实体。

| 显示结果 | 描述        | 实体名称       | 实体编号     |
| ---- | --------- | ---------- | -------- |
|      | 空格        | `&nbsp;`   | `&#160;` |
| <    | 小于号       | `&lt;`     | `&#60;`  |
| >    | 大于号       | `&gt;`     | `&#62;`  |
| "    | 引号        | `&quot;`   | `&#34;`  |
| '    | 撇号        | `&apos;`   | `&#39;`  |
| &    | 和号        | `&amp;`    | `&#38;`  |
| ©    | 版权        | `&copy;`   | `&#169;` |
| #    | 井号        | `&num;`    | `&#35;`  |
| §    | 小节        | `&sect;`   | `&#167;` |
| ¥    | 元 (yen)   | `&yen;`    | `&#165;` |
| $    | 美元        | `&dollar;` | `&#36;`  |
| £    | 镑 (pound) | `&pound;`  | `&#163;` |
| ¢    | 分 (cent)  | `&cent;`   | `&#162;` |
| %    | 百分号       | `&percnt;` | `&#37;`  |
| *    | 星号        | `$ast;`    | `&#42;`  |
| @    | 艾特符号      | `&commat;` | `&#64;`  |
| ^    | 脱字符       | `&Hat;`    | `&#94;`  |
| ±    | 正负号       | `&plusmn;` | `&#177;` |

# URL 简介

URL 是 Uniform Resource Locator 的首字母缩写，表示各种资源的互联网地址。

所谓资源，可以简单理解成各种可以通过互联网访问的文件，比如网页、图像、音频、视频、JavaScript 脚本等等。只有知道了它们的 URL，才能在互联网上获取它们。

URL 模板：

```txt
https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor
```

- 协议（scheme）是浏览器请求服务器资源的方法，如 `https://` 、邮件地址协议`mailto:`
- 主机（host）是资源所在的网站名或服务器的名字，如 `www.example.com`，也可以是 IP 地址
- 端口（port）用于主机上区分不同的网络服务或应用程序，范围是0到65535
- 路径（path）是资源在网站的位置，比如 `/path/to/myfile.html` 。路径可以指向目录，比如 `/fool/` ，此时服务器会默认定位到 `/fool/index.html`
- 查询参数（parameter）是提供给服务器的额外信息。多组参数之间使用 `&` 连接
- 锚点（anchor）是网页内部的定位点，使用 `#` 加上锚点名称。浏览器加载页面以后，会自动滚动到锚点所在的位置

URL 的各个组成部分，只能使用以下字符。

- 26个英语字母（包括大写和小写）
- 10个阿拉伯数字
- 连词号（`-`）
- 句点（`.`）
- 下划线（`_`）

此外，还有18个字符属于 URL 的保留字符。使用保留字符时浏览器会进行转义，既不属于合法字符、也不属于保留字符的其他字符（比如汉字）也会被浏览器转义。这解释了为什么转发给别人的链接可能是一大长串十六进制数。

| 保留字符 | 转义后 | 保留字符 | 转义后 | 保留字符 | 转义后 |
| ---- | --- | ---- | --- | ---- | --- |
| `!`  | %21 | `)`  | %29 | `;`  | %3B |
| `#`  | %23 | `*`  | %2A | `=`  | %3D |
| `$`  | %24 | `+`  | %2B | `?`  | %3F |
| `&`  | %26 | `,`  | %2C | `@`  | %40 |
| `'`  | %27 | `/`  | %2F | `[`  | %5B |
| `(`  | %28 | `:`  | %3A | `]`  | %5D |

URL 有绝对地址和相对地址，类似文件的绝对路径和相对路径。正如文件系统有一个根目录 `/`，URL 也有根目录，由 `<base>` 确定。`<base>` 标签的 `href` 属性给出计算的基准网址，`target` 属性给出如何打开链接的说明。

```html
<head>
	<base href="https://www.example.com/files/" target="_blank">
</head>
```

# 元素的属性

> 网页元素的属性（attribute）可以定制元素的行为，元素属性的写法是 HTML 标签内部的“键值对”。

属性名与标签名一样，不区分大小写。有些属性是布尔属性，只有“打开”和“关闭”两种情况。这时属性值可以省略，只要添加了属性名，就表示打开该属性。

以下是常见的全局属性：

- `id` 属性是元素在网页内的唯一标识符
- `class` 属性用来对网页元素进行分类。如果不同元素的 `class` 属性值相同，就表示它们是一类的。元素可以同时具有多个 class，它们之间使用空格分隔
- `title` 属性用来为元素添加附加说明。鼠标悬浮在元素上面时，会将 `title` 属性值作为浮动提示，显示出来
- `tabindex`属性指定用户按下 Tab 键的时候，网页焦点转移的顺序。没有鼠标的情况下，可以使用 Tab 键，遍历网页元素
- `accesskey` 属性指定网页元素获得焦点的快捷键。`accesskey` 属性的字符键，必须配合功能键一起按下才会生效
- `style`属性用来指定当前元素的 CSS 样式
- `hidden` 属性表示当前的网页元素不必在浏览器中显示。注意，CSS 的可见性设置高于`hidden` 属性
- `lang` 属性指定网页元素使用的语言
- `dir` 属性表示**文字的阅读方向**，有从左到右和从右到左两个方向
- `translate` 属性只用于文本元素，用来指示翻译软件，不翻译该文本
- `contenteditable` 属性允许用户编辑内容。HTML 网页的内容默认是用户不能编辑
- `spellcheck` 属性表示浏览器是否打开拼写检查。对于不可编辑的元素，该属性无效
- `data-` 属性用于放置自定义数据。如果没有其他属性或元素合适放置数据，就可以放在 `data-` 属性。`data-` 属性只能通过 CSS 或 JavaScript 利用
- 事件处理属性（event handler）用来响应用户的动作。这些属性的值都是 JavaScript 代码

