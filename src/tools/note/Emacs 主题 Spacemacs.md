---
title: Emacs 主题 Spacemacs
date: 2025-09-20
tags:
  - 编辑器
  - Emacs
category:
  - 代码效率
isOriginal: "true"
---
# 前言

把 Spacemacs 称为主题，完全是我的个人看法。原生的 Emacs 同样可以安装各种插件，实现 Spacemacs 的所有功能。但是插件不是动动小手下载下来就能用的，需要进行配置。而这就是 Spacemacs 的可贵之处。

有一个我在用的 Obsidian 插件，叫做 Spacekeys。该插件用于管理快捷键，插件的灵感来源就是 Spacemacs。这是我和 Spacemacs 最初的渊源。

<!-- more -->

# 安装主题

因为事先已经安装过 Emacs，所以我首先把 Emacs 的配置文件 `~/.emacs.d` 删除了。除了简单粗暴的删除，也可以重命名备份一下。只不过我完全没有这种打算。

Spacemacs 为进行过配置的 Emacs 用户提供了继承之前配置的选择，具体参考 [full installation](https://github.com/syl20bnr/spacemacs?tab=readme-ov-file#install)。

接着就是下载 Spacemac ：

```zsh
git clone https://github.com/syl20bnr/spacemacs $HOME/.emacs.d
```

Spacemacs 需要一些前置软件才能发挥所有功能：

- ~~Emacs、git~~，能下载和打开 Spacemacs 说明两者肯定已经安装到位了
- Tar，安装和更新 Emacs 包所必需的
- [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro)，建议安装该字体，不然有警告
- [ripgrep](https://github.com/BurntSushi/ripgrep)，搜索工具

如果你像我一样选择在终端输入 `emacs -nw` 启动，状态栏可能显示不出来。这时候输入 `C-x b` 打开缓冲区 `*Messages*` ，查看启动以来的日志，找到错误信息：

```zsh
(Spacemacs) Error in dotspacemacs/init: Variable: "dotspacemacs-search-tools" has value: "(rg ag pt ack grep)" that doesn’t match its type\
: "(set (const rg) (const ag) (const ack) (const grep))". Validator message: "(user-error Looking for `(set (const "rg") (const "ag") (con\
st "ack") (const "grep"))' in `("pt")' failed because:                                                                                     
  the following values don't match any of the options:                                                                                     
    pt)" 
```

如果是用快捷方式 Emacs（Termial）启动，状态栏就显示正常。很奇怪。

解决方法是，打开 `~/.spacemacs.d/init.el` ，找到 dotspacemacs-search-tools ，把搜索工具 pt 删除。看注释的意思是，会优先选前面的搜索工具，如果没安装，就选下一个，理论上安装了 rg ，即 ripgrep 就不该报错。

# 阅读 init.el

Spacemacs 接管了 `~/.emacs.d` ，我们不需要关心这个文件夹下面是怎样的——Spacemacs 为用户配置提供了 `~/.spacemacs.d` 文件夹。初次安装，只有一个 init.el 文件。

init.el 源代码有着丰富的注释，在开始正式攻略 Spacemacs 官方文档前，先耐心的翻看一遍，我会挑选一些设置进行记录。

init.el 的代码结构是由6个函数组成：

- dotspacemacs/layers：启用/禁用 layer 和软件包
- dotspacemacs/init：在 Emacs 启动时加载，用于配置 Spacemacs
- dotspacemacs/user-env：加载环境变量
- dotspacemacs/user-init：初始化加载软件包所需的变量
- dotspacemacs/user-config：用于添加个人的自定义配置、键绑定、函数定义等
- dotspacemacs/emacs-custom-settings：Spacemacs 自动生成，用户不能改动

user-env 函数默认加载 `~/.spacemacs.env` 文件，该文件下有各种 shell 中的环境变量，比如 conda 路径、Java jdk、shell 类型、proxy 地址等等。

函数的调用顺序为：init -> user-init -> layers -> user-config -> emacs-custom-settings。

主要查看前两个函数，user-env 没什么好看的，user-init 和 user-config 是用户自定义区域，初始为空。最后一个函数，是我在软件仓库（快捷键 `M-x list-packages` ）安装软件包时候，自动生成的。通过软件仓库安装的包，会被 .spacemacs.d 覆盖，所以看上去是装上了，实则没有，要在 `.spacemacs.d/init.el` 的 `additional-packages` 中添加包名。

## layers 函数

> layer 是 Spacemacs 提供的一个抽象。Spacemacs 把一组功能联系紧密的插件放到一起，然后帮你配置好它的各种烦碎细节，给你提供总体上的某个功能。 
> 
> 比如说，auto-completion 层提供自动补全功能，org 层给你 org-mode 的良好使用体验，C/C++层能让你迅速把 Emacs 变成 C/C++的 IDE 等等。

- enable-lazy-installation：延迟安装 layer
- ask-for-lazy-installation：延迟安装某个 layer 前 Spacemacs 会请求确认
- configuration-layer-path：加载其他路径下文件里的 layer
- **configuration-layers**：需要加载的 layer
- **additional-packages**：安装不在 layer 中的、额外的软件包
- forzen-packages：设置某些包不更新
- excluded-packages：不安装、不加载某些包
- install-packages：设置安装包的逻辑

install-packages 有三个选项：used-only、used-but-keep-unused、all。选项的区别在于如何对待不使用的包，是保留还是卸载。

## init 函数

- gc-cons ：Spacemacs 的垃圾回收
- use-spacelpa：软件仓库选择，Melpa 或者 Spacelpa
- check-for-update：启动时检查 Spacemacs 是否有新版本
- **editing-style**：快捷键风格，有 vim、emacs、hybrid
- 以 startup 开头：设置启动页样式
- startup-buffer-multi-digit-delay：等待按键延迟，默认0.4，建议0.2
- scratch-buffer-persistent：`*scratch*` 缓冲区会自动保存
- themes：主题
- mode-line-theme：设置 Spaceline 主题
- **default-font**：设置字体样式。对终端运行的 Emacs 无效
- **leader-key**：Vim 按键风格，默认 `<SPC>`
- **emacs-command-key**：设置 `M-x` 的别称，默认 `<SPC>`
- **ex-command-key**：vim Ex 命令，默认 `:`
- emacs-leader-key：Emacs 按键风格使用 leader-key，默认 `M-m`
- **major-mode-leader-key**：Vim 按键风格，默认 `,`
- major-mode-emacs-leader-key：Emacs 按键风格使用 mode-leader-key，默认 `M-<RET>`
- which-key-delay：which-key 面板出现延迟，默认0.4，建议0.2
- which-key-position：which-key 面板的位置
- loading-progress-bar：启动时显示 Emacs 加载进度条，会影响启动时间
- fullscreen-at-startup：启动时 Emacs 全屏显示
- maximized-at-startup：启动时 Emacs 最大化显示[^1]
- line-numbers：显示行号
- search-tools：文件搜索工具

# Quick start

- `<SPC> f e d` ：打开 Spacemacs 用户配置文件，f 是 file，e 是 emacs，d 是 dotfile
- `<SPC> f e D` ：比较当前配置文件和初始配置文件，类似 git diff，D 是 Diff
- `<SPC> f e R` ：重新加载配置，R 是 Reload
- `<SPC> f f` ：打开/创建文件
- `<SPC> f r` ：**访问最近打开的文件**，r 是 recent
- `<SPC> f s` ：保存文件
- `<SPC> q q` ：退出 emacs，q 是 quit
- `<SPC> h T v` ：学习 evil 改编的 Vimtutor 教程，h 是help，T 是Tutorial，v 记作 vim
- `<SPC> ?` ：搜索忘记了的按键绑定，支持快捷键或命令搜索
- `<SPC> h d f` ：查看函数功能，d 记作 describe，f 是 function
- `<SPC> h d k` ：查看快捷键功能，k 是 key	
- `<SPC> h d m` ：查看模式，m 是 mode
- `<SPC> h d v` ：查看变量，v 是 variable
- `<SPC> h d x` ：查看命令，x 是 ex-command
- `<SPC> w /` ：向右分屏，w 是 windows
- `<SPC> w -` ：向下分屏
- `<SPC> w d` ：删除当前窗格，d 是 delete
- `<SPC> 数字` ：切换到对应数字的窗格
- `<SPC> b s` ：打开缓冲区 `*scratch*` ，b 是 buffer
- `<SPC> <TAB>` ：在当前缓冲区和上一个缓冲区之间快速切换
- `<SPC> b b` ：列出缓冲区
- `<SPC> b d` ：关闭当前缓冲区
- `<SPC> T n` ：切换主题，T 记作 Theme，n 记作 next
- `<SPC> <SPC>` ：`M-x` 的别称

推荐一个 evil vim 中文版教程，[evil-tutor-sc：简体中文的 Emacs Evil 实践式教程](https://github.com/clsty/evil-tutor-sc)。教程打开快捷键是 `M-x evil-tutor-sc-start-new` 。该插件提供了两个快捷键 `C-j` 和 `C-k` ，用来在每个小章节之间来回跳转。

相比较于一次按两个键的 `C-x` 和 `M-x` ，Spacemacs 将扩展命令分成两次输入，极大减轻了手指负担，第一次由强而有力的大拇指输入空格键，第二次输入的按键大部分都很好记，是某个单词的首字母，比如 f 是 file，w 是 windows，b 是 buffer，h 是 help等。

# 配置 Python layer

## 后端选择

有 Anaconda（默认）和 lsp (Language Server Protocol) 两种后端。lsp 后端需要使用语言服务器实现。

语言服务器也有两款，默认是 pylsp (python-lsp-server package) ，也可选择 pyright。

```zsh
pip install python-lsp-server
```

## 语法检查

```zsh
pip install flake8
```

## 测试运行器

默认是 pytest，也可选择 note。

```zsh
pip install pytest
```

## 清理没用到的导入

```zsh
pip install autoflake
```

## dap-mode 调试器

仅适用于 lsp 后端：

```zsh
pip install debugpy
```

使用 dap 调试的快捷键：[戳这](https://github.com/syl20bnr/spacemacs/tree/develop/layers/%2Btools/dap#key-bindings)

## 笔记本和单元格

在 Emacs 中编辑 Jupyter notebook，需要安装  [jupytext](https://github.com/mwouts/jupytext)。

## 管理虚拟环境

pet（Python Executable Tracker）用于管理 Python 虚拟环境，自由切换到由 conda、venv等工具创建的虚拟环境。

但是我没整明白，怎么切换。按照教程装了一遍，发现没有出现切换环境的命令选项 `M-x pet-conda-switch-environment` 。

现把安装 pet 过程记录如下，方便日后检查哪里不对：

```zsh
sudo apt install dasel sqlite3
```

![~/.spacemacs.d/init.el | 700x0](https://vip.123pan.cn/1844935313/obsidian/20250920150338056.png)

# 尾声

有关主题 Spacemacs 的配置，我做的很粗糙。目前能想到要填的坑有：虚拟环境切换、查看函数和变量、跳转到函数内部、用 dap 进行 debug 调试。

现在的 Emacs 充其量就是一个文本编辑器，考虑在此之前我用的是 neovim，主题是 lazyvim，也是把 vim 当文本编辑器使用，所以在代码运行和调试这块，我相当不熟悉。

如果说要继续学习 Spacemacs，那么肯定还是从剩下未读的官方文档开始，比如 [Spacemacs documentation](https://www.spacemacs.org/doc/DOCUMENTATION.html) 和 [Spacemacs layers list](https://www.spacemacs.org/layers/LAYERS.html)。



[^1]: 全屏显示开启后，最大化显示无效
