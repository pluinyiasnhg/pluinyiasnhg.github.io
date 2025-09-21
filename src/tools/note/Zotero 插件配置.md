---
title: Zotero 插件配置
date: 2025-09-17
tags:
  - Zotero
category:
  - 笔记软件
---
# 前言

优化 Zotero 使用体验，特别是 Zotero 的笔记功能和与 Obsidian 的联动。

插件按照名称首字母排序。名称中带❔的插件说明我不清楚它到底什么用；名称带💰的插件有付费部分，可能是只给试用，也可能是付费解锁全部功能，基本功能免费用。

<!-- more -->

# 插件

## Add-on Market

- 项目地址：[戳这](https://github.com/syt2/zotero-addons/tree/main)
- 用法：
	- 『工具-插件市场』或者中央面板上端一个像拼图的图标
- 评价：
	- 插件市场，用于在 Zotero 内部浏览和下载插件，根据网络环境可以选择国内源或国外源

## Better BibTeX

- 项目地址：[戳这](https://github.com/retorquere/zotero-better-bibtex)
- 用法：
	- 选中条目，右键菜单中会出现“Better BibTeX”选项
- 评价：
	- **导出 Zotero 数据**，可以配合 Obsidian 插件将 Zotero 笔记、引文、注释导入到 Obsdian 中
	- 格式和编码转换，把 Zotero 使用的 UTF-8 Unicode 格式转换为改进的 LaTeX

## Better Notes

- 项目地址：[戳这](https://github.com/windingwind/zotero-better-notes)
- 评价：
	- 和 OB 相比，md 笔记很不好用
	- 适合将注释转化为 md 文件形式，最终导入到 OB 中

## Chartero

- 项目地址：[戳这](https://github.com/volatile-static/Chartero)
- 评价：
	- 以图表的形式可视化分类和条目
	- 对于分类，可视化该分类下的作者关系图、历史甘特图等
	- 对于条目，显示文献的阅读记录
	- 我写这篇文章时插件更新到 2.10.0 版本，我无法安装，查看项目 issue ，有人说新版本适配 Zotero 8。然后我安装上个版本 2.9.16，安装时有报错，不确定是否有影响

## Easier Citation❔

- 项目地址：[戳这]()
- 用法：
	- 编辑 word 插入引文时候，Zotero 在后台会打开一个临时文件夹（Zotero 关闭后删除）
- 评价：
	- 原生 Zotero 每次插入引文都要打开一个搜索框，十分麻烦。装了该插件后，在 word 中可以从临时文件夹中插入引文，支持快捷键插入、拖拽插入（没测试过，WPS 试了下用不了）

## Ethereal Reference💰

- 项目地址：[戳这](https://github.com/MuiseDestiny/zotero-reference)
- 用法：
	- Zotero 右侧窗格的参考文献一栏，有一个刷新按钮，可以读取文献中的参考文献
- 评价：
	- 有 pro 版本
	- 鼠标悬浮在该插件获取到的一则参考文献，会出现浮窗，浮窗包含题目、期刊、发表时间、作者、摘要等
	- 对于英文摘要，可以配合 Translate 插件实现翻译：Ctrl + 鼠标单击摘用区域

## Ethereal Style💰

- 项目地址：[戳这](https://github.com/MuiseDestiny/zotero-style?tab=readme-ov-file)
- 评价：
	- pro 版本可以把一些数据可视化，比如影响因子、被引用数。
	- 免费版功能较少，丰富 Zotero 中间窗格的显示内容，比如阅读时间、期刊标签等。

## DOI Manager

- 项目地址：[戳这](https://github.com/bwiernik/zotero-shortdoi#readme)
- 评价：
	- 自动检索 doi，获取文献的长、短doi，清理无效 doi

## Jasminum 茉莉花 

- 项目地址：[戳这](https://github.com/l0o0/jasminum)
- 评价：
	- 增加 Zotero 对中文文献的元数据提取的功能

## Linter❔

- 项目地址：[戳这](https://github.com/northword/zotero-format-metadata/)
- 用法：
	- 选中条目，右键菜单中会出现“Linter”选项
- 评价：
	- 功能很多很杂，围绕条目的元数据展开，猜测该插件用于规范化引文和参考文献的格式
	- 比如期刊及其期刊缩写，有些论文要求缩写，有些不要求缩写；比如根据高校名称填写高校所在地
	- 插件 Zoplicate 专门**检测和管理重复的文献条目**，Linter 复杂功能中也有管理重复文献冲突的功能

## Magic💰

- 项目地址：[戳这](https://github.com/l0o0/MagicZotero)
- 评价：
	- 定价128，提供七天试用，使用文档[戳这](https://www.magiczotero.top/)
	- 定位是**全文翻译和总结**，由[Zotero 中文社区](https://zotero-chinese.com/)出品，这让想起了隔壁 Obsidian 的 PKMer 团队，他们也有自己的插件，不知道有没有推出自己的付费插件
	- 不太好用，不如沉浸式翻译的 [BabelDOC](https://app.immersivetranslate.com/babel-doc/)。全文翻译还算简单，只需要谷歌翻译就行。全文总结就麻烦多了，又要大模型 API，又要专门 PDF 排版的大模型
	- 相比之下，BabelDOC 每月免费翻译一千页，多开几个帐号就完全够用了。10月15日的更新后，改为每月提供 50w token 额度，不再按页计算

## PDF Figure
 
- 项目地址：[戳这](https://github.com/MuiseDestiny/zotero-figure)
- 用法：
	- 在 Zotero 左侧窗格多出一个“所有图片”标签页，里面存放文献中所有的图片
- 评价：
	- 点击标签页下的图片可以跳转到文献对应位置
	- 双击图片是跳转+复制图片

## SciPDF

- 项目地址：[戳这](https://github.com/syt2/zotero-scipdf)
- 用法：
	- 选中条目，右键菜单中会出现“查找全文”选项。没有安装该插件，也有这个选项。
- 评价：
	- 根据 doi，自动从 Scihub 上下载pdf，所以最好搭配 DOI Manager
	- Zotero 本身就可以通过添加标识符，如 doi，获取到文献的元数据。配合插件 SciPDF 补全了文献的附件
	- Sci-Hub 自2021年陷入法律问题，从2021年起的文献无法下载。这就显得插件鸡肋

## Tara 蒲公英

- 项目地址：[戳这](https://github.com/l0o0/tara)
- 用法：
	- 『工具-蒲公英』有四个候选项：创建、导出、导入、恢复
- 评价：
	- 备份插件、Zotero 配置、CSL 引文格式、转换器（translator）、Locate 文件夹

## Translate

- 项目地址：[戳这](https://github.com/windingwind/zotero-pdf-translate?tab=readme-ov-file)
- 用法：
	- 自带的谷歌翻译已经够用了
	- [腾讯翻译](https://cloud.tencent.com/document/product/551/35017)每月500万字符，[字节的火山翻译](https://www.volcengine.com/docs/4640/68515)每月200万字符。此外，腾讯翻译可以在用完免费额度后，停止服务；火山翻译采取后支付的方式，用完免费额度后会马上收费。
	- [Gemini](https://aistudio.google.com/)免费申请和使用 API，但是 Gemini 有速率限制：每分钟请求数 (RPM)、每分钟 token 数（输入）(TPM)、每日请求数 (RPD)，三选一满足就会翻译失败。实际用下来很鸡肋
- 评价：
	- 用于划词翻译
	- 使用较简单，主要麻烦是申请各家机器翻译的 API，可以参考[这篇教程](https://zotero-chinese.com/user-guide/plugins/translate/)进行配置

# 尾声

第一轮 Zotero 插件，主要参考 Zotero 中文社区的新手教程，以及学校社团中一位大佬分享的自己所用插件的截图。

