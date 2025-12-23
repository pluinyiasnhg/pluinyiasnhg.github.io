---
title: Git 入门(1)
date: 2025-10-06
tags:
  - Git
category:
  - 代码效率
---
# 前言

阅读 Scott Chacon 的[《Pro Git》中文版](https://git-scm.com/book/zh/v2)前两章，主要是 Git 本地命令，不涉及分支操作。

25/11/26 学习尚硅谷6小时的[《Git与GitLab的企业实战》](https://www.bilibili.com/video/BV1NK421Y7XZ) ，视频配速1.7 。该教程，弥补了我之前看书时缺失的实践部分。

<!-- more -->

# 1. 版本控制系统

## 本地版本控制系统

人们很久以前就开发了许多种本地版本控制系统，大多都是采用某种简单的数据库来记录文件的历次更新差异。

## 集中化的版本控制系统

如何让在不同系统上的开发者协同工作？ 集中化的版本控制系统（Centralized Version Control Systems，CVCS）应运而生。 这类系统，诸如 CVS、Subversion 以及 Perforce 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。 

CVCS 显而易见的缺点是中央服务器的单点故障。 如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。 如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据，包括项目的整个变更历史，只剩下人们在各自机器上保留的单独快照。 本地版本控制系统也存在类似问题，只要整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险。

## 分布式版本控制系统

于是分布式版本控制系统（Distributed Version Control System，DVCS）面世了。 在这类系统中，像 Git、Mercurial 以及 Darcs 等，客户端并不只提取最新版本的文件快照， 而是把代码仓库完整地镜像下来，包括完整的历史记录。 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份。

Git 和其它版本控制系统（包括 Subversion 和近似工具）的主要差别在于 Git 对待数据的方式。 从概念上来说，其它大部分系统以文件变更列表的方式存储信息，这类系统（CVS、Subversion、Perforce 等等） 将它们存储的信息看作是一组基本文件和每个文件随时间逐步累积的差异 （它们通常称作 基于差异（delta-based） 的版本控制）。

反之，Git 更像是把数据看作是对小型文件系统的一系列快照。 在 Git 中，每当你提交更新或保存项目状态时，它基本上就会对当时的全部文件创建一个快照并保存这个快照的索引。 为了效率，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。 

## Git 特点

- Git 近乎所有操作都是本地执行。因为在本地磁盘上就有项目的完整历史，所以大部分操作看起来瞬间完成
- Git 保证完整性。Git 中所有的数据在存储前都计算校验和，然后以校验和来引用。 这意味着不可能在 Git 不知情时更改任何文件内容或目录内容
- Git 数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名
- Git 一般只添加数据。执行的 Git 操作，几乎只往 Git 数据库中添加数据。 你很难使用 Git 从数据库中删除数据，也就是说 Git 几乎不会执行任何可能导致文件不可恢复的操作。 同别的 VCS 一样，未提交更新时有可能丢失或弄乱修改的内容。但是一旦你提交快照到 Git 中， 就难以再丢失数据

# 2. Git 基础

## 配置文件

Git 自带一个 `git config` 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：

1. `/etc/gitconfig` 包含系统上每一个用户及他们仓库的通用配置。如果在执行 git config 时带上 `--system` 选项，那么它就会读写该文件中的配置变量（由于它是系统配置文件，因此需要超级用户权限来修改它）
2. `~/.gitconfig` 或 `~/.config/git/config` 只针对当前用户。 可以传递 `--global` 选项让 Git 读写此文件，这会对你系统上所有的仓库生效。
3. 当前使用仓库的 Git 目录中的 config 文件（即 `.git/config`）：针对该仓库。可以传递 `--local` 选项让 Git 强制读写此文件，虽然默认情况下用的就是它。

可以使用 `git config --list` 命令来列出所有 Git 当时能找到的配置。

```zsh
❯ git config --list
user.email=pluinyiasnhg@gmail.com
user.name=pluinyiasnhg
core.editor=vim
core.quotepath=false
http.https://github.com.proxy=http://127.0.0.1:7890
https.https://github.com.proxy=https://127.0.0.1:7890
credential.helper=store
```

由于 Git 会从多个文件中读取同一配置变量的不同值，因此你可能会在其中看到意料之外的值而不知道为什么。 此时，可以查询 Git 中该变量的原始值，它会显示哪一个配置文件最后设置了该值：`git config --show-origin <配置变量>`。

## 用户信息

设置用户名和邮件地址。 每一个 Git 提交都会使用到这些信息，它们会写入到你的每一次提交中，不可更改：

```zsh
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

想针对特定项目使用不同的用户名称与邮件地址时，可以在那个项目目录下运行没有 `--global` 选项的命令来配置。

## 默认编辑器

配置默认文本编辑器，当 Git 需要你输入信息时会调用它。 如果未配置，Git 会使用操作系统默认的文本编辑器。以 Emacs 为例：

```zsh
git config --global core.editor emacs
```

## 别名

Git 并不会在你输入部分命令时自动推断出你想要的命令。 如果不想每次都输入完整的 Git 命令，可以通过 git config 文件来轻松地为每一个命令设置一个别名。 这里有一些例子：

```zsh
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

例如，为了解决取消暂存文件的易用性问题，可以向 Git 中添加自己的取消暂存别名：`git config --global alias.unstage 'reset HEAD --'`。这会使下面的两个命令等价：

```zsh
git unstage fileA
# 等价于
git reset HEAD -- fileA
```

通常也会添加一个 last 命令 `git config --global alias.last 'log -1 HEAD'`。这样，可以轻松地看到最后一次提交：`git last`。

可以看出，Git 只是简单地将别名替换为对应的命令。 然而，你可能想要执行外部命令，而不是一个 Git 子命令。 如果是那样的话，可以在命令前面加入 `!` 符号。 比如 `git visual` 定义为 gitk 的别名：`git config --global alias.visual '!gitk'`。

## 获取帮助

以 git config 为例：

```zsh
git help config
git config --help
man git-config
```

##  Git 本地命令

git init 初始化本地库。创建后，当前目录出现一个 `.git` 文件夹。
`git reflog` 查看历史版本。
`git reset --hard` 切换版本。

Git 有三种状态：已修改、已暂存和已提交。

- 已修改表示修改了文件，但还没保存到数据库中。
- 已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。
- 已提交表示数据已经安全地保存在本地数据库中。

Git 工作流程：

1. 在工作区中修改文件。
2. 将想要下次提交的更改选择性地暂存，这样只会将更改的部分添加到暂存区。
3. 提交更新，找到暂存区的文件，将快照永久性存储到 Git 目录。

一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，可以创建一个名为 .gitignore 的文件，列出要忽略的文件的模式。

GitHub 有一个十分详细的针对数十种项目及语言的 .gitignore 文件列表， 可以在 https://github.com/github/gitignore 找到它。

![image.png](https://vip.123pan.cn/1844935313/obsidian/20250303120945551.png)

- `git init` 创建本地仓库
- `git clone` 克隆远程仓库
- `git status` 查看文件状态
- `git add` 跟踪文件或目录下的所有文件
- `git diff` 通过文件补丁的格式更加具体地显示哪些行发生改变
- `git commit` 创建节点，提交更新
- `git reset` 本地仓库撤销节点。远程仓库撤销节点是 `git revert`
- `git rm` 移除文件，有两种：从 git 中移除和从磁盘移除
- `git mv` 重命名文件
- `git log` 查看提交历史
- 撤销操作：`git commit --amend`、`git reset HEAD <file>`、`git checkout -- <file>`
- 远程仓库：`git remote`、`git fetch`、`git pull`、`git push`
- `git tag` 打标签

### git clone

克隆远程仓库的时候，可以自定义本地仓库的名字，如 `git clone https://github.com/libgit2/libgit2 mylibgit`，仓库所在目录名变为了 mylibgit。

### git add

`git add` 命令是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。 将这个命令理解为“精确地将内容添加到下一次提交中”而不是“将一个文件添加到项目中”要更加合适。

### git diff

`git diff --staged` 命令查看已暂存的将要添加到下次提交里的内容。 这条命令将比对已暂存文件与最后一次提交的文件差异。

注意，git diff 本身只显示尚未暂存的改动，而不是自上次提交以来所做的所有改动。 所以有时候你一下子暂存了所有更新过的文件，运行 git diff 后却什么也没有，就是这个原因。

### git commit

`git commit` 提交时记录的是放在暂存区域的快照。 任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。 每一次运行提交操作，都是对项目作一次快照，以后可以回到这个状态，或者进行比较。

Git 提供了一个跳过使用暂存区域的方式， 只要在提交的时候，使用 `git commit -a`，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add 步骤。

### git rm

`git rm` 命令用于移除文件，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。下一次提交时，该文件就不再纳入版本管理了。 

要删除之前修改过或已经放到暂存区的文件，则必须使用强制删除选项 `-f`（force 的首字母）。 这是一种安全特性，用于防止误删尚未添加到快照的数据。

另一种情况是，我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。 换句话说，想让文件保留在磁盘，但是并不想让 Git 继续跟踪。 当你忘记添加 .gitignore 文件，不小心把一个很大的日志文件或一堆 .a 这样的编译生成文件添加到暂存区时，这一做法尤其有用。 为达到这一目的，使用 `--cached` 选项。

> 不建议用 `git rm` ，而是用 `.gitignore` 。

```zsh
# 对于 Java 项目
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Java.gitignore
```

### git mv

运行 git mv 就相当于运行了下面三条命令。如此分开操作，Git 也会意识到这是一次重命名。 

```zsh
mv README.md README
git rm README.md
git add README
```

### git log

`git log` 会按时间先后顺序列出所有的提交，最近的更新排在最上面。 这个命令会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明。

其中一个比较有用的选项是 `-p` 或 `--patch` ，它会显示每次提交所引入的差异（按补丁的格式输出）。 你也可以限制显示的日志条目数量，例如使用 -2 选项来只显示最近的两次提交：`git log -p -2`。

可以为 git log 附带一系列的总结性选项。 比如想看到每次提交的简略统计信息，可以使用 `--stat` 选项。--stat 选项在每次提交的下面列出所有被修改过的文件、有多少文件被修改了以及被修改过的文件的哪些行被移除或是添加了。 在每次提交的最后还有一个总结。

当 oneline 或 format 与另一个 log 选项 `--graph` 结合使用时尤其有用。 这个选项添加了一些 ASCII 字符串来形象地展示你的分支、合并历史：`git log --pretty=format:"%h %s" --graph` 。

| `git log` 常用选项  | 说明                                                                   |
| --------------- | -------------------------------------------------------------------- |
| `-p`            | 按补丁格式显示每个提交引入的差异                                                     |
| `--stat`        | 显示每次提交的文件修改统计信息                                                      |
| --shortstat     | 只显示 --stat 中最后的行数修改添加移除统计                                            |
| --name-only     | 仅在提交信息后显示已修改的文件清单                                                    |
| --name-status   | 显示新增、修改、删除的文件清单                                                      |
| --abbrev-commit | 仅显示 SHA-1 校验和所有 40 个字符中的前几个字符                                        |
| --relative-date | 使用较短的相对时间而不是完整格式显示日期（比如“2 weeks ago”）                                |
| `--graph`       | 在日志旁以 ASCII 图形显示分支与合并历史                                              |
| `--pretty`      | 使用其他格式显示历史提交信息。可用的选项包括 oneline、short、full、fuller 和 format（用来定义自己的格式） |
| --oneline       | --pretty=oneline --abbrev-commit 合用的简写                               |
| `--no-merges`   | 隐藏合并提交，避免显示的合并提交弄乱历史记录                                               |

`--pretty=format` 可以定制记录的显示格式。 这样的输出对后期提取分析格外有用。

| `format` 常用选项 | 说明                          |
| ------------- | --------------------------- |
| %H            | 提交的完整哈希值                    |
| %h            | 提交的简写哈希值                    |
| %T            | 树的完整哈希值                     |
| %t            | 树的简写哈希值                     |
| %P            | 父提交的完整哈希值                   |
| %p            | 父提交的简写哈希值                   |
| %an           | 作者名字                        |
| %ae           | 作者的电子邮件地址                   |
| %ad           | 作者修订日期（可以用 --date=选项 来定制格式） |
| %ar           | 作者修订日期，按多久以前的方式显示           |
| %cn           | 提交者的名字                      |
| %ce           | 提交者的电子邮件地址                  |
| %cd           | 提交日期                        |
| %cr           | 提交日期（距今多长时间）                |
| %s            | 提交说明                        |

这里的作者指的是实际作出修改的人，提交者指的是最后将此工作成果提交到仓库的人。

### 撤消操作

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有 `--amend` 选项的提交命令来重新提交：`git commit --amend`。这个命令会将暂存区中的文件提交。 如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令）， 那么快照会保持不变，而你所修改的只是提交信息。

当你在修补最后的提交时，与其说是修复旧提交，倒不如说是完全用一个新的提交替换旧的提交。从效果上来说，就像是旧有的提交从未存在过一样，它并不会出现在仓库的历史中。修补提交最明显的价值是可以稍微改进你最后的提交，而不会让“啊，忘了添加一个文件”或者 “小修补，修正笔误”这种提交信息弄乱你的仓库历史。

`git reset HEAD <file>` 取消暂存的文件。 

`git checkout -- <file>` 撤消对文件的修改。 你对那个文件在本地的任何修改都会消失——Git 会用最近提交的版本覆盖掉它。 除非确实清楚不想要对那个文件的本地修改了，否则不要使用这个命令。

记住，在 Git 中任何**已提交**的东西几乎总是可以恢复的。 甚至那些被删除的分支中的提交或使用 --amend 选项覆盖的提交也可以恢复。 然而，任何未提交的东西丢失后很可能再也找不到了。

### 远程仓库
 
 `git remote` 命令会列出你指定的每一个远程服务器的简写。 如果你已经克隆了自己的仓库，那么至少应该能看到 origin ，这是 Git 给克隆的仓库服务器的默认名字。指定选项 `-v`，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL。

`git remote add <shortname> <url>` 会添加一个新的远程 Git 仓库，同时指定一个方便使用的简写：

```zsh
$ git remote origin
$ git remote add pb https://github.com/paulboone/ticgit
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
pb     https://github.com/paulboone/ticgit (fetch)
pb     https://github.com/paulboone/ticgit (push)
```

现在你可以在命令行中使用字符串 pb 来代替整个 URL。 例如，如果你想拉取 Paul 的仓库中有但你没有的信息，可以运行 git fetch pb。

注意 `git fetch` 命令只会将数据下载到你的本地仓库——它并不会自动合并或修改你当前的工作。 当准备好时你必须手动将其合并入你的工作。

如果你的当前分支设置了跟踪远程分支， 那么可以用 `git pull` 命令来自动抓取后合并该远程分支到当前分支。

`git push <remote> <branch>`。 当你想要将 master 分支推送到 origin 服务器时， 那么运行这个命令就可以将你所做的备份到服务器：`git push origin master`。只有当你有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。

如果想要查看某一个远程仓库的更多信息，可以使用 `git remote show <remote>` 命令。 

`git remote rename` 用来修改一个远程仓库的简写名。 例如，想要将 pb 重命名为 paul，可以用 `git remote rename pb paul`。

如果因为一些原因想要移除一个远程仓库——你已经从服务器上搬走了或不再想使用某一个特定的镜像了， 又或者某一个贡献者不再贡献了——可以使用 `git remote remove` 或 `git remote rm`。 一旦你使用这种方式删除了一个远程仓库，那么所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除。

### git tag

像其他版本控制系统一样，Git 可以给仓库历史中的某一个提交打上标签，以示重要。 比较有代表性的是人们会使用这个功能来标记发布结点（ v1.0 、v2.0 等等）。

- 列出已有的标签 `git tag`（可选 -l 或 --list选项 ）
- 查看标签信息和与之对应的提交信息 `git show v1.4`

#创建标签

Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。而附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间， 此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证。 通常会建议创建附注标签，这样你可以拥有以上所有信息。但是如果你只是想用一个临时的标签， 或者因为某些原因不想要保存这些信息，那么也可以用轻量标签。

- 创建附注标签：指定 `-a` 选项 `git tag -a v1.4 -m "my version 1.4"`
- 创建轻量标签：提供标签名字 `git tag v1.5`。轻量标签本质上是将提交校验和存储到一个文件中——没有保存任何其他信息

后期打标签。假设在 v1.2 时你忘记给项目打标签，也就是在 “updated rakefile” 提交。 你可以在之后补上标签。 要在那个提交上打标签，你需要在命令的末尾指定提交的校验和（或部分校验和）：`git tag -a v1.2 9fceb02`。

#共享标签

默认情况下，git push 命令并不会传送标签到远程仓库服务器上。 在创建完标签后你必须显式地用`git push origin <tagname>`推送标签到共享服务器上。这个过程就像共享远程分支一样。

想要一次性推送多个标签，可以使用 `--tags` 选项。 这将会把所有不在远程仓库服务器上的标签全部传送到那里。推送标签并不会区分轻量标签和附注标签， 没有简单的选项能够让你只选择推送一种标签。

#删除标签

要删除掉你本地仓库上的标签，可以使用命令 `git tag -d <tagname>`。 注意，这并不会从任何远程仓库中移除这个标签，必须用 `git push <remote> :refs/tags/<tagname>` 来更新远程仓库。含义是，将冒号前面的空值推送到远程标签名，从而高效地删除它。

还有一种更直观的删除远程标签的方式是：`git push origin --delete <tagname>`。

#检出标签

查看某个标签所指向的文件版本，可以使用 `git checkout` 命令， 这会使你的仓库处于“分离头指针（detached HEAD）”的状态，这个状态有些不好的副作用：

在“分离头指针”状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问。 因此，如果你需要进行更改，比如你要修复旧版本中的错误，那么通常需要创建一个新分支：`git checkout -b version2 v2.0.0`。如果在这之后又进行了一次提交，version2 分支就会因为这个改动向前移动， 此时它就会和 v2.0.0 标签稍微有些不同，这时就要当心了。


创建分支：

```git
git branch <new-branch>
```

移动分支指向的节点，有直接引用和间接引用两种方式

```git
git branch -f <branch> <node>

git branch -f <branch> HEAD~<number>
```

切换分支：切换到已存在的分支，或者创建新分支并切换到新分支上

```git
git checkout <branch>

git checkout -b <new-branch>
```

合并分支：假设当前在 main 分支上

-  `git rebase <branch1> <branch2>` 。`<branch2>`分支的节点拷贝一份到 `<branch1>` 分支后面，就好像自始至终只有一个 `<branch1>` 分支。
- `git rebase -i HEAD~<number>` 。选取HEAD往上的`<number>`个节点，打开 UI 界面，任意调整顺序、删除节点。
- `git cherry-pick <c1> <c2>` 。 将指定的节点，如`c1、c2`，拷贝一份到 `main` 分支上。这里的 `c1、c2` 代指节点的 hash值。

移动 HEAD 指向的节点，与移动分支指向的节点类似，也有直接引用和间接引用两种。

```git
git checkout <branch>~<number>
```

多条命令可以集中在一行内执行，用 `;` 隔开多条命令。

远程操作

- `git clone`
- `git fetch` 拉取远程仓库内容，但不合并——本地仓库还是之前的文件
- `git pull` 拉取远程仓库内容，并合并——本地仓库文件完成远程同步
- `git push` 上传到远程仓库，并合并
	- `git push <remote> <source>` 比如，将 fool 分支推送到 origin，前提是本地有 origin/fool
	- `git push <remote> <source>:<destination>` 去除了 “前提是本地有...”的条件


> [!info] 
> `git pull` 是 fetch 和 merge 的缩写
> `git pull --rebase` 是 fetch 和 rebase 的缩写
> 直观的区别是 `git pull` 下的远程仓库是多个分支的，`git pull --rebase` 下是单个分支的

设置远程追踪分支，默认是本地的 main 追踪 origin/main，但实际上可以让任意的本地分支追踪 origin/main。

- `git checkout -b <branch> origin/main` 
- `git branch -u origin/main <branch>`

注释

- `git tag`
- `git describe <ref>`

# 将本地仓库推送到 GitHub

1. 在 GitHub 上创建新仓库

- 登录 GitHub
- 点击右上角 "+" → "New repository"
- 输入仓库名称（建议与本地仓库同名）
- 不要初始化 README、.gitignore 或 license（因为本地已有内容）
- 点击 "Create repository"

2. 下面过程，可以在新仓库主页看到。主页会提示，是创建一个新仓库，还是推送一个本地仓库。

```zsh
# 查看当前远程仓库（初始应为空）
git remote -v

# 添加远程仓库
git remote add origin git@github.com:pluinyiasnhg/JavaBasis.git

# 创建分支 main
git branch -M main

# 推送代码
git push -u origin main

# 后续推送只需
git push
```

# 参考

- 网页小游戏学 git [Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN)
- https://wyag.thb.lt/
- [Git 命令列表](https://git-scm.com/docs)。