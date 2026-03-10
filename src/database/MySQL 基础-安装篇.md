---
title: MySQL 基础-安装篇
date: 2026-03-10
tags:
  - MySQL
category:
  - 数据库
---
# 前言

学习尚硅谷的[《MySQL数据库入门到大牛，mysql安装到优化》](https://www.bilibili.com/video/BV1iq4y1u7vj)的分集1~11和96~103。

数据库概述与MySQL安装篇

- 第01章：数据库概述
- 第02章：MySQL环境搭建

<!-- more -->

MySQL数据库基础篇分为5个篇章：

1. 数据库概述与MySQL安装篇
	- 第01章：数据库概述
	- 第02章：MySQL环境搭建
2. SQL之SELECT使用篇
	- 第03章：基本的SELECT语句
	- 第04章：运算符
	- 第05章：排序与分页
	- 第06章：多表查询
	- 第07章：单行函数
	- 第08章：聚合函数
	- 第09章：子查询
3. SQL之DDL、DML、DCL使用篇
	- 第10章：创建和管理表
	- 第11章：数据处理之增删改
	- 第12章：MySQL数据类型精讲
	- 第13章：约束
4. 其它数据库对象篇
	- 第14章：视图
	- 第15章：存储过程与函数
	- 第16章：变量、流程控制与游标
	- 第17章：触发器
5. MySQL8 新特性篇
	- 第18章：MySQL8其它新特性

# 第01章：数据库概述

数据库概念：

- DB：数据库（Database），即存储数据的“仓库”，其本质是一个文件系统。它保存了一系列有组织的数据。
- DBMS：数据库管理系统（Database Management System），是一种操纵和管理数据库的大型软件，用于建立、使用和维护数据库，对数据库进行统一管理和控制。用户通过数据库管理系统访问数据库中表内的数据。
- SQL：结构化查询语言（Structured Query Language），专门用来与数据库通信的语言。

## 关系型数据库

关系型数据库(RDBMS)：

- 关系型数据库以 行(row) 和 列(column) 的形式存储数据，以便于用户理解。这一系列的行和列被称为 表(table) ，一组表组成了一个库(database)。
- 表与表之间的数据记录有关系(relationship)。现实世界中的各种实体以及实体之间的各种联系均用 `关系模型` 来表示。关系型数据库，就是建立在 关系模型 基础上的数据库。
- `SQL` 就是关系型数据库的查询语言。

## 非关系型数据库

非关系型数据库 NoSQL，可看成传统关系型数据库的功能阉割版本 ，基于键值对存储数据，不需要经过SQL层的解析， 性能非常高 。同时，通过减少不常用的功能，进一步提高性能。具体分为：

- **键值型数据库**。数据库通过 Key-Value 键值的方式来存储数据。典型代表是 `Redis`。
	- 优点是查找速度快，缺点是无法像关系型数据库一样使用条件过滤（比如 WHERE），如果你不知道去哪里找数据，就要遍历所有的键，这就会消耗大量的计算。键值型数据库典型的使用场景是作为 `内存缓存` 。
- **文档型数据库**。此类数据库可存放并获取文档，可以是XML、JSON等格式。在数据库中文档作为处理信息的基本单位，一个文档就相当于一条记录。典型代表是 `MongoDB`
- **搜索引擎数据库**。虽然关系型数据库采用了索引提升检索效率，但是针对全文索引效率却较低。搜索引擎数据库是应用在搜索引擎领域的数据存储形式。典型代表是 `Elasticsearch`
- **列式数据库**。列式数据库是相对于行式存储的数据库，列式数据库是将数据按照列存储到数据库中。典型代表是 `HBase`
	- 好处是可以大量降低系统的I/O，适合于分布式文件系统，不足在于功能相对有限。
- **图形数据库**。图形数据库利用了图这种数据结构存储了实体（对象）之间的关系。关系型数据用于存储明确关系的数据，但对于复杂关系的数据存储却有些力不从心。如社交网络中人物之间的关系。典型代表是 `Neo4j`

> NoSQL 对 SQL 做出了很好的补充，比如实际开发中，有很多业务需求，其实并不需要完整的关系型数据库功能，非关系型数据库的功能就足够使用了。这种情况下，使用 性能更高 、 成本更低 的非关系型数据库当然是更明智的选择。比如：日志收集、排行榜、定时器等。

## 关系型数据库设计规则

E-R（entity-relationship，实体-联系）模型中有三个主要概念是：实体集、属性、联系集。

- 一个`实体集（class）`对应于数据库中的一个`表（table）`，
- 一个`实体（instance）`则对应于数据库表中的一行（row），也称为一条`记录（record）`。
- 一个`属性（attribute）`对应于数据库表中的一列（column），也称为一个`字段（field）`。
- 表与表之间的数据记录有`关系(relationship)`。现实世界中的各种实体以及实体之间的各种联系均用关系模型来表示。有下列四种关系：
	-  `一对一关联`在实际的开发中应用不多，因为一对一可以创建成一张表。
	-  `一对多关系`，常见实例场景：客户表和订单表，部门表和员工表。
	- `多对多关系`，需要第三个表，该表通常称为联接表，它将多对多关系划分为两个一对多关系。将这两个表（学生信息表、课程信息表）的主键都插入到第三个表（选课信息表）中。
	- `自我引用`(Self reference)

![关系型数据库的表结构](https://vip.123pan.cn/1844935313/obsidian/20260309203806240.png)

> [!info] ORM思想 (Object Relational Mapping)体现：
> 数据库中的一个表 <---> Java中的一个类
> 表中的一条数据 <---> 类中的一个对象（或实体）
> 表中的一个列 <----> 类中的一个字段、属性(field)

# 第02章：MySQL环境搭建

## MySQL安装

参考MySQL官方教程[2.2 Installing MySQL on Unix/Linux Using Generic Binaries](https://dev.mysql.com/doc/refman/8.0/en/binary-installation.html)安装MySQL。

```zsh
# mysql依赖libaio，我的系统上已经自带了libaio
sudo pacman -S libaio
```

官网下载地址：https://dev.mysql.com/downloads/mysql/。解压 mysql-8.0.45-linux-glibc2.28-x86_64.tar.xz 后得到如下内容：

```zsh
.
├── bin      # mysqld server, client and utility programs
├── docs     # MySQL manual in Info format
├── include  # Include (header) files 
├── lib      # Libraries
├── LICENSE   
├── man      # Unix manual pages
├── README
├── share    # Error messages, dictionary, and SQL for database installation
└── support-files  # Miscellaneous(各种各样的) support files
```

创建mysql用户和用户组：

```zsh
sudo groupadd mysql
# 因为用户仅用于拥有权目的，而非登录目的，
# 所以useradd命令使用-r和-s /bin/false选项来创建一个没有登录权限的服务器主机用户。
# 如果useradd不支持这些选项，则可以省略它们。
sudo useradd -r -g mysql -s /bin/false mysql
```

解压mysql压缩包到 `/opt/` 目录下，重命名为更简洁的名字：

```zsh
sudo mv ~/Downloads/mysql-8.0.45-linux-glibc2.28-x86_64 /opt/
sudo mv mysql-8.0.45-linux-glibc2.28-x86_64 mysql
```

建立符号链接，添加环境变量：

```zsh
cd /usr/local
sudo ln -s /opt/mysql mysql
export PATH=$PATH:/usr/local/mysql/bin  # 记得保存到配置文件，比如.zshrc中
```

创建并初始化数据目录：

```zsh
cd /usr/local/mysql

# secure_file_priv 系统变量的目录，专门存放导入/导出文件（如 LOAD DATA INFILE 或 SELECT ... INTO OUTFILE）。
mkdir mysql-files
sudo chown mysql:mysql mysql-files
sudo chmod 750 mysql-files

# 数据目录
sudo chown -R mysql:mysql /opt/mysql
sudo chmod 750 /opt/mysql

# 初始化
bin/mysqld --initialize --user=mysql
# A temporary password is generated for root@localhost: 9lXH,CiuxF9k
```

遇到问题：mysql: error while loading shared libraries: libncurses.so.6: cannot open shared object file: No such file or directory

```zsh
# 在 Arch Linux 中，官方库文件通常命名为 `libncursesw.so.6`。如果你的 MySQL 程序由于硬编码只找 `libncurses.so.6`，可以通过创建软链接来重定向
ll /usr/lib/libncur*
sudo ln -s /usr/lib/libncursesw.so.6 /usr/lib/libncurses.so.6
```

启动MySQL服务器，首次登录修改初始密码：

```zsh
sudo bin/mysqld_safe --user=mysql & # 后台
# sudo bin/mysqld_safe --user=mysql --console # 前台

# MySQL登录
# 如果是连接本机： -hlocalhost就可以省略，
# 如果端口号没有修改：-P3306也可以省略
# mysql -h 主机名 -P 3306 -u 用户名 -p密码
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
```

> 如果启动服务器失败，出现 Failed to set datadir to '/opt/mysql/data/' (OS errno: 13 - Permission denied)，那么将 `/opt/mysql/data/` 加入mysql用户和组 `sudo chown -R mysql:mysql /opt/mysql` 。

### 设置开机自启

为 MySQL 手动创建一个 Systemd Service 文件：

```zsh
# 创建 Service 文件
sudo vim  /etc/systemd/system/mysqld.service
```

粘贴以下配置到 mysqld.service：

```txt
[Unit]
Description=MySQL Community Server
After=network.target
After=syslog.target

[Service]
User=mysql
Group=mysql
Type=notify
# 重点：指向你的安装目录
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf --user=mysql
# 给予 MySQL 足够的关闭时间
TimeoutSec=300
PrivateTmp=false

[Install]
WantedBy=multi-user.target
```

配置 `/etc/my.cnf`文件内容：

```txt
[mysqld]
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
socket=/tmp/mysql.sock
user=mysql
secure_file_priv=/usr/local/mysql/mysql-files

[client]
socket=/tmp/mysql.sock
```

执行以下命令让系统识别新服务：

```zsh
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 设置开机自启
sudo systemctl enable mysqld

# 立即启动服务
sudo systemctl start mysqld

# 验证状态
sudo systemctl status mysqld
```

## MySQL使用演示

查看所有的数据库，以下四个数据库都是 MySQL 自带的数据库。

```mysql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)
```

- “information_schema”，主要保存 MySQL 数据库服务器的系统信息，比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件所在的文件夹和系统使用的文件夹，等等
- “performance_schema”，用来监控 MySQL 的各类性能指标。
- “sys”数据库，主要作用是以一种更容易被理解的方式展示 MySQL 数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。
- “mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的字符集、约束检查信息，等等

```mysql
# 创建自己的数据库
create database atguigudb;

# 使用自己的数据库
use atguigudb;

# 查看某个库的所有表格
show tables; #要求前面有use语句
show tables from 数据库名; 

# 创建新的表格 学生表
create table student(
	id int,
	name varchar(20) #说名字最长不超过20个字符
);

# 添加两条记录到student表中
insert into student values(1,'张三');
insert into student values(2,'李四');

# 查看student表的详细创建信息
mysql > show create table student\G
*************************** 1. row ***************************
       Table: student
Create Table: CREATE TABLE `student` (
  `id` int DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

# 查看数据库的创建信息
show create database atguigudb\G

# 删除表格
drop table student;

# 删除数据库
drop database atguigudb;

# 退出MySQL
exit # 或者 quit
```

## MySQL字符集

MySQL有4个级别的字符集和比较规则，分别是：

- 服务器级别 `character_set_server`
- 数据库级别 `character_set_database`
- 表级别
- 列级别

```zsh
mysql> show variables like 'character%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8mb4                    |
| character_set_connection | utf8mb4                    |
| character_set_database   | utf8mb4                    |
| character_set_filesystem | binary                     |
| character_set_results    | utf8mb4                    |
| character_set_server     | utf8mb4                    |
| character_set_system     | utf8mb3                    |
| character_sets_dir       | /opt/mysql/share/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.00 sec)
```

其中：

- `character_set_client`：服务器解码请求时使用的字符集
- `character_set_connection`：服务器处理请求时会把请求字符串从character_set_client转为character_set_connection
- `character_set_results`：服务器向客户端返回数据时使用的字符集
- `utf8mb3` ：阉割过的 utf8 字符集，只使用1～3个字节表示字符。
- `utf8mb4` ：正宗的 utf8 字符集，使用1～4个字节表示字符。

 请求到响应过程中字符集的变化：

1. 若客户端使用的是 utf8 字符集，字符 '我' 在发送给服务器的请求中的字节形式就是：0xE68891。
2. 服务器接收到客户端发送来的请求，它会认为这串字节采用的字符集是 `character_set_client` (假设为utf8)，然后把这串字节转换为 `character_set_connection` 字符集（假设为gbk）编码的字符。
3. 因为表 t 的列 col 采用的是 gbk 字符集，与 `character_set_connection` 一致，所以直接到列中找字节值为 0xCED2 的记录。
4.  col 列是采用 gbk 进行编码的，所以首先会将这个字节串使用 gbk 进行解码，得到字符串 '我' ，然后再把这个字符串使用 `character_set_results` 代表的字符集，也就是 utf8 进行编码，得到了新的字节串：0xE68891 ，然后发送给客户端。
5. 由于客户端是用的字符集是 utf8 ，所以可以顺利的将 0xE68891 解释成字符 我 ，从而显示到我们的显示器上。

![ 请求到响应过程中字符集的变化](https://vip.123pan.cn/1844935313/obsidian/20260310123045994.png)

##  SQL大小写规范

MySQL在Linux下数据库名、表名、列名、别名大小写规则是这样的：

1. 数据库名、表名、表的别名、变量名是严格区分大小写的；
2. 关键字、函数名称在 SQL 中不区分大小写；
3. 列名（或字段名）与列的别名（或字段别名）在所有的情况下均是忽略大小写的；

MySQL在Windows的环境下全部不区分大小写。

SQL编写建议：

```txt
关键字 和 函数名称 全部大写；
数据库名、表名、表别名、字段名、字段别名等全部小写；
SQL 语句必须以分号结尾。
```

## 图形化管理工具DBeaver

```zsh
sudo pacman -S dbeaver
```

尝试更改DBeaver 用户界面语言失败，应该和 DBeaver 正在通过 **XWayland**（兼容模式）运行相关。解决方法是修改 `/usr/share/dbeaver/dbeaver.ini` ，在文件末尾添加：

```txt
-Dswt.autoScale=true
-Duser.language=zh
-Duser.region=CN
```

三个选项分别对应启用 SWT（DBeaver 的图形界面库）自动缩放、设置用户语言为“中文”、设置用户地区为“中国”。

连接本地数据库MySQL时，需要把驱动属性 `allowPublicKeyRetrieval` 修改为 true。

连接远程数据库：

1. 在远程机器上使用ping ip地址 保证网络畅通
2. 在远程机器上使用telnet命令保证端口号开放访问，telnet ip地址 端口号
