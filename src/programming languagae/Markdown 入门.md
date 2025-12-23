---
title: Markdown 入门
date: 2025-10-24
tags:
  - Markdown
  - Obsidian
category:
  - 笔记软件
---
# 前言

<!--more-->

# 基本语法

## 1. 段落

在 Markdown 语法中，段落之间用一个空行隔开。使用多个空行隔绝段落的效果，等同于使用一个空行的情况。

确实需要段落之间有多个空行，那就要用 `&nbsp` 或 `<br>`。



## 1.1. 标题

一个`#`表示一级标题，最多可以达到六级标题

## 1.2. 强调和加粗

使用 `*` 或 `_` 来强调文本，使用两个 `*` 或 `_` 来加粗文本。例如，`*强调*` 会创建一个强调的文本，`**加粗**` 会创建一个加粗的文本。

```markdown
Italicized text is the *cat's meow*.
I just love **bold text**.
```

使用`***`或`___`给文本同时添加强调和加粗。

```markdown
This text is ***really important***.
```

## 1.3. 分割和删除

要创建分隔线，在单独一行上使用三个或多个星号 (`***`)、破折号 (`---`) 或下划线 (`___`) ，并且不能包含其他内容。

若要删除单词，请在单词前后使用两个波浪号 `~~`。结果看起来~~像这样~~。

## 1.4. 列表

使用 `*`、`-` 或 `+` 来创建无序列表，使用数字和 `.` 来创建有序列表。列表可以嵌套列表。

```markdown
1. First item
2. Third item
	1. Indented item
	2. Indented item
3. Fourth item
```

任务列表

- [x] White the press release
- [ ] Update the website
- [ ] Contact the media

## 1.5. 表格

使用 `|` 来创建表格。

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:------|:-------:|------:|
| 内容   | 内容    | 内容 |
```

| Syntax    | Description | Test Text   |
|:--------- |:-----------:| -----------:|
| Header    | Title       | Here's this |
| Paragraph | Text        | And more    |

## 1.6. 代码

使用反引号 `` ` `` 来插入行内代码，使用三个反引号` ``` `来插入代码块。例如，`` `代码` `` 会插入一个行内代码。

  ```shell
  sudo apt-get update
  ```

## 1.7. 引用

`>文本内容` 中间不需要空格

>Dorothy followed her through many of the beautiful rooms in her castle.

在要嵌套的段落前添加一个  `>>`  符号

>Dorothy followed her through many of the beautiful rooms in her castle.
> 
>>The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

## 1.8. 链接

使用 `[链接文本](链接地址)` 来创建链接。
这是一个链接[markdown语法](https://markdown.com.cn "最好的markdown教程")。

使用尖括号`<url链接>`可以很方便地把 URL 或者 email 地址变成可点击的链接。
<https://markdown.com.cn>

## 1.9. 图片

使用 `![图片alt](图片链接 "图片标题")` 来插入图片，图片标题不是必须的。

![鲨鱼猫.jpg](https://vip.123pan.cn/1844935313/obsidian/20250217223352530.png)

## 1.10. 脚注

使用 `[^脚注标识]` 来插入脚注，然后在文档的任何地方使用 `[^脚注标识]: 脚注内容` 来定义脚注。

Here's a simple footnote,[^1] and here's a longer one.[^bignote] 

[^1]: This is the first footnote.
[^bignote]: Here's one with multiple paragraphs and code.

## 1.11. emoj

[emoj cheatsheet](https://www.webfx.com/tools/emoji-cheat-sheet/)

去露营了！:tent:很快回来
真好笑！:joy:

## 1.12. latex

[Latex 数学公式编辑器](https://math.yish.org/)

 1. 行内公式：使用 `$...$` 来插入行内公式$E=mc^2$。
 2. 显示公式：使用 `$$...$$` 来插入显示公式$$E=mc^2$$
 3. ~~使用 LaTeX 的公式环境，如 `equation`、`align` 等。~~

# [Obsidian扩展](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/markdown/obsidian%E6%89%A9%E5%B1%95%E8%AF%AD%E6%B3%95/)

## 2.1. Callout

>[!tip]- nihao
>ha
>ha
>ha

## 2.2. 文件导出

想将 md 文件导出为 pdf 文件，可谓困难重重：

```shell
sudo apt install pandoc
# 安装 pdflatex
sudo apt install texlive-latex-base texlive-latex-extra texlive-fonts-recommended texlive-fonts-extra
```



