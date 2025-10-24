---
title: Photoshop 中文改英文以及字体变大
date: 2025-10-22
tags:
category:
---
# 前言

通过星火应用商店（Spark Store）为 Ubuntu 安装 Photoshop 2021。打开软件，默认就是中文，其中小部分字体过大，显示不全；大部分字体太小，看得费劲。

<!-- more -->

# 解决

# PS 中文改英文

通过星火应用商店使用Wine安装的Windows软件，其文件通常存放在用户目录下一个名为 `.deepinwine` 的隐藏文件夹中。这个文件夹里会为每个软件创建一个独立的子文件夹，其命名格式通常为 Spark-软件名。

Photoshop 2021 安装在 `~/.deepinwine/com.photoshop.2021` 下面，该目录下有一个虚拟的 C 盘文件夹 `drive_c` ，参考 windows 下 Photoshop 默认的安装路径，我们切换到 `driven_c/Program Files/Adobe/Adobe Photoshop 2021/Locales/zh_CN/Support Files` 目录下，将中文包 `tw10428_Photoshop_zh_CN.dat` 改名。

```zsh
mv tw10428_Photoshop_zh_CN.dat tw10428_Photoshop_zh_CN.dat~
```

如果想把 PS 切换回中文环境，则把中文包名字改回去就行。

![英文界面效果图|700x0](https://vip.123pan.cn/1844935313/obsidian/20251019105051777.png)

可以从上图中看到，虽然星火商店提供的 PS 2021只有中文语言选项，但是按照上述操作可以得到英文界面的效果。

# PS 字体放大

在『Edit - Preferences - Interface - Presentation』中设置：

- UI Scaling 为200%或 auto
- UI Font Size 为 Large
- 勾选 Scale UI to Font

为什么这么设置？答案就是我一波排列组合得出来的，虽然顶部的选项栏的字体还是偏小。也许用 Wine 的相关工具可以调节界面，因为部分游戏用 Wine 启动后也会出现这种字体偏小偏大的问题。

![勉强能用|700x0](https://vip.123pan.cn/1844935313/obsidian/20251019105751814.png)

# 尾声

下载 PS，主要是因为网上的中文教程多，先学会使用 PS，再将知识迁移到 [GIMP](https://www.gimp.org/)。
