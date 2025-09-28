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

题以 `#` 为前缀，以便我们执行更有针对性的搜索，例如 `grep`  。与其只搜索 SECTION-TITLE （这可能会产生很多结果），不如搜索范围更广的 `#SECTION-TITLE` 。

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

相比于在 CSS 文件中使用，命名约定在 HTML 中更能发挥作用。下面的代码中

```css
<div class="box  profile  pro-user">

  <img class="avatar  image" />

  <p class="bio">...</p>

</div>
```




（未完待续）

# 尾声

这个教程没怎么讲具体写 CSS 代码，我觉得也没必要，之后看别人的 Obsidian CSS 片段或者继续学习前端方面知识，肯定还会遇到具体的 CSS 代码，到时候再填充进文章里就行了。

不过倒是解答心中的一点疑惑：短的 CSS 代码还好，长一点又分成多个文件的 CSS 就大概看不明白了。原来是注释太少了。

感觉我博客下面的xx 入门都是我看一遍，然后摘抄一部分出来供自己回顾。没办法水平有限，知识不足，只能先攒点家底出来，没法像大佬那样肆意挥霍。
