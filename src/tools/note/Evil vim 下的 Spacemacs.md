---
title: Evil vim 下的 Spacemacs
date: 2025-09-21
tags:
  - 编辑器
  - Emacs
category:
  - 代码效率
isOriginal: "true"
---
# 前言

Evil 是一个强大的 Vim 模拟，可以让 Vim 用户更容易过渡到 Emacs 使用上。从我个人使用体验来看，Vim 的模式设计十分好用，快捷键也更加精简，比如 `h、j、k、l` 移动方式怎么看都要比 `C-b C-p C-n C-f` 好使。能把 Vim 知识迁移过来重复利用，也是一方面原因。

<!-- more -->

# Evil vim 文档

![附送一张 Vim 键盘图 | 700x0](https://vip.123pan.cn/1844935313/obsidian/20250922090103771.png)

## 按键风格

`C-z` 控制 Spacemacs 两种按键风格的切换。比如在 Vim 风格键位中可以用 `<ESC>` 回到普通模式，但在 Emacs 风格键位中，`<ESC>` 做不到模式切换。

Evil vim 普通模式下，除了继承了 Vim 中的上下左右、前移一屏、后移一屏，还保留了 Emacs 中我喜欢用的 `C-l` ，效果是将光标所在行居中、居于最上、居于最下。虽然 Vim 的 `zz` 也可以实现居中，但功能还是少了点。

## 相反动作

圆满了，找到 `e` 的“反义词”了——其他反义词也顺手记录下：

- `w` ：至单词末尾（反向动作： `b` ）
- `e` ：至单词末位字符（反向动作： `ge` ）
- `$` ：至行尾（反向动作： `0` 或 `^` ） 
- `ce` ：更改一个单词的部分
- `p` ：这会将被删除的文本放置（put）在光标之后，若被删的是某一行，它会出现在光标的下一行（反向动作：`P` ）
- `/` ：向下搜索（反向动作：`?` ）
- `f` ：行内向前搜索（反向动作：`F` )
- `t` ：同 f ，但移动位置总是离目标差一个字符（反向动作：`T` ）

Evi 默认为全小写的搜索忽略大小写。如果需要大小写敏感，可在末尾加 `\C` 。

## 批量替换

- `:s/old/new` ：替换**行内第一个**匹配对象
- `:s/old/new/g` ：替换**行内全局**（global）范围的对象
- `:#,#s/old/new/g` ：替换**两行之间**的所有匹配对象
- `:%s/old/new/g` ：替换**整个缓冲区**的所有匹配对象
- `:%s/old/new/gc` ：为了每次询问是否确认，添加 `c`

## : 开头命令 

- `:!` ：执行一个外部命令
- `:w` ：保存旧文件/新建新文件
- `:e` ：打开文件
- `:bd!` ：删除当前缓冲区

用 v 进入可视状态后，选中指定区域，再输入 :w FILENAME 可将此区域保存到文件 FILENAME 中。　

`:r FILENAME` 取回磁盘文件 FILENAME 并将其插入当前缓冲区的光标位置之后，r 是 retrieve。

## 大写字母

- `A` ：在**行尾插入**
- `R` ：Vim 的替换状态，**连续替换**从光标开始的字符

## 复制

- `yy` ：复制一行
- `yw` ：**复制一个单词**

# Vim user 文档

原文链接：[戳这](https://www.spacemacs.org/doc/VIMUSERS.html)。该文档用于为 Vim 用户更好理解 Emacs 的各种概念。

## 正如 Vim

正如 Vim 有各种编辑模式，Spacemacs 用状态来区分不同文件和启用不同功能。一个 major-mode 对应一个文件类型，故一个缓冲区只能有一个 major-mode。要丰富该缓冲区的功能，就要用到各种 minor-mode。

正如 Vim 有各种插件可供安装，Emacs 使用 layer 。相比于 Vim 插件是一个个软件包，Emacs 的 layer 更像是整合包，里面有一组与 layer 关系密切的软件包。当然，Emacs 也提供像 Vim 一样安装单个软件包。

正如 Vim 有缓冲区，Emacs 也有，并且与缓冲区相关的快捷键都以 `<SPC> b` 为前缀：

- `<SPC> b b` ：打开缓冲区列表
- `<SPC> b n` / `:bnext` ：切换到下个缓冲区，n 是 next
- `<SPC> b p` / `:bprevious` ：切换到上个缓冲区，p 是 previous
- `<SPC> b d` / `:bdelete` ：关闭当前缓冲区，d 是 delete
- `<SPC> b C-d` ：关闭除当前缓冲区外的所有缓冲区

正如 Vim 有分屏，Emacs 也有类似的概念：窗格。与窗格相关的快捷键都以 `<SPC> w` 为前缀：

- `<SPC> w v` / `:vsplit` ：向右分屏
- `<SPC> w s` / `:split` ：向下分屏
- `<SPC> w h/j/k/l` ：光标在窗格之间移动
- `<SPC> w H/J/K/L` ：移动窗格

## 帮助文档

| 按键绑定            | 功能               |
| --------------- | ---------------- |
| `<SPC> h d f`   | 查看函数             |
| `<SPC> h d k`   | 查看按键绑定           |
| `<SPC> h d v`   | 查看变量             |
| `<SPC> h <SPC>` | 列出所有 layer 文档    |
| `<SPC> <f1>`    | 搜索命令、函数、变量并显示其文档 |
| `<SPC> ?`       | 列出所有按键绑定         |

`<SPC> h <SPC>` 这个快捷键可以查看 Spacemacs 官网上几乎所有的文档，实现使用过程中随时查阅的效果，不用离开 Emacs。

## Emacs 正则表达式

在正则表达式方面，Emacs 和 Vim 区别很大，以至于有人做了个工具，用于两种正则表达式互相转换，比如 [pcre2el](https://github.com/joddie/pcre2el)。

## Emacs Lisp

### 设置变量 

`(setq variable value)`

```elisp
(setq variable1 t ; True
      variable2 nil ; False
      variable3 '("A" "list" "of" "things"))
```

### 绑定快捷键

`(define-key map new-keybinding function)` ：

```elisp
;; Map H to go to the previous buffer in normal mode
(define-key evil-normal-state-map (kbd "H") 'previous-buffer)
```

要映射 `<Leader>` 快捷键绑定，使用 spacemacs/set-leader-keys 函数 `(spacemacs/set-leader-keys key function)` ：

```elisp
;; Map killing a buffer to <Leader> b c
(spacemacs/set-leader-keys "bc" 'kill-current-buffer)

;; Map opening a link to <Leader> o l only in org-mode (works for any major-mode)
(spacemacs/set-leader-keys-for-major-mode 'org-mode
  "ol" 'org-open-at-point)
```

将按键绑定到宏上：

```elisp
;; 等同于 nmap <S-Enter> O<Esc>j
(define-key evil-normal-state-map (kbd "S-<return>") (kbd "O <escape> j"))
```

### 定义函数

```elisp
(defun func-name (arg1 arg2)
  "docstring"
  ;; Body
  )

;; Calling a function
(func-name arg1 arg2)
```

### 软件包

在 `dotspacemacs/layers` 函数中：

- 变量 `dotspacemacs-additional-packages` 负责安装软件包
- 变量 `dotspacemacs-excluded-packages` 负责卸载软件包
- 变量 `dotspacemacs-configuration-layers` 负责激活 layer

有关如何创建自己的 layer，这需要单独拿出来讲。~~我暂时不会~~

Spacemacs 使用 `use-package` 管理包的加载：

```elisp
;; use-package 模板
;; :defer t 表示延迟加载包
(use-package package-name
  :defer t)
;; 加载顺序是，:init -> the package -> :config 
(use-package package-name
  :defer t
  :init
  ;; 设置变量
  (setq variable1 t variable2 nil)
  ;; 定义函数
  (defun foo ()
    (message "%s" "Hello, World!"))
  :config
  ;; Calling a function that is defined when the package loads
  (function-defined-when-package-loads))
```

## 常用调整

### 自动恢复上次会话

Spacemacs 在重新打开时不会自动恢复窗口和缓冲区。如果经常使用 Vim 会话，可以将 `dotspacemacs-auto-resume-layouts` 设置为 `t` 。

### 使用可视行进行导航

Spacemacs 使用 Vim 的默认设置，按实际行进行导航，即使这些行已被折行。若希望 `j` 和 `k` 的行为类似于 `g j` 和 `g k` ，请添加以下内容：

```elisp
(define-key evil-normal-state-map (kbd "j") 'evil-next-visual-line)
(define-key evil-normal-state-map (kbd "k") 'evil-previous-visual-line)
```

# 尾声

接下来是更完整的 [Spacemacs documentation](https://www.spacemacs.org/doc/DOCUMENTATION.html)，Vim user 文档终究只是用来过渡的。
