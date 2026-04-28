---
title: CSS 入门
date: 2025-09-28
tags:
  - CSS
category:
  - 编程语言
---
# 前言

学习 Harry Roberts 的 [High-level advice and guidelines for writing sane, manageable, scalable CSS](https://cssguidelin.es/) 和尚硅谷的 JavaWeb课程。

在线帮助文档： https://www.w3school.com.cn/

<!-- more -->

CSS，全称 Cascading Style Sheets，能够对网页中元素位置的排版进行像素级精确控制，支持几乎所有的字体字号样式，拥有对网页对象和模型样式编辑的能力，简单来说，美化页面。

# CSS 引入方式

## 行内式

行内式，通过元素开始标签的 `style` 属性引入，语法为 `样式名:样式值;` 。

```html
<!--
display: block;
	将元素的显示类型设置为“块级元素”
color: white; 
	设置元素内`文本颜色`为白色
border: 3px solid green;
	一次性设置`边框`的宽度、样式和颜色
font-family: '隶书',serif;
	字体设置为隶书，若电脑上未安装隶书，默认用 serif 显示
line-height: 30px;
	设置文本行的高度（行间距）。
border-radius: 5px;
	设置元素边框的圆角半径。按钮的四个角会变得圆滑
-->
<input 
	type="button" 
	value="按钮"
	style="
		display: block;
		width: 60px; 
		height: 40px; 
		background-color: rgb(140, 235, 100); 
		color: white;  
		border: 3px solid green;
		font-size: 22px;
		font-family: '隶书',serif;
		line-height: 30px;
		border-radius: 5px;
"/> 
```

行内式的缺点：

+ html代码和css样式代码交织在一起，增加阅读难度和维护成本
+ css样式代码仅对当前元素有效，代码重复量高，复用度低

## 内嵌式

内嵌式样式需要在 `<head>` 标签中,通过一对 `<style>` 标签定义CSS样式。

```html
<head>
    <meta charset="UTF-8">
    <style>
        /* 通过选择器确定内嵌式样式的作用范围 */
        input {
            display: block;
            width: 80px; 
            height: 40px; 
            background-color: rgb(140, 235, 100); 
            color: white;
            border: 3px solid green;
            font-size: 22px;
			font-family: '隶书',serif;
            line-height: 30px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <input type="button" value="按钮1"/> 
    <input type="button" value="按钮2"/> 
    <input type="button" value="按钮3"/> 
    <input type="button" value="按钮4"/> 
</body>
```

内嵌式的缺点：

- 内嵌式虽然对样式代码做了抽取，但是CSS代码仍然在html文件中
- 内嵌样式仅仅能作用于当前文件，代码复用度还是不够，不利于网站风格统一

## 外部样式表

在项目单独创建css样式文件，专门用于存放CSS样式代码。

```css
/* buttoms.css */
input {
    display: block;
    width: 80px;
    height: 40px;
    background-color: rgb(140, 235, 100);
    color: white;
    border: 3px solid green;
    font-size: 22px;
    font-family: '隶书',serif;
    line-height: 30px;
    border-radius: 5px;
}
```

在 `<head>` 标签中，通过 `<link>` 标签引入外部CSS样式即可。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<!--
	CSS样式代码从html文件中剥离,利于代码的维护
	CSS样式文件可以被多个不同的html引入,利于网站风格统一
	-->
    <link href="css/buttons.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<input type="button" value="按钮1"/>
	<input type="button" value="按钮2"/>
	<input type="button" value="按钮3"/>
	<input type="button" value="按钮4"/>
</body>
</html>
```

# CSS 选择器

## 元素选择器

根据**标签名**确定样式的作用范围，语法为 `元素名 { }` 。

```html
<head>
    <meta charset="UTF-8">
    <style>
		/* 元素选择器 */
        input {
            display: block;
            background-color: rgb(140, 235, 100); 
        }
    </style>
</head>
<body>
    <input type="button" value="按钮1"/> 
    <input type="button" value="按钮2"/> 
	<button>按钮3</button>
</body>
```

元素选择器的缺点：

- 样式只能作用到同名标签上，其他标签不可用
- 相同的标签未必需要相同的样式，会造成样式的作用范围太大

## id 选择器

根据**元素id属性**的值确定样式的作用范围，语法为  `#id值 {}` 。

```html
<head>
    <meta charset="UTF-8">
    <style>
		/* id 选择器 */
        #btn1 {
            display: block;
            background-color: rgb(140, 235, 100);
        }
    </style>
</head>
<body>
    <input id="btn1" type="button" value="按钮1"/>
    <input id="btn2" type="button" value="按钮2"/>
    <button id="btn3">按钮3</button>
</body>
```

id 选择器的缺点：

- id属性的值在页面上具有唯一性，所有id选择器也只能影响一个元素的样式
- 因为id属性值不够灵活，所以使用该选择器的情况较少

## class 选择器

根据**元素class属性**的值确定样式的作用范围，语法为 `.class值 {}` 。

- class属性值可以有一个，也可以有多个，多个不同的标签也可以是使用相同的class值
- 多个选择器的样式可以在同一个元素上进行叠加
- 因为class选择器非常灵活，所以在CSS中，使用该选择器的情况较多

```html
<head>
    <meta charset="UTF-8">
    <style>
        .shapeClass {
            display: block;
            width: 80px;
            height: 40px;
            border-radius: 5px;
        }
        .colorClass{
            background-color: rgb(140, 235, 100);
            color: white;
            border: 3px solid green;
        }
        .fontClass {
            font-size: 22px;
            font-family: '隶书',serif;
            line-height: 30px;
        }
    </style>
</head>
<body>
    <input  class ="shapeClass colorClass fontClass" type="button" value="按钮1"/>
    <input  class ="shapeClass colorClass" type="button" value="按钮2"/>
    <input  class ="colorClass fontClass" type="button" value="按钮3"/>
    <input  class ="fontClass" type="button" value="按钮4"/>
    <button class="shapeClass colorClass fontClass" >按钮5</button>
</body>
```

![展示效果|200x0](https://vip.123pan.cn/1844935313/obsidian/20260418160847384.png)

## 选择器命名约定

CSS 选择器的命名，应该遵循类 BEM 命名风格。BEM，即 Block（块）、Element（元素）Modifier（修饰符）。元素是块的组成部分，而修饰符是块的变体或扩展。

- 块用连字符 `-` 分隔单词
- 元素由两个下划线（ `__` ）分隔
- 修饰符由两个连字符（ `--` ）分隔

```css
.person { }
.persjjon__head { }
.person--tall { }
```

更多的块，而不是将在一个块内继续嵌套大量的块；名字尽量简洁，比如  `.person__head__eye {}` 就不如 `.person__eye {}`。总之，就是要让 CSS 文件更容易阅读，看选择器的名字就像在看无形的注释。

相比于在 CSS 文件中使用，命名约定在 HTML 中更能发挥作用。下面的代码中每个 CSS 选择器之间的关系很模糊，就好像用面向对象语言时，不用类，非要用几个看上去独立的函数，这几个函数之间不用类囊括起来，他们的关系也很模糊。

```css
<div class="box  profile  pro-user">

  <img class="avatar  image" />

  <p class="bio">...</p>

</div>
```

修改为类 BEM 风格的命名后，这些选择器之间的关系就清晰多了。原来 pro-user 是 profile 的变体，image 和 bio 是 profile 的元素。

```css
<div class="box  profile  profile--is-pro-user">

  <img class="avatar  profile__image" />

  <p class="profile__bio">...</p>

</div>
```

CSS 和 JavaScript 在 HTML中使用时，是放在标签的 `class` 中。如果把 CSS 和 JavaScript 写在同一个 class 中，那么修改其中一个就很难避免影响另一个。正确的做法是，分成两个 class，一个放 CSS，一个放 JavaScript。

```html
<input type="submit" class="btn  js-btn" value="Follow" />
```

限制选择器的使用范围，下面代码中的 `.error` 选择器可以复用于任一标签，但是 `div.error` 表示应该在 `<div>` 标签中使用。

```css
/**
 * Embolden and colour any element with a class of `.error`.
 */
.error {
  color: red;
  font-weight: bold;
}

/**
 * If the element is a `div`, also give it some box-like styling.
 */
div.error {
  padding: 10px;
  border: 1px solid;
}
```

限定选择器违背了选择器的复用原则，于是有了准限定选择器，它用注释指明选择器的意图，从而避免修改选择器的名字。

```css
/*ul*/.nav { }
```

为了继续提高选择器的复用性，选择器命名应该在满足语义的前提下，带点模糊意味，概念上类似模板。使用选择器名来描述内容是多余的，因为内容本身就说明了自身。

比如 `.site-nav` 不如选择像 `.primary-nav` 这样的；与其使用 `.footer-links` ，不如选择像 `.sub-links` 这样的。

HTML 标签中模糊的类名，可以通过使用 `data-ui-component` 属性来整合。它的属性值应当准确而具体。

```html
<ul class="tabbed-nav" data-ui-component="Main Nav">
```

`data-ui-component` 属性可以是上面这种首字母大写，也可以是仿照类名风格的 `main-nav` 。

## 选择器权重

CSS 选择器权重等级（从高到低）：

1. 行内样式 `style="..."`
2. id 选择器 例如 `#header`
3. class/属性/伪类选择器
    - class 选择器 `.class`
    - 属性选择器 `[type="text"]`
    - 伪类 `:hover`, `:focus`
4. 元素/伪元素选择器
    - 元素选择器 `div`, `h2`, `p`
    - 伪元素 `::before`, `::after`

## 选择器性能

选择器的性能指标是，浏览器匹配你用 CSS 写下的选择器与在 DOM 中找到的节点的速度。

总的来说，选择器越长（即组成部分越多），速度就越慢，例如：`body.home div.header ul { }` 工作效率就不如 `.primary-nav { }` 。

浏览器匹配过程是**从右到左**。第一种情况下，浏览器要查找 DOM 中的所有 `ul` 元素，然后匹配 是否有位于某个 `header` 内的 ul 元素，接着检查 `div`、`home`、`body` ，最后筛选出符合条件的 `ui` 元素。第二种情况就比较简单，查找所有类名为 `.primary-nav` 的元素。

后代选择器（ descendant selector），例如 `.foo .bar {}` ，加剧了性能损耗：浏览器需要从选择器的最右边部分（即 `.bar` ）开始，并无限期地向上查找 DOM，直到找到下一部分（即 `.foo` ）。这可能意味着需要向上查找 DOM 多次，直到找到匹配项为止。

使用子选择器（child selector），例如 `.foo > .bar {}` ，我们可以大大提高效率，因为这只需要浏览器在 DOM 中向上查找一个级别，无论是否找到匹配项，它都会停止。

关键选择器，是位于最右边的选择器，也就是浏览器第一次匹配时用到的选择器。把关键选择器的范围限制得小一点。

话虽如此，CSS 选择器的性能应该排在你需要优化的事项列表的较低位置；浏览器速度很快，而且只会越来越快，只有在显著的边缘情况下，低效的选择器才有可能构成问题。

# CSS 定位

position 属性指定了元素的定位类型。

| 值          | 描述                                                                                    |
| ---------- | ------------------------------------------------------------------------------------- |
| `static`   | 默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。                       |
| `absolute` | 生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。  <br>元素的位置通过 left, top, right 以及 bottom 属性进行规定。 |
| `fixed`    | 生成绝对定位的元素，相对于浏览器窗口进行定位。  <br>元素的位置通过 left, top, right 以及 bottom 属性进行规定。               |
| `relative` | 生成相对定位的元素，相对于其正常位置进行定位。  <br>因此，"left:20" 会向元素的 LEFT 位置添加 20 像素。                      |

## 静态定位

不设置的时候的默认值就是static，静态定位，没有定位，元素出现在该出现的位置，**块级元素垂直排列，行内元素水平排列**。

```html
<head>
    <meta charset="UTF-8">
    <style>
        .innerDiv{
            width: 100px;
            height: 100px;
        }
        .d1{
            background-color: rgb(166, 247, 46);
            position: static;
        }
        .d2{
            background-color: rgb(79, 230, 124);
        }
        .d3{
            background-color: rgb(26, 165, 208);
        }
    </style>
</head>
<body>
    <div class="innerDiv d1">框1</div>
    <div class="innerDiv d2">框2</div>
    <div class="innerDiv d3">框3</div>
</body>
```

## 绝对定位 

absolute，通过 top left right bottom 指定元素在页面上的固定位置。**定位后元素会让出原来位置，其他元素可以占用**。

```html
<head>
    <meta charset="UTF-8">
    <style>
        .innerDiv{
            width: 100px;
            height: 100px;
        }
        .d1{
            background-color: rgb(166, 247, 46);
            position: absolute;
            left: 300px;
            top: 100px;
        }
        .d2{
            background-color: rgb(79, 230, 124);
        }
        .d3{
            background-color: rgb(26, 165, 208);
        }
    </style>
</head>
<body>
    <div class="innerDiv d1">框1</div>
    <div class="innerDiv d2">框2</div>
    <div class="innerDiv d3">框3</div>
</body>
```

## 固定定位

fixed 在浏览器窗口固定位置，不会随着页面的上下移动而移动，元素定位后会让出原来的位置，其他元素可以占用。

应用场景：

- 固定导航栏
- 返回顶部按钮
- 悬浮客服窗口
- 模态框（Modal）

![框1是固定定位|400x0](https://vip.123pan.cn/1844935313/obsidian/fixeddingwei.gif)

## 相对定位

relative 相对于自己原来的位置进行地位，定位后保留原来的站位，其他元素不会移动到该位置。

```html
<head>
    <meta charset="UTF-8">
    <style>
        .innerDiv{
            width: 100px;
            height: 100px;
        }
        .d1{
            background-color: rgb(166, 247, 46);
            position: relative;
            left: 30px;
            top: 30px;
        }
        .d2{
            background-color: rgb(79, 230, 124);
        }
        .d3{
            background-color: rgb(26, 165, 208);
        }
    </style>
</head>
<body>
    <div class="innerDiv d1">框1</div>
    <div class="innerDiv d2">框2</div>
    <div class="innerDiv d3">框3</div>
</body>

```

# CSS 盒子模型

CSS 盒子模型本质上是一个盒子，封装周围的HTML元素，它包括：

- Margin(外边距) 清除边框外的区域，外边距是透明的。
- Border(边框) 围绕在内边距和内容外的边框。
- Padding(内边距) 清除内容周围的区域，内边距是透明的。
- Content(内容) 盒子的内容，显示文本和图像。

![CSS盒子模型|500x0](https://vip.123pan.cn/1844935313/obsidian/20260418182034590.png)

# Sass

| 特性  | CSS          | Sass/SCSS                   |
| --- | ------------ | --------------------------- |
| 类型  | 标准的静态样式表语言   | CSS 预处理器                    |
| 功能  | 不支持变量、嵌套、混合等 | 支持变量、嵌套、混合、继承、函数等           |
| 语法  | 标准的CSS 语法    | 有两种：缩进式(.sass) 和大括号式(.scss) |
| 编译  | 无需编译，直接使用    | 需要编译成CSS 才能在浏览器中使用          |

Sass 提供了嵌套功能。

```scss
.foo {
  color: red;

  .bar {
    color: blue;
  }

}
```

上述 Sass 代码编译后得到 CSS 代码：

```css
.foo { color: red; }
.foo .bar { color: blue; }
```

Sass 注释有两种，一种是标准多行注释 (`/* ... */`)，另一种是单行注释 (`//`)。标准多行注释会保留在编译后的 CSS 文件中，单行注释会被完全移除。这一点需要注意，以免编译完发现注释都没了。

在生产环境中，上述两种注释都该被移除。~~所以反编译后没有一丁点注释的原因，不是程序员偷懒。~~

```scss
// Dimensions of the @2x image sprite:
$sprite-width:  920px;
$sprite-height: 212px;

/**
 * 1. Default icon size is 16px.
 * 2. Squash down the retina sprite to display at the correct size.
 */
.sprite {
  width:  16px; /* [1] */
  height: 16px; /* [1] */
  background-image: url(/img/sprites/main.png);
  background-size: ($sprite-width / 2 ) ($sprite-height / 2); /* [2] */
}
```

# 设计模式

- 无论何时构建 UI 组件，都尝试将其拆分成两部分：一部分用于结构化样式（内边距、布局等），另一部分用于外观（颜色、字体等）
- 单一职责原则，指出每个上下文（类、函数、变量等）都应只有一个职责，并且该职责应完全封装在该上下文中
- 开闭原则，指出软件实体（类、模块、函数等）应“对扩展开放，对修改关闭”
- DRY（Don't Repeat Yourself）。注意，只 DRY 真正相关、主题相关的代码。不要试图消除纯粹巧合的重复：重复比错误的抽象更好
- 组合优于继承
- SoC（Separation of Concerns）

开闭原则例子：

```css
.box {
  display: block;
  padding: 10px;
}

.box--large {
  padding: 20px;
}
```

DRY 原则例子：

```css
@mixin my-web-font() {
  font-family: "My Web Font", sans-serif;
  font-weight: bold;
}

.btn {
  display: inline-block;
  padding: 1em 2em;
  @include my-web-font();
}

[...]

.page-title {
  font-size: 3rem;
  line-height: 1.4;
  @include my-web-font();
}
```

在每个 CSS 项目的主要部分开头都加上标题：

```css
/*------------------------------------*\
  #FOO
\*------------------------------------*/

.foo { }

  .foo__bar { }


.foo--baz { }
/*------------------------------------*\
  #BAR
\*------------------------------------*/

.bar { }

  .bar__baz { }

  .bar__foo { }
```

以 `#` 为前缀，以便我们执行更有针对性的搜索，例如 `grep`  。与其只搜索 SECTION-TITLE （这可能会产生很多结果），不如搜索范围更广的 `#SECTION-TITLE` 。

```css
[selector] {
  [property]: [value];
  [<--declaration--->]
}
```

书写 CSS 选择器的规则：

- 相关的选择器在同一行；不相关的选择器在新行
- 每个声明独占一行
- 每个声明缩进两个空格
- 在最后一个声明后添加一个分号 `;` 
- 选择器之间有层次关系，也可以缩进次级选择器
- 尝试在声明中对齐常见的、相关的字符串
