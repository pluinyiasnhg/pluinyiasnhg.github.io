---
title: 本地编译 Emacs
date: 2025-10-20
tags:
  - 编辑器
  - Emacs
category:
  - 代码效率
---
# 前言

学习 Rahul 的 [Compiling Emacs 30.1 from the source on Debian](https://www.rahuljuliato.com/posts/compiling_emacs_30_1) 教程，尝试在本地编译 Emacs 30.2 。

<!-- more -->

起因是在 [Emacs Release](https://www.gnu.org/savannah-checkouts/gnu/emacs/emacs.html#Releases) 上看到今年8月更新的 30.2 版本，再看看 ubuntu 上用 apt 安装的 29.4 版本，两个版本之间隔着一个 30.1。在此之前，也就是今天早上的时候，我还是在看 Emacs 的 lsp-mode，lsp-mode 集成了许多插件，其中之一就是 which-key。在该插件的 Github 主页上，我注意到该插件已经停止更新了，插件计划在 Emacs 30 合并到官方项目中。

于是，我就非常想体验下新版本的 Emacs，Ubuntu 官方源的更新遥遥无期，只能在本地编译适合 Ubuntu 的软件包了。

# 下载源代码

创建并进入一个新目录，该目录用于存放 Emacs 源代码：

```zsh
mkdir ~/emacs_build
cd emacs_build
```

从 Emacs 官方提供的[镜像源](https://gnu.mirror.constant.com/emacs/)下载当前最新版本 emacs-30.2 ：

```zsh
wget -c https://gnu.mirror.constant.com/emacs/emacs-30.2.tar.gz
wget -c https://gnu.mirror.constant.com/emacs/emacs-30.2.tar.gz.sig
```

验证 `.tar.gz` 压缩包的检验和：

```zsh
# 用 sha1num 或 sha256num 校验
sha256sum emacs-30.2.tar.gz
```

验证压缩包签名，如果验证成功，则会看到形如 `Good signature from "Eli Zaretskii <eliz@gnu.org>" [unknown]` 的输出：

```zsh
gpg --verify emacs-30.2.tar.gz.sig emacs-30.2.tar.gz
```

解压 tarball 压缩包：

```zsh
tar zxvf emacs-30.2.tar.gz
```

 使用 `tar --help | grep -E "^ *-(x|v|f|z)"` 查询上述选项的作用：
 
  - `-x, --extract, --get` 表示从档案（archive）中提取文件 
  - `-v, --verbose` 表示解压文件时列出所有文件名
  - `-f, --file=ARCHIVE` 使用档案文件或设备 ARCHIVE
  - `-z, --gzip, --gunzip, --ungzip` 通过 gzip 过滤档案

> 通常所说的压缩文件，可以分为存档和压缩两个步骤，尽管实际使用中感觉不出，似乎是一步到位的。以 `.tar.gz` 文件为例，`.tar` 即存档文件，`.gz` 即压缩文件。

# 进行配置

有关源代码如何本地编译，可以参阅 `emacs-30.2/INSTALL` 文件。该文件给出了一个有近900行的教程。

运行 `./configure --help` 查看所有 Emacs 选项：

```zsh
./configure --with-native-compilation=aot\
            --with-tree-sitter\
            --with-gif\
            --with-png\
            --with-jpeg\
            --with-rsvg\
            --with-tiff\
            --with-imagemagick\
            --with-x-toolkit=gtk3\
            --with-mailutils
```

`aot` 会编译所有 Lisp 代码，可能需要 **很长时间**（特别是在老旧机器上），如果不想等待太久，可以改用 `--with-native-compilation`（即 JIT 模式）。

在为 Emacs 选择 GUI 时候，要考虑系统是 X11 还是 Wayland。`--with-pgtk` 中的 pgtk 全称为 pure-GTK，它就不适合我在用的 X11 。如果非要在 X11 上安装了 GTK，那么启动 Emacs GUI 时，Emacs 会如下警告：

```txt
You are trying to run Emacs configured with the "pure-GTK" interface under the X Window System. That configuration is unsupported and will lead to sporadic crashes during transfer of large selection data. It will also lead to various problems with keyboard input.
```

我在配置过程中遇到最多的问题是缺少各种编译所需的软件包。基本上只要按照报错信息，上网查询缺失包的 apt 安装方式，在本地安装后就没问题了。这个过程可能需要反复多次，每次编译失败都用 `rm -rf` 删除 `config.status`，避免因编译失败而损坏文件。

注意，配置过程中如果需要安装 `libgccjit` 包，那么这个包必须与 `gcc` 的版本一致，比如我笔记本上的 `gcc` 版本是 13.3，对应的 `libgccjit` 包是 `libgccjit-13-dev` 。

# 编译和安装

编译和安装过程中可能出现“权限不够”的问题，用超级用户身份重新执行命令就行，即 `sudo !!` 。

- `make clean` 用于清理上次编译的结果
- `make -j8` 表示用8个作业进行编译，不指定数字时默认作业数无限制。如果在配置阶段设置了 Emacs 本地编译器为 `aot`，那么编译过程中会把 `.el` 文件编译成 `.eln`。我使用下来，感觉启动时间快了许多
- `./src/emacs --version` 正式安装之前，检查编译得到的软件版本是否正确

```zsh
make clean
make -j8
./src/emacs --version
```

开始安装：

```zsh
make install
emacs --version
```

卸载的方式同安装一样简单，但是需要保留编译 Emacs 时的目录 `~/emacs-build` ：

```zsh
make uninstall
```

# 尾声

在我反复编译、安装、卸载 Emacs 过程中，每次打开新安装的 Emacs，确认软件是否正常运行，我都要等待 Spacemacs 安装 200个左右的包。

假如我在一台云服务器上使用 Spacemacs，那么这种等待时间实在让我没法接受。学习 Lisp 和它的方言版本 Emacs Lisp，也该早日提上日程。
