---
title: MySQL 高级-架构篇
date: 2026-04-28
tags:
  - MySQL
category:
  - 数据库
---
# 前言

学习尚硅谷的[《MySQL数据库入门到大牛，mysql安装到优化》](https://www.bilibili.com/video/BV1iq4y1u7vj)的分集104到114。

<!-- more -->

MySQL高级特性分为4个篇章：

1. MySQL架构篇
	- 第1章：MySQL的数据目录
	- 第2章：用户与权限管理
	- 第3章：逻辑架构
	- 第4章：存储引擎
2. 索引及调优篇
	- 第1章：索引
	- 第2章：性能分析工具的使用
	- 第3章：索引优化与SQL优化
	- 第4章：数据库的设计规范
	- 第5章：数据库其他调优策略
3. 事务篇
	- 第1章：事务基础知识
	- 第2章：MySQL事务日志
	- 第3章：锁
	- 第4章：多版本并发控制(MVCC)
4. 日志与备份篇
	- 第1章：其它数据库日志
	- 第2章：主从复制
	- 第3章：数据库备份与恢复

# 第1章：MySQL的数据目录

我的MySQL数据库的安装目录：`/usr/local/mysql` 。

我的MySQL数据库的数据目录：`/usr/local/mysql/data` 。

```mysql
mysql> show variables like 'datadir';
+---------------+------------------------+
| Variable_name | Value                  |
+---------------+------------------------+
| datadir       | /usr/local/mysql/data/ |
+---------------+------------------------+
```

或者查看 `/etc/my.cnf` 配置文件内容：

```cnf
[mysqld]
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
socket=/tmp/mysql.sock
user=mysql
secure_file_priv=/usr/local/mysql/mysql-files

[client]
socket=/tmp/mysql.sock
```

## 系统表空间

默认情况下，InnoDB会在数据目录下创建一个名为 `ibdata1` 、大小为 12M 的文件，这个文件就是对应的系统表空间（system tablespace）在文件系统上的表示。注意这个文件是自扩展文件，当不够用的时候它会自己增加文件大小。

如果你想让系统表空间对应文件系统上多个实际文件，或者仅仅觉得原来的 ibdata1 这个文件名难听，那可以在MySQL启动时配置对应的文件路径以及它们的大小，比如修改 my.cnf 配置文件：

```cnf
[server]
innodb_data_file_path=data1:512M;data2:512M:autoextend
```

## 独立表空间

在MySQL5.6.6以及之后的版本中，InnoDB并不会默认的把各个表的数据存储到系统表空间中，而是为每一个表建立一个独立表空间（file-per-table tablespace）。

存储表数据的话，会在该表所属数据库对应的子目录下创建一个表示该独立表空间的文件，文件名和表名相同，只不过添加了一个 `.ibd` 的扩展名。

比如：使用了独立表空间去存储 atguigu 数据库下的 test 表的话，那么在该表所在数据库对应的 atguigu 目录下会为 test 表创建这两个文件：

```txt
test.frm
test.ibd
```

> 其中 `test.ibd` 文件就用来存储 test 表中的数据和索引，
> `test.frm` 用于描述表结构，该文件以二进制格式存储的。

启动参数 `innodb_file_per_table` 可以指定使用系统表空间还是独立表空间来存储数据：

```cnf
[server]
innodb_file_per_table=0 # 0：代表使用系统表空间； 1：代表使用独立表空间
```

默认情况下使用独立表空间存储。

```sql
mysql> show variables like 'innodb_file_per_table';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_file_per_table | ON    |
+-----------------------+-------+
```

# 第2章：用户与权限管理

## 登录MySQL服务器

启动MySQL服务后，可以通过mysql命令来登录MySQL服务器，命令如下：

```zsh
mysql –h hostname|hostIP –P port –u username –p DatabaseName –e "SQL语句"

# 举例
mysql -uroot -p -hlocalhost -P3306 mysql -e "select host,user from user"

# 简略版
mysql -u root -pabc123
```

- `-h` 指定主机名或者主机IP，hostname为主机，hostIP为主机IP。
- `-P` 指定MySQL服务的端口。MySQL服务的默认端口是3306，
- `-u` 指定接用户名
- `-p` 会提示输入密码。
- `DatabaseName` 指明登录到哪一个数据库中。如果没有该参数，就会直接登录到MySQL数据库中，然后可以使用USE命令来选择数据库。
- `-e` 后面可以直接加SQL语句。登录MySQL服务器以后即可执行这个SQL语句，然后退出MySQL服务器。

## 用户管理

### 创建用户

```mysql
-- CREATE USER语句
CREATE USER 用户名 [IDENTIFIED BY '密码'][,用户名 [IDENTIFIED BY '密码']];
```

> 用户名参数由用户（User）和主机名（Host）构成；
> `CREATE USER` 语句可以同时创建多个用户。

```mysql
CREATE USER zhang3 IDENTIFIED BY '123123'; -- 默认host是 %
CREATE USER 'kangshifu'@'localhost' IDENTIFIED BY '123456';

-- 查看当前有哪些用户
mysql> SELECT user, host FROM mysql.user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| zhang3           | %         |
| kangshifu        | localhost |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
```

### 修改用户

修改用户名：

```mysql
UPDATE mysql.user 
SET USER='li4' 
WHERE USER='zhang3';
```

修改当前用户密码：使用 `ALTER USER` 命令。

```mysql
ALTER USER USER() IDENTIFIED BY 'new_password';

-- 示例
mysql -u zhang3 -p123123
ALTER USER USER() IDENTIFIED BY 'abc123';
mysql -u zhang3 -pabc123
```

修改其他用户密码：使用root用户登录MySQL后，可以使用SET语句来修改密码。

```mysql
-- 方式一
ALTER USER user [IDENTIFIED BY 'new_password'];

-- 方式二
SET PASSWORD FOR 'username'@'hostname'='new_password';

-- 示例
SET PASSWORD FOR 'zhang3'='123123';  -- 默认host是 %
```

### 删除用户

使用 `DROP USER` 语句来删除用户时，必须用于DROP USER权限。DROP USER语句的基本语法形式如下：

```mysql
DROP USER user[,user];

-- 举例
DROP USER li4; -- 默认删除host为%的用户
DROP USER 'kangshifu'@'localhost';
```

DROP USER 命令会删除用户以及对应的权限。

## 权限管理

查看MySQL权限列表：

```mysql
mysql> show privileges;
```

出于安全因素，授予权限的原则：

1. 只授予能满足需要的最小权限，防止用户干坏事。
2. 创建用户的时候限制用户的登录主机，一般是限制成指定IP或者内网IP段。
3. 为每个用户设置满足密码复杂度的密码 。
4. 定期清理不需要的用户，回收权限或者删除用户。

### 查看权限

```mysql
-- 查看当前用户权限
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;

-- 查看其他用户
SHOW GRANTS FOR 'user'@'主机地址' ;
```

### 授予权限

给用户授权的方式有2种：给用户赋予角色、直接给用户授权 。

```mysql
GRANT 权限1,权限2,…权限n 
ON 数据库名称.表名称 
TO 用户名@用户地址 
[IDENTIFIED BY ‘密码口令’];

-- 举例
-- 给li4用户用本地命令行方式，授予atguigudb这个库下的所有表的插删改查的权限
GRANT SELECT,INSERT,DELETE,UPDATE 
ON atguigudb.* 
TO li4@localhost;

-- 授予通过网络方式登录的joe用户，对所有库所有表的全部权限，密码设为123。
-- 注意这里唯独不包括grant的权限
GRANT ALL PRIVILEGES 
ON *.* 
TO joe@'%' 
IDENTIFIED BY '123';
```

### 收回权限

MySQL中使用`REVOKE`语句取消用户的权限。

使用REVOKE收回权限之后，用户账户的记录将从 db、host、tables_priv和columns_priv表中删除，但是用户账户记录仍然在 user 表中保存（删除user表中的账户记录使用`DROP USER`语句）。

> 注意：在将用户账户从 user 表删除之前，应该收回相应用户的所有权限。
> 注意：收回权限后，须用户重新登录后才能生效

```mysql
REVOKE 权限1,权限2,…权限n 
ON 数据库名称.表名称 
FROM 用户名@用户地址;
```

## 角色管理

引入角色的目的是方便管理拥有相同权限的用户。

![角色|600x0](https://vip.123pan.cn/1844935313/obsidian/20260427095110018.png)

### 创建角色

创建角色使用 `CREATE ROLE` 语句，语法如下：

```mysql
CREATE ROLE 'role_name'[@'host_name'] [,'role_name'[@'host_name']];

-- 举例
CREATE ROLE 'manager'@'localhost';
```

### 授予权限

创建角色之后，默认这个角色是没有任何权限的，我们需要给角色授权。

```mysql
GRANT [privilege1,...] 
ON table_name 
TO 'role_name'[@'host_name'];

-- 举例
GRANT SELECT ON demo.settlement TO 'manager';
```

### 查看角色权限

```mysql
SHOW GRANTS FOR 'manager';
```

### 回收角色权限

```mysql
REVOKE privileges ON tablename FROM 'rolename';

-- 举例
REVOKE INSERT, UPDATE, DELETE ON school.* FROM 'school_write';
```

### 删除角色

当我们需要对业务重新整合的时候，可能就需要对之前创建的角色进行清理，删除一些不会再使用的角色。

```mysql
DROP ROLE role [,role2...];
```

### 查看用户角色

查看kangshifu用户的角色信息。

```mysql
SHOW GRANTS FOR 'kangshifu'@'localhost';
```

### 赋予用户角色

角色创建并授权后，要赋给用户并处于 激活状态 才能发挥作用。给用户添加角色可使用GRANT语句，语法形式如下：

```mysql
GRANT role [,role2,...] 
TO user [,user2,...];

-- 举例
GRANT 'school_read' TO 'kangshifu'@'localhost';
-- 添加完成后使用SHOW语句查看是否添加成功
SHOW GRANTS FOR 'kangshifu'@'localhost';
-- 使用kangshifu用户登录，然后查询当前角色，如果角色未激活，结果将显示NONE
SELECT CURRENT_ROLE();
```

### 激活用户角色

方式1：使用 set default role 命令激活角色。

```mysql
SET DEFAULT ROLE ALL TO 'kangshifu'@'localhost';
```

方式2：将 activate_all_roles_on_login设置为ON。

```mysql
-- 对所有角色永久激活。运行这条语句之后，用户才真正拥有了赋予角色的所有权限。
SET GLOBAL activate_all_roles_on_login=ON;
```

### 撤销用户角色

```mysql
REVOKE role FROM user;
```

# 第3章：逻辑架构

![mysql逻辑架构|500x0](https://vip.123pan.cn/1844935313/obsidian/20260427100946072.png)

MySQL架构图，简化为三层结构：

1. 连接层：客户端和服务器端建立连接，客户端发送 SQL 至服务器端；
2. SQL 层（服务层）：对 SQL 语句进行查询处理；与数据库文件的存储方式无关；
3. 存储引擎层：与数据库文件打交道，负责数据的存储和读取。

## 连接层

客户端访问 MySQL 服务器前，做的第一件事就是建立 TCP 连接。

经过三次握手建立连接成功后， MySQL 服务器对 TCP 传输过来的账号密码做身份认证、权限获取。

- 用户名或密码不对，会收到一个Access denied for user错误，客户端程序结束执行
- 用户名密码认证通过，会从权限表查出账号拥有的权限与连接关联，之后的权限判断逻辑，都将依赖于此时读到的权限

TCP 连接收到请求后，必须要分配给一个线程专门与这个客户端的交互。所以还会有个线程池，去走后面的流程。每一个连接从线程池中获取线程，省去了创建和销毁线程的开销。

## 服务层

### SQL接口

接收用户的SQL命令，并且返回用户需要查询的结果。比如SELECT ... FROM就是调用SQL Interface

MySQL支持DML（数据操作语言）、DDL（数据定义语言）、存储过程、视图、触发器、自定义函数等多种SQL语言接口

### 解析器

在解析器（Parser）中对 SQL 语句进行语法分析、语义分析。将SQL语句分解成数据结构，并将这个结构传递到后续步骤，以后SQL语句的传递和处理就是基于这个结构的。如果在分解构成中遇到错误，那么就说明这个SQL语句是不合理的。

在SQL命令传递到解析器的时候会被解析器验证和解析（包括词法分析、语法分析），并为其创建`语法树`，并根据数据字典丰富查询语法树，会 验证该客户端是否具有执行该查询的权限 。创建好语法树后，MySQL还会对SQl查询进行语法上的优化，进行查询重写。

如果SQL语句正确，则会生成一个这样的语法树：

![语法树|650x0](https://vip.123pan.cn/1844935313/obsidian/20260427102815708.png)

### 优化器

SQL语句在**语法解析之后、查询之前**会使用查询优化器（Optimizer）确定 SQL 语句的执行路径，生成一个执行计划 。

这个执行计划表明应该 使用哪些索引 进行查询（全表检索还是使用索引检索），表之间的连
接顺序如何，最后会按照执行计划中的步骤调用存储引擎提供的方法来真正的执行查询，并将
查询结果返回给用户。

在查询优化器中，可以分为逻辑查询优化阶段和物理查询优化阶段。

### 查询缓存

MySQL内部维持着一些Cache和Buffer，比如 Query Cache 用来缓存一条SELECT语句的执行结果，如果能够在其中找到对应的**查询结果**，那么就不必再进行查询解析、优化和执行的整个过程了，直接将结果反馈给客户端。

这个缓存机制是由一系列小缓存组成的。比如表缓存，记录缓存，key缓存，权限缓存等 。

### 数据库缓冲区

从MySQL 5.7.20开始，不推荐使用查询缓存，并在 MySQL 8.0中删除。**数据库缓冲池**（buffer pool）代替了查询缓存。

InnoDB 存储引擎是以页为单位来管理存储空间的，我们进行的增删改查操作其实本质上都是在访问页面（包括读页面、写页面、创建新页面等操作）。而磁盘 I/O 需要消耗的时间很多，而在内存中进行操作，效率则会高很多。

为了能让数据表或者索引中的数据随时被我们所用，DBMS 会申请占用内存来作为数据缓冲池，在真正访问页面之前，需要把在磁盘上的页缓存到内存中的缓冲池之后才可以访问。

查看 InnoDB 存储引擎的缓冲池的大小：

```mysql
mysql> show variables like 'innodb_buffer_pool_size';
+-------------------------+-----------+
| Variable_name           | Value     |
+-------------------------+-----------+
| innodb_buffer_pool_size | 134217728 |
+-------------------------+-----------+
```

修改缓冲池大小为256MB = 256x1024x1024B：

```mysql
set global innodb_buffer_pool_size = 268435456;

-- 或者修改 /etc/my.cnf 配置文件
[server]
innodb_buffer_pool_size = 268435456
```

查看缓冲池的个数：

```mysql
mysql> show variables like 'innodb_buffer_pool_instances';
+------------------------------+-------+
| Variable_name                | Value |
+------------------------------+-------+
| innodb_buffer_pool_instances | 1     |
+------------------------------+-------+
```

创建两个缓冲区：

```cnf
[server]
innodb_buffer_pool_instances = 2
```

## 引擎层

插件式存储引擎层（ Storage Engines），真正的负责了MySQL中数据的存储和提取，对物理服务器级别维护的底层数据执行操作，服务器通过API与存储引擎进行通信。

不同的存储引擎具有的功能不同，这样我们可以根据自己的实际需要进行选取。

MySQL 8.0.45默认支持的存储引擎如下：

![MySQL 8.0.45默认支持的存储引擎](https://vip.123pan.cn/1844935313/obsidian/20260427102056170.png)

## 存储层

所有的数据，数据库、表的定义，表的每一行的内容，索引，都是存在文件系统上，以文件的方式存在的，并完成与存储引擎的交互。

当然有些存储引擎比如InnoDB，也支持不使用文件系统直接管理裸设备，但现代文件系统的实现使得这样做没有必要了。

## MySQL查询流程

![MySQL中的 SQL执行流程](https://vip.123pan.cn/1844935313/obsidian/20260427102358378.png)

SQL 语句在 MySQL 中的流程是：SQL语句→查询缓存→解析器→优化器→执行器。

![](https://vip.123pan.cn/1844935313/obsidian/20260427103133088.png)

## 使用profiling

### 确认profiling 是否开启

```mysql
select @@profiling;
-- 或
show variables like 'profiling';

-- 开启profiling
set profiling=1;
```

### 查看profiles

查看当前会话所产生的所有 profiles：

```mysql
show profiles; # 显示最近的几次查询
```

显示执行计划，查看程序的执行步骤：

```mysql
-- 查看最近一条程序的执行步骤
show profile;

-- 查看指定 Query ID 的程序执行步骤
show profile for query 7;
```

# 第4章：存储引擎

MySQL 8.0.45默认支持的存储引擎如下：

![MySQL 8.0.45默认支持的存储引擎](https://vip.123pan.cn/1844935313/obsidian/20260427102056170.png)
## 设置存储引擎

### 系统存储引擎

查看系统默认的存储引擎：

```mysql
mysql> show variables like '%storage_engine%';
+---------------------------------+-----------+
| Variable_name                   | Value     |
+---------------------------------+-----------+
| default_storage_engine          | InnoDB    |
| default_tmp_storage_engine      | InnoDB    |
| disabled_storage_engines        |           |
| internal_tmp_mem_storage_engine | TempTable |
+---------------------------------+-----------+

mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

修改默认的存储引擎：

```mysql
SET DEFAULT_STORAGE_ENGINE=MyISAM;
```

### 表的存储引擎

存储引擎是负责对表中的数据进行提取和写入工作的，我们可以为不同的表设置不同的存储引擎，也就是说不同的表可以有不同的物理存储结构，不同的提取和写入方式。

```mysql
-- 创建表时指定存储引擎
CREATE TABLE 表名(
建表语句;
) 
ENGINE = 存储引擎名称;

-- 修改表的存储引擎
ALTER TABLE 表名 
ENGINE = 存储引擎名称;
```

## 存储引擎介绍

| 对比项  | MyISAM                       | InnoDB                                 |
| ---- | ---------------------------- | -------------------------------------- |
| 外键   | 不支持                          | 支持                                     |
| 事务   | 不支持                          | 支持                                     |
| 行表锁  | 表锁，即使操作一条记录也会锁住整个表，不适合高并发的操作 | 行锁，操作时只锁某一行，不对其它行有影响，适合高并发的操作          |
| 缓存   | 只缓存索引，不缓存真实数据                | 不仅缓存索引还要缓存真实数据，对内存要求高，而且内存大小对性能有决定性的影响 |
| 关注点  | 性能：节省资源、消耗少、简单业务             | 事务：并发写、事务、更大资源                         |
| 默认安装 | Y                            | N                                      |
| 默认使用 | N                            | Y                                      |

### InnoDB引擎

InnoDB 引擎：具备外键支持功能的事务存储引擎。

InnoDB是MySQL的默认事务型引擎，它被设计用来处理大量的短期(short-lived)事务。可以确保事务的完整提交(Commit)和回滚(Rollback)。

对比MyISAM的存储引擎，InnoDB写的处理效率差一些，并且会占用更多的磁盘空间以保存数据和索引。

- MyISAM只缓存索引，不缓存真实数据；
- InnoDB不仅缓存索引还要缓存真实数据，对内存要求较高，而且内存大小对性能有决定性的影响。

> 除了增加和查询外，还需要更新、删除操作，那么，应优先选择InnoDB存储引擎。

### MyISAM引擎

MyISAM 引擎：主要的非事务处理存储引擎。

MyISAM提供了大量的特性，包括全文索引、压缩、空间函数(GIS)等，但MyISAM 不支持事务、行级锁、外键 ，有一个毫无疑问的缺陷就是 崩溃后无法安全恢复 。

- 优势是访问的速度快，对事务完整性没有要求或者以SELECT、INSERT为主的应用。
- 数据文件结构：表名.frm 存储表结构，表名.MYD 存储数据 (MYData)，表名.MYI 存储索引 (MYIndex)
- 应用场景：只读应用或者以读为主的业务

### 其他引擎

Archive 引擎：用于数据存档。
Blackhole 引擎：丢弃写操作，读操作会返回空内容
CSV 引擎：存储数据时，以逗号分隔各个数据项
Memory 引擎：置于内存的表，缺点：其数据易丢失，生命周期短。
Federated 引擎：访问远程表
Merge引擎：管理多个MyISAM表构成的表集合
NDB引擎：MySQL集群专用存储引擎

