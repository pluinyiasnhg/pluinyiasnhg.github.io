---
title: Goldendict 设置黑夜模式
date: 2025-10-18
tags:
  - Goldendict
category:
  - 报错
---
# 前言

解决 Goldendict 白色背景晃眼的问题。

<!-- more -->

首先是，下载主题[GoldenDict-Full-Dark-Theme](https://github.com/yozhic/GoldenDict-Full-Dark-Theme)。

更换 Goldendict 样式，需要用到目录中 `fonts`， `icons` 和 `styles` 这三个文件夹，将它们移动到对应位置。

- `fonts`、`styles` 移动到 `~/.config/goldendict` 
- `icons` 移动到 `/usr/share/goldendict` 

配置文件夹 `~/.config/goldendict` 可以通过 Goldendict 主界面的『帮助-配置文件夹』直接打开。

我是通过 `.deb` 包安装了 Goldendict，在命令行使用 `dpkg -L goldendict` 查看 Goldendict 安装的位置。

此外，建议将字典的存放位置设置在 `~/.goldendict` 里面。

如上配置好主题相关的三个文件夹后，打开『编辑-首选项』或者快捷键 `F4` ，就能看到多出一个“附加样式”选项，用来设置主题。

![Goldendict Dark-Rounded 主题|750x0](https://vip.123pan.cn/1844935313/obsidian/20251017182340753.png)

如图所示，我选择了 Dark-Rounded 主题，Goldendict 看上去舒服得多了，也不用担心切屏时亮瞎眼。