---
title: Emacs 入门(1)
date: 2025-09-18
tags:
  - 编辑器
  - Emacs
category:
  - 代码效率
---
# 前言

学习 Emacs 内置文档 Emacs tutorial ，结合在线文档 [A Guided Tour of Emacs](https://www.gnu.org/software/emacs/tour/index.html)。

<!-- more -->

一直想学习 Emacs，但是苦于无法入门。有看过一步步配置出自己的 Emacs 的教程，包括博客教程和视频教程，但学着很不得劲。最后的水平也就记住了退出和保存的快捷键 `C-x C-c` 和 `C-x C-s` 。

# Emacs tutorial

我不喜欢 Emacs 的图形化界面，感觉像十年前的前端样式，“不是我喜欢的 Emacs ，直接拒绝”。在终端中输入 `emacs -nw` ，emacs 就在终端中启动了。

先过一遍 Emacs 内置的快速指南，快捷键是 `C-h t` 。如果像我一样不习惯阅读英文，用命令 `M-x help-with-tutorial-spec-language`，选择一份中文文档进行学习。这里的 `M` 是 Meta 键，通常是键盘上的 `Alt` 。

![Emacs 快速指南|750x0](https://vip.123pan.cn/1844935313/obsidian/20250918084530894.png)

一些概念：

- 回显区：屏幕最下面一行，用于显示输入的命令
- 状态栏：回显区正上方的一行，显示 Emacs 的状态和你正在编辑的文字的一些信息
- 缓冲区（buffer）：为了方便理解，可以简单看作文件（file）
- 注意，Emacs 中 window 指代的是本文提到的窗格，frame 指代的是本文提到的窗口，阅读官方文档要注意区分
- point 是“逻辑游标”，cursor 是“视觉光标”。在多数情况下，用户感知到的是 cursor，而实际编辑操作基于 point
- `yank` 翻译为“召回”，可以简单看作复制粘贴的粘贴
- 注意，快捷键 `<DEL>` 指的是退格键 Backspace，而不是 Delete 键

## 移动光标

我的习惯是，Emacs 的上下左右移动快捷键要学，因为之前 Vim 的中英文切换让我十分狼狈，以至于养成了“每次输入完中文都会主动切换回英文”的习惯。

简而言之就是利用 Vim 的模式，插入模式用 Emacs 进行光标移动，普通模式下则用 Vim 移动。

- `C-p` (previous-line)：上移 
- `C-n` (next-line)：下移
- `C-b` (backward-char)：左移
- `C-f` (forward-char)：右移
- `C-a` (move-beginning-of-line)：可以将光标移动到“一行”的头部
- `C-e` (evil-scroll-line-down)：可以将光标移动到“一行”的尾部

Meta 系列组合键用来操作“由语言定义的单位（比如词、句子、段落）”，而 Ctrl 系列组合键用来操作“与语言无关的基本单位（比如字符、行等等）”。比较奇怪的是，我用 `C-h c` 查询 `M-p` `M-n` 时，回显区显示这两个快捷键未定义。但实际上这两个键在 Emacs 中能用。

- `M-p` (Previous **sentence**)：上一句 
- `M-n` (Next **sentence**)：下一句
- `M-b` (backward-**word**)：左移一词
- `M-f` (forward-**word**)：右移一词
- `M-a` (c-beginning-of-statement)：将光标移动到“一句”的头部
- `M-e` (c-end-of-statement)：将光标移动到“一句”的尾部

接下来的前移后移和居中，适合浏览代码：

- `C-v` (scroll-up-command)：后移一屏
- `M-v` (scroll-down-command)：前移一屏
- `C-l` (recenter-top-bottom)：光标所在行居中。多按几次，就是“中-上-下”循环
- `M-<` (beginning-of-buffer)：等同 Vim 中的 `gg`
- `M->` (end-of-buffer)：等同 Vim 中的 `G`

前缀 `C-u` (universal-argument) + 数字 + 移动命令，可以起到重复执行指定次数的移动命令。`M-[digit]` 是 `C-u [digit]` 的缩写。不过我电脑上已经占用了 `M-1` `M-2` `M-3` 这三个快捷键，所以就用不上了。

- `C-u 3 C-p` 上移3行距离
- `C-u 10 C-f` 右移10个字符距离
- `C-u C-n` 下移`4`行距离。`C-u` 不显式指定数字时，隐式指定数字4，用于不确定要移动多远距离时

### 大小写变换

- `M-u` (upcase-word)：将当前单词变成大写，并且光标移动到下一个单词末尾
- `M-l` (downcase-word)：将当前单词变成小写，并且光标移动到下一个单词末尾
- `M-c` (capitalize-word)：将当前单词首字母变成大写，并且光标移动到下一个单词末尾

### 交换位置

- `M-t` (transpose-words)：交换光标左右两侧的单词
- `C-t` (transpose-chars)：交换光标左右两侧的字符

## 搜索

### 增量搜索

在缓冲区中进行搜索，可以看作是另一种光标移动操作。

- `C-s` (isearch-forward)：向前增量搜索 
- `C-r` (isearch-backward)：向后增量搜索

以向前搜索为例，`C-s` 后接想找的字符串，匹配到结果后，继续按 `C-s` ，光标会跳转到下一个匹配的字符串。此时，按 `C-g` ，光标返回初始位置；按 `<return>` ，光标停留在匹配字符串，此时用 `C-x C-x` 也能让光标返回初始位置。

- `C-s C-s` ：复用最近一次搜索用到的字符串。比如退出搜索后发现匹配的位置不对，此时可以用该快捷键，而不用重新输入字符串搜索
- `C-s M-p` ：选中搜索历史记录中上一条记录
- `C-s M-n` ：选中搜索历史记录中下一条记录
- `C-h k C-s` ：更多增量搜索相关的命令

### 查询替换

查询替换命令 `M-%` (query-replace) 会提示输入一个搜索字符串和一个替换内容。然后，对于缓冲区中的每个匹配项，可以选择是否替换搜索字符串。以下是每个提示下可用的选项：

- 输入 `y` 来替换当前匹配项。
- 输入 `n` 来跳到下一个匹配项而不替换。
- 输入 `q` 来退出而不进行任何其他替换。
- 输入 `.` 来替换此匹配项，然后退出。
- 输入 `!` 来不再询问地替换所有剩余匹配项。

### 正则表达式搜索

正则表达式是一种简洁的方式，可以通过使用一种特殊的语言来描述你要查找的内容的形式，从而一次性搜索许多不同的字符串。快捷键 `C-M-s` (isearch-forward-regexp) 用于正则表达式搜索。

如果你是正则表达式的新手，或者你正在构建一个特别复杂的正则表达式，你可以使用正则表达式构建器 `M-x re-builder` 。这个命令会弹出一个单独的窗口，你可以在其中测试你的正则表达式，并且在你编辑正则表达式时，原始缓冲区中的任何匹配项都会被突出显示。

与其逐个匹配，你也可以选择一次性显示所有匹配项。`M-x occur` 会提示输入正则表达式，然后在单独的缓冲区中显示当前缓冲区中所有匹配该正则表达式的行（以及它们的行号）。点击任何匹配项都会带你到缓冲区中的该行。

## 标记

标记（Mark）的作用是方便跳转回标记所在的位置。具体来说，`C-SPC` (set-mark-command) 标记当前行，继续浏览代码，如果某个时刻想要回来标记行，使用 `C-x C-x` (exchange-point-and-mark)。多次使用该快捷键，可以在标记行和“某个时刻所在的行”之间来回跳转。

标记的概念在 Emacs 中有强烈的体现：

| 当你……                        | 标记设置在……  |
| --------------------------- | -------- |
| 输入 `C-SPC`                  | 当前所在位置   |
| 跳转到缓冲区头部或尾部 (`M-<` 或 `M->`) | 跳转前的位置   |
| 退出增量搜索                      | 搜索前的位置   |
| 召回文本                        | 召回区域的开始处 |
| Insert a buffer or file     | 插入文本的开始处 |

多次使用标记会在 Emacs 内部形成一个环，环中最多保留16个标记。在这16个标记中，通过 `C-u C-SPC` 进行跳转。

## 区域

标记还有另一个作用：标记和点一起界定区域（Region）。

- `C-x h` (mark-whole-buffer)：选中当前缓冲区
- `M-h` (mark-paragraph)：选中当前段落

在区域的配合下， Narrowing 限制缓冲区（以及编辑）的视图到一个特定区域。像增量搜索和跳转到缓冲区头部/尾部这些命令，也会随之限制在这个特定区域。Narrowing 适用于只想修改某个区域，不想影响到区域以外的缓冲区。

- `C-x n n` (narrow-to-region)：视图从缓冲区到指定区域
- `C-x n w` (widen)：视图从指定区域返回缓冲区

## 取消命令

命令输入一半，输错了或者不想用了，可以用 `C-g` (keyboard-quit)中断。特别的，`ESC` + `C-g` 会显示组合键未定义，建议多按两次 `ESC` 取消。

## 删除移除

- `<DEL>` (c-electric-backspace)：等同日常生活中的 Backspace 键
- `C-d` (c-electric-delete-forward)：等同日常生活中的 Delete 键
- `M-<DEL>` (clean-aindent-bsunident)：移除光标前一词 
- `M-d` (kill-word)：移除光标后一词
- `C-k` (kill-line)：移除从光标到“行尾”间的字符 
- `M-k` (kill-sentence)：移除从光标到“句尾”间的字符

删除是 delete，移除是 kill。区别在于：被 kill 的文本被 Emacs 记录下来，后续可以重新插入被移除的文本，类似平时用的剪贴功能，Emacs 称之为 yank。

只消除一个字符或者只消除空白的命令，无法用 `C-y` 插入被移除的字符或空白，比如 `<DEL>` 和 `C-d` 。但这也不是绝对的，这两条命令有前缀参数 `C-u` 时，就变成了”移除“命令。

- `C-y` (yank)：召回最近一次移除的内容
- `M-y` (yank-pop)：召回再前一次被移除的内容，再按一次 `M-y` 又可以召回再上一次的内容……连续使用 `M-y` 会回到起始点

## 撤销

`C-x u`、`C-/` 和 `C-_` 都是撤销一条命令，不包括没有改变文字的命令，比如光标移动和滚动。

撤销（undo）可以恢复删除和移除的文本。移除文本+召回（yank）效果等同“剪贴”。

## 键盘宏

键盘宏是一种记住固定按键序列以便后续重复使用的方法。它们对于自动化一些枯燥的编辑任务很有用。

- `F3` (kmacro-start-macro-or-insert-counter)：开始录制宏
- `F4` (kmacro-end-or-call-macro)：停止录制宏，或者播放宏一次
- `M-5 F4` ：播放宏5次
- `M-0 F4` ：反复播放宏直到它失败

## 文件

- `C-x C-f` (helm-find-files)：打开文件。若打开一个不存在的文件，则等同于创建一个新文件
- `C-x C-s` (save-buffer)：保存文件（当前缓冲区）。保存文件时，Emacs 会为文件备份

关闭备份的方法：`M-x customize-variable <Return> make-backup-files <Return>` 。

## 缓冲区

- `C-x C-b` (list-buffers)：列出缓冲区，仅能查看
- `C-x b` (helm-list-buffers)：列出缓冲区，可以切换
- `C-x s` (save-some-buffers)：保存所有缓冲区（所有文件）

每个已打开的文件都是一个缓冲区。因此切换缓冲区，等同于打开一个已经打开的文件。

## 窗格

- `C-x 0` (delete-window)：删除窗格
- `C-x 1` (maximize-window)：只保留光标所在的窗格
- `C-x 2` (split-window-below)：向下分割出窗格
- `C-x 3` (split-window-right)：向右分割出窗格
- `C-x o` (other-window)：切换窗格

不管是向下分，还是向右分，光标还是位于原来的窗格。切换窗格时，多按几次 C-x o，就能循环遍历所有窗格。

光标可以不切换到新窗格，就能在新窗格中滚动页面。当前窗格滚动快捷键是 `C-v` 和 `M-v` ，新窗格是 `C-M-v` (scroll-other-window) 和 `C-M-S-v` 。这两个快捷键很重要，平时翻阅帮助文档时候，就是创建一个新窗格，在新窗格内查看文档。

与窗口的区别：终端中的 Emacs 只有一个窗口，即当前的终端窗口；GUI 界面的 Emacs 可以创建多个窗口。每个窗口有单独的菜单栏、滚动条，就像平时的应用多开。

## 主模式

主模式用于根据缓冲区的内容自定义外观和可用功能。Emacs自带了数十种主要模式，用于编辑常用编程语言、标记语言和配置文件格式。这些主要模式告诉Emacs如何：

- 正确缩进代码
- 进行语法高亮
- 区分函数边界
- 调用代码要求的解释器，编译器或调试器

## 副模式

副模式不像主模式只能有一个（在一个缓冲区中），可以同时开启多个副模式。一般每个副模式代表一个附加功能，比如语法检查（flymake）和自动补全（company）。

- `M-x auto-fill-mode` ：一行超过70个字符，则自动换行
- `M-x flyspell-mode` ：高亮拼错的单词
- `M-x follow-mode` ：在两个并排显示的窗口共用一个缓冲区时，跟随模式会强制它们一起滚动，使得第二个窗口中显示的文本紧跟在第一个窗口中的文本之后

一些副模式的影响范围是全局的，即不局限于某个缓冲区，是针对整个编辑器的，如：

- `M-x incomplete-mode` ：随着输入，显示补全
- `M-x iswitchb-mode` ：用 `C-x b` 切换缓冲区时，会显示所有缓冲区的名字

`C-h m` 描述了已激活的主模式和副模式，通常会列出在该模式下有用的重要命令，这在学习使用新模式时非常有帮助。

## 快捷键拓展

Emacs 的命令就像天上的星星，数也数不清。把它们都对应到 Ctrl 和 Meta 组合键上显然是不可能的。Emacs 用扩展命令来解决这个问题，扩展命令有两种风格：

- `C-x` ：字符扩展。 `C-x` 之后输入另一个字符或者组合键
- `M-x` ：命令名扩展。 `M-x` 之后输入一个命令名

## 挂起 Emacs

如果需要临时从 Emacs 回到终端，可以不用保存和退出，选择挂起 Emacs：

- `C-z` (suspend-frame)：挂起 Emacs
- 返回 Emacs：`fg` 或 `%emacs`

## 自动保存

Emacs 会定期将正在编辑的文件写入一个“自动保存”文件中。自动保存文件的文件名的头尾各有一个“#”字符，比如正在编辑的文件叫“hello.c”，那么它的自动保存文件就叫“#hello.c#”。这个文件会在正常存盘之后被 Emacs 删除。

打开原来的文件（注意不是自动保存文件）然后输入 `M-x recover file` 来恢复自动保存文件。

## 递归编辑

递归编辑状态由位于状态栏的方括号所指示，其中包含了用小括号来指明的模式名称。比如说，你有时可能会看到 `[(Fundamental)]`，而不是 `(Fundamental)` 。

不能用 `C-g` 退出递归编辑，而应该用 `ESC ESC ESC` 。这条命令还可以关闭多余的窗格。

## 帮助文档

- `C-h k` (describle-key)：查看快捷键。在下方窗格中显示命令的完整文档
- `C-h c` (describle-key-briefly)：查看快捷键。在状态栏显示命令的简要说明
- `C-h f` (describle-function)：查看函数
- `C-h v` (describe-variable)：查看 Emacs 变量
- `C-h x` (describe-command)：解释一个命令
- `C-h a` (apropos-command)：**相关命令搜索**，即 Emacs 根据输入的关键词，罗列出所有包含关键词的命令
- `C-h m` (describe-mode)：查看当前缓冲区的主模式、副模式
- `C-h r` (info-emacs-manual)：继续学习 Emacs 的权威指南 [GNU Emacs Manual](https://www.gnu.org/software/emacs/manual/emacs.html)
- `C-h i` (info)：一些 Emacs 功能有自己的、独立的手册 (`C-h i d`)
- `C-h ?` (help-for-help)：info 的使用指南

`C-h c` 和 `C-h k` 根据快捷键确定；`C-h x` 根据命令名确定。

## 软件仓库

`M-x list-packages` 可浏览所有可安装的软件包。这个命令显示的界面中可以安装和卸载软件包，以及查看软件包的简介。

## 版本控制

Emacs 帮助您操作和编辑存储在版本控制中的文件。Emacs 支持 CVS、Subversion、bzr、git、hg以及其他系统，但它提供了一个统一的接口，称为 VC。

- `C-x v v` (vc-next-action)：提交当前文件，并给出日志信息
- `C-x v =` (vc-diff)：显示当前文件所做的更改的差异
- `C-x v ~` (vc-revision-other-window)：提示输入版本号，并在另一个窗口中显示当前文件的该版本
- `C-x v g` (vc-annotate)：显示文件的注释版本，其中每行显示该行最后一次更改的提交记录和更改者。在任何一行上，`L` 查看该提交的日志消息，`D` 查看相关的差异
- `C-x v l` (vc-print-log)：显示文件先前更改的日志。当光标位于特定日志条目上时，按 `d` 查看与此更改相关的 diff ，按 `f` 查看该文件的版本

## 编辑远程文件

利用 Emacs 的 Tramp 功能，无须在远程安装 Emacs，在本地的 Emacs 上就能编辑远程文件，仿佛远程文件就在本地一样。本地的 Emacs 通过 SSH、FTP 等方式获取到远程文件，并在远程保存更改。

## Emacs 服务器

通过 Emacs 打开一个文件，新打开的窗口通常需要重新加载一遍配置，这十分不方便。如果此时已经有一个 Emacs 实例，那么可以用 `emacsclient` 将新打开的窗口连接到该实例上。

## 与常用工具集成

- `M-x shell` ：切换到名为 `*shell*` 的 shell 缓冲区，若不存在，则创建并切换过去
- `M-x compile` ：调用 `make` 并在新缓冲区中显示输出
- `M-x gdb` ：在一个新缓冲区中调用 `gdb`
- `M-x man` ：等同于在 shell 中查看 man 文档，比如 `man unzip` 
- `M-x calendar` ：打开日历
- `M-x calculator` ：打开计算器
- `M-x lunar-phases` ：显示即将到来的月相

## 迁移到 Emacs

在 Windows 中，核心编辑命令是 `C-z`、`C-x`、`C-c` 和 `C-v`。不幸的是，这些键在 Emacs 中经常用于其他目的（挂起、前缀键、前缀键和翻页）。在选项菜单中打开“CUA 模式”，可以将这些键恢复为撤销、剪切、复制和粘贴。

对于 Vim 用户，Viper (`M-x viper-mode`) 是一组在 Emacs 中模拟 vim 编辑行为的模式。它提供了不同级别的 vim 兼容性，具体取决于你希望你的 Emacs 有多像 vim。

# 尾声

把 Emacs 内置的快速指南过了一遍，GNU Emacs 官网上的文档没来得及看。接下来我要去看看 Emacs 的一款主题 Spacemacs。
