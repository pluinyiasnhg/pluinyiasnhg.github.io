---
title: Goldendict 没声音
date: 2025-09-25
tags:
  - Goldendict
  - mpv
category:
  - 报错
isOriginal: "true"
---
# 前言

问题描述：用 goldendict 查词，查第一个词时有声音，之后笔记本就输出不了一点声音。打开网页视频，有画面没声音且视频一直显示加载中。此时连上耳机，耳机有声音。

<!-- more -->

# 开始

goldendict 是一款用于管理字典的软件，可以为 koreader 阅读器的划词翻译提供字典服务。平时使用时，使用全局快捷键 `Ctrl-c-c` 读取剪贴板中的内容，并弹出一个显示单词含义的小窗口。第一个 c 是复制单词，第二个 c 是查词。

![用 goldendict 查单词|700x0](https://vip.123pan.cn/1844935313/obsidian/20250925104334942.png)

goldendict 不仅可以查词，还可以翻译整个句子、段落、文章。这需要接入谷歌翻译，幸运的是，我们只需要下载 github 上的项目 [google-translate-for-goldendict](https://github.com/xinebf/google-translate-for-goldendict)，并对 goldendict 进行简单的配置，就能马上使用了。

回顾正题。一开始的应急方案是，用 PulseAudio Volume Control 将声音关闭，然后再将声音从 dummy sound 切换为原来的 Meteor Lake-p HD Audio Controller。

但后来随着我阅读英文文献的频率升高，加上我不太会英语音标，我对词典发音这件事就很在意，总不能每次都用应急方案来关开声音。

首先是大胆猜测是 goldendict 的音频输出有问题。虽然第一次遇到问题时，我是非常主观的把问题推给了 ubuntu 系统不适配我的笔记本。在网上特意往这方面查询了相关资料后，更加坚定了这个观点。但现在是解决问题，不是推卸问题，系统不适配的问题，不是我这个小卡拉米说解决就解决的，还是从小问题着手。

goldendict 默认使用内部播放器，我下载了一个外部播放器 vlc ，使用命令行 `cvlc --play-and-stop` 播放。

![默认播放器 FFmpeg + libao|700x0](https://vip.123pan.cn/1844935313/obsidian/20250925105423324.png)

声音是恢复正常了，但播放的声音很小，我尝试设置参数 `--volume` 控制音量，但没有任何效果。

注意到 vlc 就是一个视频播放器，我马上想到了之前用过的 mpv 播放器。卸载 vlc，安装 mpv，设置命令 `mpv --volume=100` ，声音响亮许多，问题迎刃而解。

# 尾声

暂时先这么用着吧。goldendict 是个比较老的软件，我对他的了解不深，只是往里头放字典，管理字典，查字典，其他功能一概不知。

mpv 就更加不清楚了，它同样高度自定义，初始的 mpv 界面简直没法用，它默认的快捷键很奇怪，我在 windows 系统上使用时，用的是别人配置好的 [mpv-lazy](https://hooke007.github.io/unofficial/mpv_start.html)。

