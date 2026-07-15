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

# 版本控制系统

## 本地版本控制系统

人们很久以前就开发了许多种本地版本控制系统，大多都是采用某种简单的数据库来记录文件的历次更新差异。

## CVCS

如何让在不同系统上的开发者协同工作？ 集中化的版本控制系统（Centralized Version Control Systems，CVCS）应运而生。 诸如 CVS、Subversion 以及 Perforce 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。 

> 想起了共享云文档

CVCS 显而易见的缺点是中央服务器的单点故障。 如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。 如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据，包括项目的整个变更历史，只剩下人们在各自机器上保留的单独快照。 本地版本控制系统也存在类似问题，只要整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险。

## DVCS

分布式版本控制系统（Distributed Version Control System，DVCS）。 在这类系统中，像 Git、Mercurial 以及 Darcs 等，客户端并不只提取最新版本的文件快照， 而是把代码仓库完整地镜像下来，包括完整的历史记录。 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份。

Git 和其它VCS的主要差别在于 Git 对待数据的方式——**直接记录快照，而非差异比较**。

从概念上来说，其它大部分VCS以文件变更列表的方式存储信息，这类系统将它们存储的信息看作是一组基本文件和每个文件随时间逐步累积的差异 （它们通常称作 基于差异（delta-based） 的版本控制）。

反之，Git 更像是把数据看作是对小型文件系统的一系列快照。 在 Git 中，每当你提交更新或保存项目状态时，它基本上就会对当时的全部文件创建一个快照并保存这个快照的索引。 为了效率，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。 

## Git 特点

- Git 近乎所有操作都是本地执行。因为在本地磁盘上就有项目的完整历史，所以**大部分操作看起来瞬间完成**
- Git 保证完整性。Git 中所有的数据在存储前都计算校验和，然后以校验和来引用。 这意味着不可能在 Git 不知情时更改任何文件内容或目录内容
- Git 数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名git config --list
- Git 只添加数据。Git 几乎不会执行任何可能导致文件不可恢复的操作。 同别的 VCS 一样，未提交更新时有可能丢失或弄乱修改的内容。但是一旦你提交快照到 Git 中， 就难以再丢失数据

# Git 设置

## 检查配置信息

Git 自带一个 `git config` 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：

1. `/etc/gitconfig` 包含系统上每一个用户及他们仓库的通用配置。如果在执行 git config 时带上 `--system` 选项，那么它就会读写该文件中的配置变量（由于它是系统配置文件，因此需要超级用户权限来修改它）
2. `~/.gitconfig` 或 `~/.config/git/config` 只针对当前用户。 可以传递 `--global` 选项让 Git 读写此文件，这会对你系统上所有的仓库生效。
3. 当前使用仓库的 Git 目录中的 config 文件（即 `.git/config`）：针对该仓库。可以传递 `--local` 选项让 Git 强制读写此文件，虽然默认情况下用的就是它。

`git config --list` 列出 Git 所有能找到的配置。

```zsh
❯ git config --list
user.name=pluinyiasnhg
user.email=pluinyiasnhg@gmail.com
core.editor=vim
credential.helper=/usr/lib/git-core/git-credential-libsecret
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

配置默认文本编辑器，当 Git 需要你输入信息时会调用它。 

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

若你使用 Git 时需要获取帮助，有三种等价的方法可以找到 Git 命令的综合手册（manpage）：

```zsh
git help <verb>
git <verb> --help
man git-<verb>
```

此外，如果你不需要全面的手册，只需要可用选项的快速参考，那么可以用 `-h` 选项获得更简明的输出：

```zsh
git <verb> -h
```

#  Git 本地命令

Git 有三种状态：已修改、已暂存和已提交。

- 已修改，表示修改了文件，但还没保存到数据库中。
- 已暂存，表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。
- 已提交，表示数据已保存到本地数据库中。

![文件的状态变化周期](https://vip.123pan.cn/1844935313/obsidian/20250303120945551.png)

Git 工作流程：

1. 在工作区中修改文件。
2. 将想要下次提交的更改选择性地暂存，这样只会将更改的部分添加到暂存区。
3. 提交更新，找到暂存区的文件，将快照永久性存储到 Git 目录。

一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，可以创建一个名为 `.gitignore` 的文件，列出要忽略的文件的模式。

GitHub 有一个十分详细的针对数十种项目及语言的 .gitignore 文件列表， 可以在 https://github.com/github/gitignore 找到它。

一个 .gitignore 文件的例子：

```
# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

- `git init` 创建本地仓库
- `git clone` 克隆远程仓库
- `git status` 查看文件状态
- `git add` 精确地将内容添加到下一次提交中
- `git diff` 通过文件补丁的格式更加具体地显示哪些行发生改变
- `git commit` 创建节点，提交更新
- `git reset` 本地仓库撤销节点。远程仓库撤销节点是 `git revert`
- `git rm` 移除文件，有两种：从 git 中移除和从磁盘移除
- `git mv` 重命名文件
- `git log` 查看提交历史
- 撤销操作：`git commit --amend`、`git reset HEAD <file>`、`git checkout -- <file>`
- 远程仓库：`git remote`、`git fetch`、`git pull`、`git push`
- `git tag` 打标签

`git reflog` 查看历史版本。
`git reset --hard` 切换版本。

### git clone

克隆远程仓库的时候，可以自定义本地仓库的名字，如 `git clone https://github.com/libgit2/libgit2 mylibgit`，仓库所在目录名变为了 mylibgit。

### git status

 git status 有一个选项 `-s` 或 `--short` 可以帮你缩短状态命令的输出，这样可以以简洁的方式查看更改。 

```zsh
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```

输出中有两栏，左栏指明了暂存区的状态，右栏指明了工作区的状态。

新添加的未跟踪文件前面有 ?? 标记，新添加到暂存区中的文件前面有 A 标记，修改过的文件前面有 M 标记。

例如，上面的状态报告显示： README 文件在工作区已修改但尚未暂存，而 lib/simplegit.rb 文件已修改且已暂存。 Rakefile 文件已修改，暂存后又作了修改。

### git add

`git add` 命令是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。 将这个命令理解为“精确地将内容添加到下一次提交中”而不是“将一个文件添加到项目中”要更加合适。

### git diff

`git diff` 命令比较的是工作目录中当前文件和暂存区域快照之间的差异。 也就是修改之后还没有暂存起来的变化内容。

```
❯ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   CONTRIBUTING.md

❯ git diff
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index ba6cbf7..56a54fd 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -1 +1,2 @@
 You and I
+You and I
```

若要查看已暂存的将要添加到下次提交里的内容，可以用 `git diff --staged` 命令。 这条命令将比对已暂存文件与最后一次提交的文件差异：

```
❯ git diff --staged
diff --git a/README b/README
index 072be97..34d4183 100644
--- a/README
+++ b/README
@@ -1,2 +1,3 @@
 My Project
 My Project
+My Project
```

### git commit

`git commit` 启动你选择的文本编辑器来输入提交说明。

```
❯ git commit
<光标所在处>
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# Changes to be committed:
#	modified:   CONTRIBUTING.md
#	modified:   README
#
```

更详细的内容修改提示可以用 `-v` 选项查看，这会将你所作的更改的 diff 输出呈现在编辑器，以便让你知道本次提交具体作出哪些修改。

```
❯ git commit -v
<光标所在处>
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# Changes to be committed:
#	modified:   CONTRIBUTING.md
#	modified:   README
#
# ------------------------ >8 ------------------------
# Do not modify or remove the line above.
# Everything below it will be ignored.
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index ba6cbf7..56a54fd 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -1 +1,2 @@
 You and I
+You and I
diff --git a/README b/README
index 072be97..34d4183 100644
--- a/README
+++ b/README
@@ -1,2 +1,3 @@
 My Project
 My Project
+My Project
```

也可以在 `git commit -m` ，将提交信息与命令放在同一行

```
❯ git commit -m "test: git commit"
[master 2cf5d25] test: git commit
 2 files changed, 2 insertions(+)
```

跳过使用暂存区域。`git commit -a` 会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add 步骤。

### git rm

`git rm` 命令用于**移除文件**，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。下一次提交时，该文件就不再纳入版本管理了。 

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

## git push

如果是第一次推送，需要进行登录，登录所需的密码可以是Personal Access Token或者SSH Key。

```zsh
# 生成 SSH key
ssh-keygen -t ed25519 -C "pluinyiasnhg@gmail.com"

# 把公钥加到 GitHub
cat ~/.ssh/id_ed25519.pub
# 将输出内容复制到 GitHub Settings → SSH and GPG keys → New SSH key

# 把仓库地址改成SSH
git remote set-url origin git@github.com:pluinyiasnhg/pluinyiasnhg.github.io.git

# 以后push，就不用输账号/密码了
git push
```

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



Git 分支

Figure 1. 首次提交对象及其树结构

Figure 3. 分支及其提交历史

Figure 13. 基于 master 分支的紧急问题分支 hotfix branch

Figure 17. 一个合并提交

Figure 16. 一次典型合并中所用到的三个快照
想法:合并前，head 在master上，合并后，master向前

Figure 22. 克隆之后的服务器与本地仓库

分支简介

把当前版本的文件快照保存到 Git 仓库中 （Git 使用 blob 对象来保存它们）

当使用 git commit 进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和， 然后在 Git 仓库中这些校验和保存为树对象。随后，Git 便会创建一个提交对象， 它除了包含上面提到的那些信息外，还包含指向这个树对象（项目根目录）的指针。

Git 仓库中有五个对象：三个 blob 对象（保存着文件快照）、一个 树 对象 （记录着目录结构和 blob 对象索引）以及一个 提交 对象（包含着指向前述树对象的指针和所有提交信息）。

Git 的分支，其实本质上仅仅是指向提交对象的可变指针。 Git 的默认分支名字是 master。 在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 master 分支。 master 分支会在每次提交时自动向前移动。

分支创建

Git 是怎么创建新分支的呢？ 很简单，它只是为你创建了一个可以移动的新的指针。 比如，创建一个 testing 分支， 你需要使用 git branch 命令：$ git branch testing

Git 又是怎么知道当前在哪一个分支上呢？ 也很简单，它有一个名为 HEAD 的特殊指针。 请注意它和许多其它版本控制系统（如 Subversion 或 CVS）里的 HEAD 概念完全不同。 在 Git 中，它是一个指针，指向当前所在的本地分支（译注：将 HEAD 想象为当前分支的别名）。

你可以简单地使用 git log 命令查看各个分支当前所指的对象。 提供这一功能的参数是 --decorate。$ git log --oneline --decorate

分支切换

要切换到一个已存在的分支，你需要使用 git checkout 命令。 我们现在切换到新创建的 testing 分支去：$ git checkout testing
这样 HEAD 就指向 testing 分支了。

使用 git log 命令查看分叉历史。 运行 git log --oneline --decorate --graph --all ，它会输出你的提交历史、各个分支的指向以及项目的分支分叉情况。

由于 Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。 创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符），如此的简单能不快吗？
这与过去大多数版本控制系统形成了鲜明的对比，它们在创建分支时，将所有的项目文件都复制一遍，并保存到一个特定的目录。

创建新分支的同时切换过去
通常我们会在创建一个新分支后立即切换过去，这可以用 git checkout -b <newbranchname> 一条命令搞定。

新建分支

它是下面两条命令的简写：$ git branch iss53
$ git checkout iss53

但是，在你这么做之前，要留意你的工作目录和暂存区里那些还没有被提交的修改， 它可能会和你即将检出的分支产生冲突从而阻止 Git 切换到该分支。 最好的方法是，在你切换分支之前，保持好一个干净的状态。 有一些方法可以绕过这个问题（即，贮藏（stashing） 和 修补提交（commit amending））， 我们会在 贮藏与清理 中看到关于这两个命令的介绍。 现在，我们假设你已经把你的修改全部提交了，这时你可以切换回 master 分支了：
想法:切换分支前，把暂存区的内容保存为快照。防丢失和冲突。

后将 hotfix 分支合并回你的 master 分支来部署到线上。 你可以使用 git merge 命令来达到上述目的：$ git checkout master
$ git merge hotfix

当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做 “快进（fast-forward）”。

可以使用带 -d 选项的 git branch 命令来删除分支：$ git branch -d hotfix
想法:删除分支类似删除指针，删除一个对节点的引用

可以使用 git merge master 命令将 master分支合并入 iss53 分支，或者你也可以等到 iss53 分支完成其使命，再将其合并回 master 分支。

分支的合并

master 分支所在提交并不是 iss53 分支所在提交的直接祖先，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照（C4 和 C5）以及这两个分支的公共祖先（C2），做一个简单的三方合并。
想法:此时无法用 fast forward

和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。 这个被称作一次合并提交，

既然你的修改已经合并进来了，就不再需要 iss53 分支了。 现在你可以在任务追踪系统中关闭此项任务，并删除这个分支。$ git branch -d iss53

遇到冲突时的分支合并

合并冲突后的任意时刻使用 git status 命令来查看那些因包含合并冲突而处于未合并（unmerged）状

Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html

上述的冲突解决方案仅保留了其中一个分支的修改，并且 <<<<<<< , ======= , 和 >>>>>>> 这些行被完全删除了。 在你解决了所有文件里的冲突之后，对每个文件使用 git add 命令来将其标记为冲突已解决。 一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。
如果你想使用图形化工具来解决冲突，你可以运行 git mergetool，该命令会为你启动一个合适的可视化合并工具，并带领你一步一步解决这些冲突：

等你退出合并工具之后，Git 会询问刚才的合并是否成功。 如果你回答是，Git 会暂存那些文件以表明冲突已解决： 你可以再次运行 git status 来确认所有的合并冲突都已被解决：

分支管理

git branch 命令不只是可以创建与删除分支。 如果不加任何参数运行它，会得到当前所有分支的一个列表：

如果需要查看每一个分支的最后一次提交，可以运行 git branch -v 命令：

--merged 与 --no-merged 这两个有用的选项可以过滤这个列表中已经合并或尚未合并到当前分支的分支。 如果要查看哪些分支已经合并到当前分支，可以运行 git branch --merged：$ git branch --merged
  iss53
* master
因为之前已经合并了 iss53 分支，所以现在看到它在列表中。 在这个列表中分支名字前没有 * 号的分支通常可以使用 git branch -d 删除掉；你已经将它们的工作整合到了另一个分支，所以并不会失去任何东西。
查看所有包含未合并工作的分支，可以运行 git branch --no-merged：$ git branch --no-merged
  testing
这里显示了其他分支。 因为它包含了还未合并的工作，尝试使用 git branch -d 命令删除它时会失败：

如果真的想要删除分支并丢掉那些工作，如同帮助信息里所指出的，可以使用 -D 选项强制删除它。

上面描述的选项 --merged 和 --no-merged 会在没有给定提交或分支名作为参数时， 分别列出已合并或未合并到 当前 分支的分支。

主题分支

主题分支对任何规模的项目都适用。 主题分支是一种短期分支，它被用来实现单一特性或其相关工作。

你在上一节用到的主题分支（iss53 和 hotfix 分支）中提交了一些更新，并且在它们合并入主干分支之后，你又删除了它们。 这项技术能使你快速并且完整地进行上下文切换（context-switch）

远程分支

远程跟踪分支是远程分支状态的引用。它们是你无法移动的本地引用。一旦你进行了网络通信， Git 就会为你移动它们以精确反映远程仓库的状态。请将它们看做书签， 这样可以提醒你该分支在远程仓库中的位置就是你最后一次连接到它们的位置。
它们以 <remote>/<branch> 的形式命名。 例如，如果你想要看你最后一次与远程仓库 origin 通信时 master 分支的状态，你可以查看 origin/master 分支。 你与同事合作解决一个问题并且他们推送了一个 iss53 分支，你可能有自己的本地 iss53 分支， 然而在服务器上的分支会以 origin/iss53 来表示。

远程仓库名字 “origin” 与分支名字 “master” 一样，在 Git 中并没有任何特别的含义一样。 同时 “master” 是当你运行 git init 时默认的起始分支名字，原因仅仅是它的广泛使用， “origin” 是当你运行 git clone 时默认的远程仓库名字。 如果你运行 git clone -o booyah，那么你默认的远程分支名字将会是 booyah/master。
