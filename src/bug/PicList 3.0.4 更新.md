---
title: PicList 3.0.4 更新
shortTitle:
date: 2025-09-15
tags:
  - Appimage
category:
isOriginal: "true"
---
# 背景

一直有在用 PicList 作为 Obsidian 的图床平台管理工具，前不久看到来自 PicList 的通知，大意是 PicList 版本来到 3.0 以后，没法像之前小版本更新那样自动更新了，需要重新安装一下。

![新版通知](https://vip.123pan.cn/1844935313/obsidian/20250915180641528.png)

由于我之前安装软件图省事，遵循着“能用 apt 就用 apt，不然就用 snap、flatapk，实在不行，再考虑 appimage”，所以我也不知道我的 PicList 安装到那里去了😢。

# 开始

在 `~/snap` 下面找到了 PicList，后续在终端中用 `snap list` 也实现了相同的效果。

卸载通过 snap 安装的 PicList：

```zsh
sudo snap remove piclist
```

从[PicList 官方](https://github.com/Kuingsmile/PicList/releases)下载最新的 piclist_3.0.4_amd64.snap，打开终端开始安装：

```zsh
sudo snap install ./piclist_3.0.4_amd64.snap --dangerous
```

选项 dangerous 不可缺少，新版的 PicList 没有被 snap 认证过。

不清楚老版 PicList 有没有把 webdav 配置导出的功能，反正我熟悉 PicList 新界面时候，看到『设置-配置/同步-上传下载配置文件』时，陷入沉思。

总之，我还是重新配置一遍123网盘的 WebDav 第三方挂载。新版可以照抄老版的 WebDav 设置：

- 图床配置名：随便取
- 设定接口网址、设定用户名、设定密码：就是123网盘的『工具中心-第三方挂载』的服务器地址、账户、密码
- 启用 SSL：勾选，123网盘的直链链接用的是 https 协议
- 设定存储路径：网盘存放图片的文件夹，以 / 结尾
- 设定自定义域名：格式是 https://vip.123pan.cn/一串数字 。图床文件夹开启直链后，上传一张图片，右键该图片获取直链链接。注意不以 / 结尾

![image.png](https://vip.123pan.cn/1844935313/obsidian/20250915153744442.png)

# 尾声

中间有过一段小插曲：考虑用 macOS 的 homebrew 安装 PicList。由于之前没用过 homebrew，不知道带选项 cask 的安装包是 macOS 专用，遗憾落幕。

ubuntu 上有安装自定义手势的 touche，其中一条 Pinch with 3 Fingers ，我设置为关闭窗口。在老版 PicList 关闭主窗口，PicList 仍然在后台工作；新版则是直接结束。这就导致偶尔非常困惑：我在 Obsidian 中粘贴图片显示失败，一看屏幕上面的托盘，PicList 又掉了。不过 mini 窗口，新老版本都能用手势关闭且不杀进程。

