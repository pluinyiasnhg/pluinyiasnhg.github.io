---
title: CSS 入门
date:
tags:
  - CSS
category:
  - 编程语言
---
# 前言

学习 Harry Roberts 的 CSS 教程： [High-level advice and guidelines for writing sane, manageable, scalable CSS](https://cssguidelin.es/)。这个教程不仅仅是在讲 CSS 如何用，更是在讲 CSS 代码艺术。

<!-- more -->

# CSS 

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

注释和代码之间要一行隔开。紧密相关的 section 之间空一行；关联松散的 section 之间空两行；全新主题的 section 之间空五行。

```css
[selector] {
  [property]: [value];
  [<--declaration--->]
}
```

一些书写 CSS 选择器的规则：

- 相关的选择器在同一行；不相关的选择器在新行
- 每个声明独占一行
- 每个声明缩进两个空格
- 在最后一个声明后添加一个分号 `;` 
- 选择器之间有层次关系，也可以缩进次级选择器
- 尝试在声明中对齐常见的、相关的字符串

## CSS 覆盖

CSS 选择器权重等级（从高到低）：

1. **行内样式** `style="..."`
2. **ID 选择器** - 例如 `#header`
3. **类/属性/伪类选择器**
    - 类选择器 `.class`
    - 属性选择器 `[type="text"]`
    - 伪类 `:hover`, `:focus`
4. **元素/伪元素选择器**
    - 元素选择器 `div`, `h2`, `p`
    - 伪元素 `::before`, `::after`

优先级由选择器的类型决定，通常用一个三元组 `(a, b, c)` 来表示：

- **a**: ID 选择器的数量
- **b**: 类选择器、属性选择器、伪类的数量
- **c**: 元素选择器、伪元素的数量
- **通配符选择器(`*`)**、**组合器(`+`, `>`, `~`, )** 和 **否定伪类(`:not()`)** 本身不计入优先级，但 `:not()` 内部的参数会计入
- `!important` 是最高优先级，覆盖所有其他规则

比较规则：从左到右比较。先比较 a，a 大的优先级高；a 相同则比较 b，b 大的优先级高；以此类推。

更多例子：

| 选择器                   | 权重计算                | 优先级 (a,b,c) |
| --------------------- | ------------------- | ----------- |
| `div`                 | 1个元素                | (0,0,1)     |
| `ul > li`             | 2个元素                | (0,0,2)     |
| `.container`          | 1个类                 | (0,1,0)     |
| `#main-nav`           | 1个ID                | (1,0,0)     |
| `div.header`          | 1个元素 + 1个类          | (0,1,1)     |
| `input[type="text"]`  | 1个元素 + 1个属性         | (0,1,1)     |
| `ul#menu li.active a` | 1个ID + 1个类 + 3个元素   | (1,1,3)     |
| `:not(#main) .item`   | 1个ID (在:not里) + 1个类 | (1,1,0)     |

## Sass

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

## 命名约定

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

## 选择器性能

性能指标是，浏览器匹配你用 CSS 写下的选择器与在 DOM 中找到的节点的速度。

总的来说，选择器越长（即组成部分越多），速度就越慢，例如：`body.home div.header ul { }` 工作效率不如 `.primary-nav { }` 。

浏览器匹配过程是**从右到左**。第一种情况下，浏览器要查找 DOM 中的所有 `ul` 元素，然后匹配 是否有位于某个 `header` 内的 ul 元素，接着检查 `div`、`home`、`body` ，最后筛选出符合条件的 `ui` 元素。第二种情况就比较简单，查找所有类名为 `.primary-nav` 的元素。

后代选择器（ descendant selector），例如 `.foo .bar {}` ，加剧了性能损耗：浏览器需要从选择器的最右边部分（即 `.bar` ）开始，并无限期地向上查找 DOM，直到找到下一部分（即 `.foo` ）。这可能意味着需要向上查找 DOM 多次，直到找到匹配项为止。

使用子选择器（child selector），例如 `.foo > .bar {}` ，我们可以大大提高效率，因为这只需要浏览器在 DOM 中向上查找一个级别，无论是否找到匹配项，它都会停止。

关键选择器，是位于最右边的选择器，也就是浏览器第一次匹配时用到的选择器。把关键选择器的范围限制得小一点。

话虽如此，CSS 选择器的性能应该排在你需要优化的事项列表的较低位置；浏览器速度很快，而且只会越来越快，只有在显著的边缘情况下，低效的选择器才有可能构成问题。

## 设计模式

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

# 尾声

这个教程没怎么讲具体写 CSS 代码，我觉得也没必要，之后看别人的 Obsidian CSS 片段或者继续学习前端方面知识，肯定还会遇到具体的 CSS 代码，到时候再填充进文章里就行了。

不过倒是解答心中的一点疑惑：短的 CSS 代码还好，长一点又分成多个文件的 CSS 就大概看不明白了。原来是注释太少了。

之前学习 Obsidian 使用时，也想过用别人的 CSS 代码对 ob 进行美化，但感觉容易起冲突，于是就因噎废食，选了一套现成的主题就一直用着。

感觉我博客下面的xx 入门都是我看一遍，然后摘抄一部分出来供自己回顾。没办法水平有限，知识不足，只能先攒点家底出来，没法像大佬那样肆意挥霍。
