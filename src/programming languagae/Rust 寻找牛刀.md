---
title:
date: 2026-07-15
tags:
  - Rust
category:
  - 编程语言
---
# 前言

阅读 [Rust语言圣经](https://beatai.org/rust-course/about-book) 的第一部分：寻找牛刀

<!-- more -->

# 安装 Rust

```zsh
❯ rustc -V  
rustc 1.97.0 (2d8144b78 2026-07-07) (Arch Linux rust 1:1.97.0-1)  
❯ cargo -V  
cargo 1.97.0 (c980f4866 2026-06-30) (Arch Linux rust 1:1.97.0-1)
```

# 安装 VSCode 的 Rust 插件

社区驱动的 `rust-analyzer`

推荐几个好用的插件：

1. `Even Better TOML`，支持 .toml 文件完整特性
2. `Error Lens`, 更好的获得错误展示
3. `One Dark Pro`, 非常好看的 VSCode 主题
4. `CodeLLDB`, Debugger 程序

# 运行第一个 Rust 项目

## cargo new

`cargo new` 创建项目：

```zsh
cargo new world_hello
cd world_hello
```

当前的项目结构如下所示， `cargo` 已经贴心地创建好 .git 和 .gitignore。

```
├── Cargo.toml  
├── .git  
├── .gitignore  
└── src  
   └── main.rs
```

## cargo run

`cargo run` 运行项目：

```zsh
❯ cargo run  
  Compiling world_hello v0.1.0 (/home/liyang/GitRepo/test_rust/world_hello)  
   Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.40s  
    Running `target/debug/world_hello`  
Hello, world!
```

上述代码，`cargo run` 首先对项目进行编译，然后再运行，因此它实际上等同于运行了两个指令，下面我们手动试一下编译和运行项目：

编译

```zsh
$ cargo build
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
```

运行

```zsh
$ ./target/debug/world_hello
Hello, world!
```

在调用的时候，路径 `./target/debug/world_hello` 中有一个明晃晃的 `debug` 字段，没错我们运行的是 `debug` 模式，在这种模式下，**代码的编译速度会非常快**，可是福兮祸所伏，**运行速度就慢了**. 原因是，在 `debug` 模式下，Rust 编译器不会做任何的优化，只为了尽快的编译完成，让你的开发流程更加顺畅。

如果你想要高性能的代码怎么办？ 简单，添加 `--release` 来编译：

- `cargo run --release`
- `cargo build --release`

## cargo check

当项目大了后，`cargo run` 和 `cargo build` 不可避免的会变慢，那么有没有更快的方式来验证代码的正确性呢？大杀器来了，接着！

`cargo check` 是我们在代码开发过程中最常用的命令，它的作用很简单：快速的检查一下代码能否编译通过。因此该命令速度会非常快，能节省大量的编译时间。

```zsh
❯ cargo check  
   Checking world_hello v0.1.0 (/home/liyang/GitRepo/test_rust/world_hello)  
   Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.03s
```

## Cargo.toml 和 Cargo.lock

`Cargo.toml` 和 `Cargo.lock` 是 `cargo` 的核心文件，它的所有活动均基于此二者。

- `Cargo.toml` 是 `cargo` 特有的**项目数据描述文件**。它存储了项目的所有元配置信息，
- `Cargo.lock` 是 `cargo` 工具根据同一项目的 `toml` 文件生成的**项目依赖详细清单**，我们一般不用修改它。

> 什么情况下该把 `Cargo.lock` 上传到 git 仓库里？当你的项目是一个可运行的程序时，就上传 `Cargo.lock`，如果是一个依赖库项目，那么请把它添加到 `.gitignore` 中。

### package 配置段落

`package` 中记录了项目的描述信息，典型的如下：

```toml
[package]  
name = "world_hello"  
version = "0.1.0"  
edition = "2024"
```

`name` 字段定义了项目名称，`version` 字段定义当前版本，新项目默认是 `0.1.0`，`edition` 字段定义了我们使用的 Rust 大版本。

### 定义项目依赖

使用 `cargo` 工具的最大优势就在于，能够对该项目的各种依赖项进行方便、统一和灵活的管理。

在 `Cargo.toml` 中，主要通过各种依赖段落来描述该项目的各种依赖项：

- 基于 Rust 官方仓库 `crates.io`，通过版本说明来描述
- 基于项目源代码的 git 仓库地址，通过 URL 来描述
- 基于本地项目的绝对路径或者相对路径，通过类 Unix 模式的路径来描述

这三种形式具体写法如下：

```toml
[dependencies]
rand = "0.3"
hammer = { version = "0.5.0"}
color = { git = "https://github.com/bjz/color-rs" }
geometry = { path = "crates/geometry" }
```

## 基于 cargo 的项目组织结构

前文有提到 `cargo` 默认生成的项目结构，真实的项目肯定会有所不同，但是在目前的学习阶段，还无需关注。感兴趣的同学可以移步：[Cargo 项目结构](https://beatai.org/rust-course/cargo/guide/package-layout)

# 下载依赖很慢或卡住？

在目前，大家还不需要自己搭建的镜像下载服务，因此只需知道下载依赖库的地址是 [crates.io](https://crates.io/)，是由 Rust 官方搭建的镜像下载和管理服务。

### 覆盖默认的镜像地址

在 `$HOME/.cargo/config.toml` 添加以下内容：

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```

首先，创建一个新的镜像源 `[source.ustc]`，然后将默认的 `crates-io` 替换成新的镜像源: `replace-with = 'ustc'`。
