---
title: pnpm 更新后 github 博客更新失败
date: 2025-09-19
tags:
  - pnpm
category:
  - 报错
isOriginal: "true"
---
# 前言

前几天使用 git 更新博客失败，github action 总是停留在 Setup pnpm 阶段。但是本地测试时候博客正常显示。

<!-- more -->

# 开始

github action 报错信息如下：

``` github
  Error: Multiple versions of pnpm specified:
    - version 10 in the GitHub Action config with the key "version"
    - version pnpm@10.16.1+sha512.0e155aa2629db8672b49e8475da6226aa4bdea85fdcdfdc15350874946d4f3c91faaf64cbdc4a5d1ab8002f473d5c3fcedcd197989cf0390f9badd3c04678706 in the package.json with the key "packageManager"
  Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
      at readTarget (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:4742)
      at runSelfInstaller (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:3930)
      at async install (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:3154)
      at async main (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:445)
  Error: Error: Multiple versions of pnpm specified:
    - version 10 in the GitHub Action config with the key "version"
    - version pnpm@10.16.1+sha512.0e155aa2629db8672b49e8475da6226aa4bdea85fdcdfdc15350874946d4f3c91faaf64cbdc4a5d1ab8002f473d5c3fcedcd197989cf0390f9badd3c04678706 in the package.json with the key "packageManager"
  Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
```

原因是“前几天”的前一天，我把 pnpm 给更新了下，本地博客项目的 package.json 也随之更新为 `packageManager: "pnpm@10.16.1+sha512.<哈希码>"` ，于是就和github 配置文件 `.github/workflows/deploy-docs.yml` 中的 pnpm 版本产生冲突。

知道问题所在，解决方法也就来了：注释掉 deploy-doc.yml 中指定 pnpm 版本的代码。

```
  - name: Setup pnpm
	uses: pnpm/action-setup@v4
	# 不再指定 version，action 会自动从 package.json 的 packageManager 字段读取
	# with:
	#   version: 10
```

# 尾声

今天下午睡过了头，以往是一点半醒来，今天醒来已经三点半了。打开手机一看，微信三十九条消息，老师发布了文献调研任务，时间很紧，今晚截止。

于是，我从素材文件夹 demo 中翻出一篇，水一水。

另外，这次博客更新失败，我后续的一串迷之操作把博客项目改得很糟糕。没办法，只能学习 git 如何回退版本了。

```zsh
# 指向前一个版本
git reset --hard HEAD^ 

# 强制提交记录
git push origin main --force
```
