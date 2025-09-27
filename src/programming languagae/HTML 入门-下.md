---
title: HTML 入门-下
date: 2025-09-27
tags:
  - HTML
category:
  - 编程语言
---
# 前言

学习阮一峰老师的 [HTML 教程](https://wangdoc.com/html/)。

<!-- more -->

# 7. 列表标签

> 列表是一系列排列好的项目，主要分成两类：有序列表和无序列表。
> 
> 有序列表是每个列表项前面有编号，呈现出顺序。无序列表则是列表项前面没有编号，只有一个列表符号，默认是一个圆点。

`<ol>` 标签是一个有序列表容器（ordered list），会在内部的列表项前面产生数字编号。`<ol>` 标签内部可以嵌套 `<ol>` 标签或 `<ul>` 标签，形成多级列表。

```html
<ol>
  <li>列表项 A</li>
  <li>列表项 B</li>
  <li>列表项 C</li>垆
</ol>
```

`<ol>` 标签有以下属性：

- `reversed` 属性产生倒序的数字列表 
- `start` 属性的值是一个整数，表示数字列表的起始编号
- `type` 属性指定数字编号的样式。可选值有  `a`（小写字母）、 `A`（大写字母）、 `i`（小写罗马数字）、 `I`（大写罗马数字）、 `1`（整数，默认值）。注意，即使编号是字母，`start` 属性也依然有效

`<ul>` 标签是一个无序列表容器（unordered list），会在内部的列表项前面产生实心小圆点，作为列表符号。列表项的顺序无意义时，采用这个标签。`<ul>` 标签同样可以通过嵌套，形成多级列表。

`<li>` 表示列表项，用在 `<ol>` 或 `<ul>` 容器之中。有序列表 `<ol>` 之中，`<li>` 有一个 `value` 属性，定义当前列表项的编号，后面列表项会从这个值开始编号。

`<dl>` 标签是块级元素，表示一组术语的列表（description list）。术语名（description term）由 `<dt>` 标签定义，术语解释（description detail）由 `<dd>` 标签定义。`<dl>` 常用来定义词汇表。

多个术语（`<dt>`）对应一个解释（`<dd>`），或者多个解释（`<dd>`）对应一个术语（`<dt>`），都是合法的。

```html
<dl>
  <dt>A</dt>
  <dt>B</dt>
  <dd>C</dd>

  <dt>D</dt>
  <dd>E</dd>
  <dd>F</dd>
</dl>
```

上面代码中，`A` 和 `B` 有共同的解释 `C`，而 `D` 有两个解释 `E` 和 `F`。

# 8. 图像标签

> 图片是互联网的重要组成部分，让网页变得丰富多彩。

`<img>` 标签用于插入图片，默认是一个行内元素，与前后的文字处在同一行。

`<img>` 标签有以下属性：

- `alt` 属性用来设定图片的文字说明。图片不显示时，图片的位置上会显示该文本
- `width` 属性和 `height` 属性[^1]可以指定图片显示时的宽度和高度，单位是像素或百分比。只设置了一个，另一个没有设置。这时，浏览器会根据图片的原始大小，自动设置对应比例的图片宽度或高度
- `<img>` 导致的图片加载的 HTTP 请求，默认会带有 `Referer` 的头信息。`referrerpolicy` 属性对这个行为进行设置
- 当图片和网页属于不同的网站时，网页加载图片就会导致跨域请求，对方服务器可能要求跨域认证。`crossorigin` 属性用来告诉浏览器，是否采用跨域的形式下载图片，默认不采用
- `loading` 属性指定图片的**懒加载**。由于行内图片的懒加载，可能会导致页面布局重排，最好指定图片的高和宽
- `srcset` 属性用来指定多张图像，**适应不同像素密度的屏幕**
- `sizes` 属性用来解决屏幕大小的适配。使用 `sizes` 属性必须与 `srcset` 属性搭配使用

`<figure>` 标签用来管理多张图像及其相关信息。`<figcaption>` 是它的可选子元素，表示图像的文本描述，通常用于放置标题，可以出现多个。

```html
<figure>
  <img src="https://example.com/foo.jpg">
  <figcaption>示例图片</figcaption>
</figure>
```

`<img>` 标签的 `srcset` 属性和 `sizes` 属性分别解决了像素密度和屏幕大小的适配，但如果要同时适配不同像素密度、不同大小的屏幕，就要用到 `<picture>` 标签。

`<picture>` 是容器标签，内部使用 `<source>` 和 `<img>`，指定不同情况下加载的图像。该标签的用法类似 C 语言中的 switch ：`media` 是判断条件，给出屏幕尺寸的适配条件，`source` 是条件分支，`<img>` 标签是默认情况。

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

# 9. 超链接

> 链接（hyperlink）是互联网的核心。它允许用户在页面上，从一个网址跳转到另一个网址，从而把所有资源联系在一起。

`<a>` 标签表示一个可以跳转的链接。它不仅可以跳转到其他页面，也可以跳转到文本、图像、文件等资源，甚至当前页面的某个位置。可以这样说，所有互联网上的资源，都可以通过 `<a>` 访问。

`<a>`标签有以下属性：

- `href` 属性给出链接指向的网址。它的值可以是一个 URL 或者锚点，也可以是邮件地址和电话链接
- `hreflang` 属性给出链接指向的网址所使用的语言，没有实际功能，主要供搜索引擎使用
- `title` 属性给出链接的说明信息。鼠标悬停在链接上方时，浏览器会将这个属性的值，以提示块的形式显示出来
- `target` 属性指定如何展示打开的链接。它可以是在指定的窗口打开，也可以在 `<iframe>` 里面打开。`target` 属性值保留了4个关键字：`_self`、`_blank`、`_parent`、`_top`
- `rel` 属性说明链接与当前页面的关系
- `referrerpolicy` 属性用于精确设定点击链接时，浏览器发送 HTTP 头信息的 `Referer` 字段的行为 
- `ping` 属性指定一个网址，用户点击的时候，会向该网址发出一个 POST 请求，通常用于跟踪用户的行为
- `type` 属性给出链接 URL 的 MIME 类型，比如到底是网页，还是图像或文件。没有实际功能
- `download` 属性表明当前链接用于下载，而不是跳转到另一个 URL。`download` 属性只在链接与网址同源时，才会生效

下面是一些常见的 `rel` 属性的值：

- `alternate`：当前文档的另一种形式，比如翻译
- `author`：作者链接
- `bookmark`：用作书签的永久地址
- `external`：当前文档的外部参考文档
- `help`：帮助链接
- `license`：许可证链接
- `next`：系列文档的下一篇
- `nofollow`：告诉搜索引擎忽略该链接，主要用于用户提交的内容，防止有人企图通过添加链接，提高该链接的搜索排名
- `noreferrer`：告诉浏览器打开链接时，不要将当前网址作为 HTTP 头信息的 `Referer` 字段发送出去，这样可以隐藏点击的来源
- `noopener`：告诉浏览器打开链接时，不让链接窗口通过 JavaScript 的 `window.opener` 属性引用原始窗口，这样就提高了安全性
- `prev`：系列文档的上一篇
- `search`：文档的搜索链接
- `tag`：文档的标签链接

# 10.  `<link>`

> `<link>` [^2]标签主要用于将当前网页与相关的外部资源联系起来，通常放在 `<head>` 元素里面。最常见的用途就是加载 CSS 样式表。

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

# 11. `<script>`

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

# 12. 多媒体标签

`<video>` 标签是块级元素，用于放置视频。如果浏览器支持加载的视频格式，就会显示一个播放器，否则显示 `<video>` 内部的子元素。

```html
<video src="example.mp4" controls>
  <p>你的浏览器不支持 HTML5 视频，请下载<a href="example.mp4">视频文件</a>。</p>
</video>
```

`<audio>` 标签是块级元素，用于放置音频，用法与 `<video>` 标签基本一致。

`<track>` 标签用于指定视频的字幕，格式是 WebVTT （`.vtt` 文件），放置在 `<video>` 标签内部。它是一个单独使用的标签。

`<source>` 标签用于 `<picture>`、`<video>`、`<audio>` 的内部，用于指定一项外部资源。该标签是单独使用的。

`<embed>` 标签用于嵌入外部内容，这个外部内容通常由浏览器插件负责控制。由于浏览器的默认插件都不一致，很可能不是所有浏览器的用户都能访问这部分内容，建议谨慎使用。

`<object>` 标签作用跟 `<embed>` 相似，也是插入外部资源，由浏览器插件处理，属于历史遗留问题。

# 13. iframe

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

# 14. 表格标签

> 表格（table）以行（row）和列（column）的形式展示数据。

`<table>` 是一个块级容器标签，所有表格内容都要放在这个标签里面。

`<caption>` 是 `<table>` 里面的第一个子元素，表示表格的标题。

`<thead>`、`<tbody>`、`<tfoot>` 都是块级容器元素，且都是 `<table>` 的一级子元素，分别表示表头、表体和表尾。

`<colgroup>` 是 `<table>` 的一级子元素，用来包含一组列的定义。

`<col>` 是 `<colgroup>` 的子元素，用来定义表格的一列，除了申明表格结构，还可以为表格附加样式。`<col>` 有一个 `span` 属性，值为正整数，默认为`1`。如果大于1，就表示该列的宽度包含连续的多列。

```html
<table>
  <caption>示例表格</caption>
  <colgroup>
    <col class="c1">
    <col class="c2">
    <col class="c3">
  </colgroup>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>
```

`<tr>` 标签表示表格的一行（table row）。

`<th>` 和 `<td>` 都用来定义表格的单元格。其中`<th>` 是标题单元格，`<td>` 是数据单元格。单元格会有跨越多行或多列的情况，这要通过 `colspan` 属性和 `rowspan` 属性设置，前者表示单元格跨越的列数，后者表示单元格跨越的行数。

# 15. 表单标签

> 表单（form）是用户输入信息与网页互动的一种形式。表单由一种或多种的小部件组成，比如输入框、按钮、单选框或复选框。这些小部件称为控件（controls）。

`<fieldset>` 标签是块级容器标签，表示控件的集合，用于将一组相关控件组合成一组。有点类似前面的 `<div>` 标签。

`<legend>` 标签用来设置 `<fieldset>` 控件组的标题，通常是 `<fieldset>` 内部的第一个元素，会嵌入显示在控件组的上边框里面。

`<label>` 标签是行内元素，提供控件的文字说明，帮助用户理解控件的目的。

```html
<label for="user">用户名：</label>
<input type="text" name="user" id="user">
```

`<label>` 的属性如下：

- `for`：关联控件的 `id` 属性。
- `form`：关联表单的 `id` 属性。设置了该属性后，`<label>` 可以放置在页面的任何位置，否则只能放在 `<form>` 内部。

`<input>` 标签是行内元素，用来接收用户的输入。它有多种类型，取决于 `type` 属性的值：

- `text` 是默认值，表示一个输入框
- `search` 是一个用于搜索的文本输入框，在输入框的尾部显示一个删除按钮
- `button`[^3] 是没有默认行为的按钮，通常脚本指定 `click` 事件的监听函数来使用
- `submit` 表示表单的提交按钮。用户点击这个按钮，就会把表单提交给服务器
- `image` 表示将一个图像文件作为提交按钮
- `reset` 是重置按钮，用户点击以后，所有表格控件重置为初始值
- `checkbox` 表示复选框
- `radio` 表示单选框。注意，多个单选框的`name`属性的值，应该都是一致的
- `email` 是一个只能输入电子邮箱的文本输入框
- `password` 表示密码输入框。用户的输入会被遮挡，字符通常显示星号（`*`）或点（`·`）
- `file` 表示文件选择框，允许用户选择一个或多个文件，常用于文件上传功能
- `hidden` 表示不显示在页面的控件，用户无法输入它的值，主要用来向服务器传递一些隐藏信息
- `number` 表示数字输入框，只能输入数字
- `range` 表示**滑块**，用户拖动滑块，选择给定范围之中的一个数值。常用于调节音量
- `url` 表示只能输入网址的文本框
- `tel` 表示只能输入电话号码的输入框
- `color` 是一个选择颜色的控件，它的值一律都是 `#rrggbb` 格式
- `date` 是一个只能输入日期的输入框。输入格式是 `YYYY-MM-DD`
- `time` 是一个只能输入时间的输入框。日期格式是24小时制的 `hh:mm`，包括秒数的格式是`hh:mm:ss`

`<button>` 标签会生成一个可以点击的按钮，没有默认行为，通常需要用 `type` 属性或脚本指定按钮的功能。

`<button>` 内部不仅放置文字，还可以放置图像，这可以形成图像按钮。

`<select>` 标签用于生成一个下拉菜单。下拉菜单的菜单项由 `<option>` 标签给出，每个 `<option>` 代表可以选择的一个值。

```html
<label for="pet-select">宠物：</label>
<select id="pet-select" name="pet-select">
  <option value="">--请选择一项--</option>
  <option value="dog">狗</option>
  <option value="cat">猫</option>
  <option value="others">其他</option>
</select>
```

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

`<textarea>` 是块级元素，用来生成多行的文本框。

`<output>` 标签是行内元素，用于显示用户操作的结果。

`<progress>` 标签是一个行内元素，表示任务的完成进度。浏览器通常会将显示为进度条。

`<meter>` 标签是一个行内元素，表示指示器，用来显示已知范围内的一个值，很适合用于任务的当前进度、磁盘已用空间、充电量等带有比例性质的场合。浏览器通常会将其显示为一个不会滚动的指示条

# 16. 其他标签

`<dialog>` 标签表示一个可以关闭的对话框。默认情况下，对话框是隐藏的，不会在网页上显示。如果要让对话框显示，加上 `open` 属性。

`<details>` 标签用来折叠内容，浏览器会折叠显示该标签的内容。`<details>` 标签的 `open` 属性，用于默认打开折叠。

`<summary>` 标签用来定制折叠内容的标题。

[^1]: 注意，一旦设置了 `width` 和 `height` ，浏览器会在网页中预先留出这个大小的空间，不管图片有没有加载成功。不过，由于图片的显示大小可以用 CSS 设置，所以不建议使用这两个属性。

[^2]: 更多有关 `<link>`： https://wangdoc.com/html/link

[^3]: 建议尽量不使用这个类型，而使用 `<button>` 标签代替，一则语义更清晰，二则 `<button>` 标签内部可以插入图片或其他 HTML 代码。
