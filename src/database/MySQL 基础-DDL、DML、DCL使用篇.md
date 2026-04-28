---
title: MySQL 基础-DDL、DML、DCL使用篇
date: 2026-04-16
tags:
  - MySQL
category:
  - 数据库
---
# 前言

学习尚硅谷的[《MySQL数据库入门到大牛，mysql安装到优化》](https://www.bilibili.com/video/BV1iq4y1u7vj)的第49到73分集。

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
	- 第10章：MySQL数据类型精讲
	- 第11章：创建和管理表
	- 第12章：数据处理之增删改
	- 第13章：约束
4. 其它数据库对象篇
	- 第14章：视图
	- 第15章：存储过程与函数
	- 第16章：变量、流程控制与游标
	- 第17章：触发器
5. MySQL8 新特性篇
	- 第18章：MySQL8其它新特性

# 第10章：MySQL数据类型精讲

| 类型       | 类型举例                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------ |
| 整数类型     | TINYINT、SMALLINT、MEDIUMINT、INT（或INTEGER）、BIGINT                                                        |
| 浮点类型     | FLOAT、DOUBLE                                                                                           |
| 定点数类型    | DECIMAL                                                                                                |
| 位类型      | BIT                                                                                                    |
| 日期时间类型   | YEAR、TIME、DATE、DATETIME、TIMESTAMP                                                                      |
| 文本字符串类型  | CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT                                                         |
| 枚举类型     | ENUM                                                                                                   |
| 集合类型     | SET                                                                                                    |
| 二进制字符串类型 | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB                                                     |
| JSON类型   | JSON对象、JSON数组                                                                                          |
| 空间数据类型   | 单值：GEOMETRY、POINT、LINESTRING、POLYGON；<br>集合：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION |

常见数据类型的属性，如下：

| MySQL关键字           | 含义            |
| :----------------- | :------------ |
| NULL               | 数据列可包含NULL值   |
| NOT NULL           | 数据列不允许包含NULL值 |
| DEFAULT            | 默认值           |
| PRIMARY KEY        | 主键            |
| AUTO_INCREMENT     | 自动递增，适用于整数类型  |
| UNSIGNED           | 无符号           |
| CHARACTER SET name | 指定一个字符集       |

## 整数类型

整数类型所占空间：

- TINYINT 占1字节
- SMALLINT 占2字节
- MEDIUMINT 占3字节
- INT（或INTEGER）占4字节 
- BIGINT 占5字节

整数类型的可选属性有三个：

- `M` : 表示显示宽度，M的取值范围是(0, 255)。例如，int(5)：当数据宽度小于5位的时候在数字前面需要用字符填满宽度。该项功能需要配合 `ZEROFILL` 使用，表示用“0”填满宽度，否则指定显示宽度无效。从MySQL 8.0.17开始，整数数据类型不推荐使用 M
- `UNSIGNED` : 无符号类型（非负）
- `ZEROFILL` : 0填充，如果指定了ZEROFILL只是表示不够M位时，用0在左边填充，如果超过M位，只要不超过数据存储范围即可

> 在 int(M) 中，M 的值跟 int(M) 所占多少存储空间并无任何关系。 int(3)、int(4)、int(8) 在磁盘上都是占用 4 bytes 的存储空间。
> 也就是说，int(M)，必须和UNSIGNED ZEROFILL一起使用才有意义。如果整数值超过M位，就按照实际位数存储。只是无须再用0填充。

适用场景：

- TINYINT 一般用于枚举数据，比如系统设定取值范围很小且固定的场景。
- SMALLINT 可以用于较小范围的统计数据，比如统计工厂的固定资产库存数量等。
- MEDIUMINT 用于较大整数的计算，比如车站每日的客流量等。
- INT、INTEGER 取值范围足够大，一般情况下不用考虑超限问题，用得最多。比如商品编号。
- BIGINT 只有当你处理特别巨大的整数时才会用到。比如双十一的交易量、大型门户网站点击量、证券公司衍生产品持仓等。

## 浮点类型

MySQL支持的浮点数类型，分别是 FLOAT、DOUBLE、REAL。

- FLOAT 表示单精度浮点数；
- DOUBLE 表示双精度浮点数；
- REAL 默认就是 DOUBLE。如果你把 SQL 模式设定为启用“ REAL_AS_FLOAT ”，那 么，MySQL 就认为REAL 是 FLOAT

MySQL允许使用**非标准语法**（其他数据库未必支持，因此如果涉及到数据迁移，则最好不要这么用）：`FLOAT(M,D)` 或 `DOUBLE(M,D)` 。这里，M称为精度，D称为标度。

> 从MySQL 8.0.17开始，FLOAT(M,D) 和DOUBLE(M,D)用法在官方文档中已经明确不推荐使用，将来可能被移除。
> 另外，关于浮点型FLOAT和DOUBLE的UNSIGNED也不推荐使用了，将来也可能被移除。

## 定点数类型

| 数据类型                       | 字节数   | 含义         |
| :------------------------- | :---- | :--------- |
| DECIMAL(M,D), DEC, NUMERIC | M+2字节 | 有效范围由M和D决定 |

DECIMAL(M,D)的最大取值范围与DOUBLE类型一样，但是有效的数据范围是由M和D决定的。

DECIMAL 的存储空间并不是固定的，由精度值M决定，总共占用的存储空间为M+2个字节。也就是说，在一些对精度要求不高的场景下，比起占用同样字节长度的定点数，浮点数表达的数值范围可以更大一些。

当DECIMAL类型不指定精度和标度时，其默认为`DECIMAL(10,0)`。当数据的精度超出了定点数类型的精度范围时，则MySQL同样会进行四舍五入处理。

```sql
mysql> DESC test_decimal1;
+-------+---------------+------+-----+---------+-------+
| Field | Type          | Null | Key | Default | Extra |
+-------+---------------+------+-----+---------+-------+
| f1    | decimal(10,0) | YES  |     | NULL    |       |
| f2    | decimal(5,2)  | YES  |     | NULL    |       |
+-------+---------------+------+-----+---------+-------+
2 rows in set (0.00 sec)

mysql> INSERT INTO test_decimal1(f1,f2)
    -> VALUES(123,999.99),(123.45,67.567);
Query OK, 2 rows affected, 2 warnings (0.02 sec)
Records: 2  Duplicates: 0  Warnings: 2

mysql> SELECT * FROM test_decimal1;
+------+--------+
| f1   | f2     |
+------+--------+
|  123 | 999.99 |
|  123 |  67.57 |
+------+--------+
2 rows in set (0.00 sec)
```

> 定点数在MySQL内部是以字符串的形式进行存储，这就决定了它一定是精准的。

## 位类型

BIT类型中存储的是二进制值，类似010110。如果没有指定(M)，默认是1位。这个1位，表示只能存1位的二进制值。

使用SELECT命令查询位字段时，可以用 BIN() 或 HEX() 函数进行读取。

```sql
mysql> SELECT f2
    -> FROM test_bit1;
+------------+
| f2         |
+------------+
| 0x1F       |
+------------+
1 rows in set (0.00 sec)

mysql> SELECT BIN(f2),HEX(f2)
    -> FROM test_bit1;
+---------+---------+
| BIN(f2) | HEX(f2) |
+---------+---------+
| 11111   | 1F      |
+---------+---------+
1 rows in set (0.00 sec)

mysql> SELECT f2 + 0  
    -> FROM test_bit1; # +0以后，可以以十进制的方式显示数据
+--------+
| f2 + 0 |
+--------+
|     31 |
+--------+
1 rows in set (0.00 sec)
```

## 日期与时间类型

MySQL8.0版本支持的日期和时间类型主要有：YEAR类型、TIME类型、DATE类型、DATETIME类型和 TIMESTAMP类型。

- YEAR 类型表示年
- DATE 类型表示年、月、日
- TIME 类型表示时、分、秒
- DATETIME 类型表示年、月、日、时、分、秒
- TIMESTAMP 类型表示**带时区的**年、月、日、时、分、秒

| 类型        | 名称   | 字节数 | 日期格式                    | 最小值                     | 最大值                     |
| :-------- | :--- | :-- | :---------------------- | :---------------------- | :---------------------- |
| YEAR      | 年    | 1   | YYYY或YY                 | 1901                    | 2155                    |
| DATE      | 日期   | 3   | YYYY-MM-DD              | 1000-01-01              | 9999-12-31              |
| TIME      | 时间   | 3   | HH:MM:SS                | -838:59:59              | 838:59:59               |
| DATETIME  | 日期时间 | 8   | YYYY-MM-DD HH:MM:SS     | 1000-01-01 00:00:00     | 9999-12-31 23:59:59     |
| TIMESTAMP | 时间戳  | 4   | YYYY-MM-DD HH:MM:SS UTC | 1970-01-01 00:00:00 UTC | 2038-01-19 03:14:07 UTC |

> 为什么时间类型 TIME 的取值范围不是 -23:59:59～23:59:59 呢？原因是 MySQL 设计的 TIME 类型，不光表示一天之内的时间，而且可以用来表示一个时间间隔，这个时间间隔可以超过 24 小时。

TIMESTAMP 和 DATETIME 的区别：

- TIMESTAMP存储空间比较小，表示的日期时间范围也比较小
- 底层存储方式不同，TIMESTAMP底层存储的是毫秒值，距离1970-1-1 0:0:0 0毫秒的毫秒值。
- 两个日期比较大小或日期计算时，TIMESTAMP更方便、更快。
- TIMESTAMP和时区有关。TIMESTAMP会根据用户的时区不同，显示不同的结果。而DATETIME则只能反映出插入时当地的时区，其他时区的人查看数据必然会有误差的。

用得最多的日期时间类型，就是 DATETIME 。因为这个数据类型包括了完整的日期和时间信息，取值范围也最大，使用起来比较方便。

此外，一般存注册时间、商品发布时间等，不建议使用DATETIME存储，而是使用 时间戳 ，因为DATETIME虽然直观，但不便于计算。

## 文本字符串类型

| 文本字符串类型    | 值的长度 | 长度范围                 | 占用的存储空间      |
| :--------- | :--- | :------------------- | :----------- |
| CHAR(M)    | M    | 0 <= M <= 255        | M个字节         |
| VARCHAR(M) | M    | 0 <= M <= 65535      | M+1个字节       |
| TINYTEXT   | L    | 0 <= L <= 255        | L+2个字节       |
| TEXT       | L    | 0 <= L <= 65535      | L+2个字节       |
| MEDIUMTEXT | L    | 0 <= L <= 16777215   | L+3个字节       |
| LONGTEXT   | L    | 0 <= L <= 4294967295 | L+4个字节       |
| ENUM       | L    | 1 <= L <= 65535      | 1或2个字节       |
| SET        | L    | 0 <= L <= 64         | 1,2,3,4或8个字节 |

CHAR(M) 类型一般需要预先定义字符串长度。如果不指定(M)，则表示长度默认是1个字符。

VARCHAR 类型：

- VARCHAR(M) 定义时，必须指定长度M，否则报错。
- MySQL4.0版本以下，varchar(20)指的是20字节，如果存放UTF8汉字时，只能存6个（每个汉字3字节）；MySQL5.0版本以上，varchar(20)指的是20**字符**。

TEXT 类型：

- 在向TEXT类型的字段保存和查询数据时，系统自动按照实际长度存储，不需要预先定义长度。这一点和VARCHAR类型相同。
- 由于实际存储的长度不确定，MySQL不允许 TEXT 类型的字段做主键。
- TEXT类型可以存比较大的文本段，搜索速度稍慢，因此如果不是特别大的内容，建议使用CHAR，VARCHAR来代替。

ENUM类型也叫作枚举类型，ENUM类型的取值范围需要在定义字段时进行指定。设置字段值时，ENUM类型只允许从成员中选取单个值，不能一次选取多个值。

```sql
CREATE TABLE test_enum(
season ENUM('春','夏','秋','冬','unknow')
);

INSERT INTO test_enum
VALUES('春'),('秋');

#可以使用索引进行枚举元素的调用
INSERT INTO test_enum
VALUES(1),('3');

#忽略大小写的
INSERT INTO test_enum
VALUES('unknow');

INSERT INTO test_enum
VALUES('UNKNOW');

#没有限制非空的情况下，可以添加null值
INSERT INTO test_enum
VALUES (NULL);
```

SET表示一个字符串对象，可以包含0个或多个成员，但成员个数的上限为 64 。设置字段值时，可以取取值范围内的 0 个或多个值。

```sql
CREATE TABLE test_set(
s SET ('A', 'B', 'C')
);

INSERT INTO test_set (s) VALUES ('A'), ('A,B');

#插入重复的SET类型成员时，MySQL会自动删除重复的成员
INSERT INTO test_set (s) VALUES ('A,B,C,A');

#向SET类型的字段插入SET成员中不存在的值时，MySQL会抛出错误。
INSERT INTO test_set (s) VALUES ('A,B,C,D');
```

## 二进制字符串类型

MySQL中的二进制字符串类型主要存储一些二进制数据，比如可以存储图片、音频和视频等二进制数据。

MySQL中支持的二进制字符串类型主要包括 BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB 和 LONGBLOB类型。

TEXT和BLOB的使用注意事项：在使用text和blob字段类型时要注意以下几点，以便更好的发挥数据库的性能。

1. BLOB和TEXT值也会引起自己的一些问题，特别是执行了大量的删除或更新操作的时候。删除这种值会在数据表中留下很大的"空洞"，以后填入这些"空洞"的记录可能长度不同。为了提高性能，建议定期使用 OPTIMIZE TABLE 功能对这类表进行**碎片整理**。
2. 如果需要对大文本字段进行模糊查询，MySQL 提供了**前缀索引**。但是仍然要在不必要的时候避免检索大型的BLOB或TEXT值。
3. 把BLOB或TEXT列**分离到单独的表**中。在实际工作中，往往不会在MySQL数据库中使用BLOB类型存储大对象数据，通常会将图片、音频和视频文件存储到 服务器的磁盘上 ，并将图片、音频和视频的访问路径存储到MySQL中。

## JSON 类型

JSON（JavaScript Object Notation）是一种轻量级的 数据交换格式 。简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言。它易于人阅读和编写，同时也易于机器解析和生成，并有效地提升网络传输效率。

JSON 可以将 JavaScript 对象中表示的一组数据转换为字符串，然后就可以在网络或者程序之间轻松地传递这个字符串，并在需要的时候将它还原为各编程语言所支持的数据格式。

```sql
CREATE TABLE test_json(
js json
);

INSERT INTO test_json (js) 
VALUES ('{"name":"songhk", "age":18, "address":{"province":"beijing", "city":"beijing"}}');

# 当需要检索JSON类型的字段中数据的某个具体值时，
# 可以使用“->”和“->>”符号查询出了指定的JSON数据的值。
SELECT js -> '$.name' AS NAME,js -> '$.age' AS age ,js -> '$.address.province' AS province, js -> '$.address.city' AS city
FROM test_json;
```

## 空间类型

MySQL 空间类型扩展支持地理特征的生成、存储和分析。这里的地理特征表示世界上具有位置的任何东西，可以是一个实体，例如一座山；可以是空间，例如一座办公楼；也可以是一个可定义的位置，例如一个十字路口等等。

MySQL中使用 `Geometry` 来表示所有地理特征。Geometry指一个点或点的集合，代表世界上任何具有位置的事物。

MySQL的空间数据类型（Spatial Data Type）对应于OpenGIS类，包括

- 单值类型：GEOMETRY、POINT、LINESTRING、POLYGON
- 集合类型：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION

## 小结

在定义数据类型时，如果确定是整数 ，就用 `INT` ； 如果是小数 ，一定用定点数类型 `DECIMAL(M,D)` ； 如果是日期与时间，就用 `DATETIME` 。

对于字符串类型：

- 如果存储的字符串长度几乎相等，使用 `CHAR` 定长字符串类型。
- `VARCHAR` 是可变长字符串，不预先分配存储空间，长度不要超过 5000。
- 如果存储长度大于此值，定义字段类型为 `TEXT`，独立出来一张表，用主键来对应，避免影响其它字段索引效率。

# 第11章：创建和管理表

## 创建数据库

```sql
# 方式1：创建数据库
CREATE DATABASE 数据库名;

# 方式2：创建数据库并指定字符集
CREATE DATABASE 数据库名 CHARACTER SET 字符集;

# 方式3：判断数据库是否已经存在，不存在则创建数据库（推荐）
CREATE DATABASE IF NOT EXISTS 数据库名;
```

> 注意：DATABASE 一经创建不能改名。一些可视化工具可以改名，它是建新库，把所有表复制到新库，再删旧库完成的。

## 使用数据库

```sql
# 查看当前所有的数据库
SHOW DATABASES;

# 查看当前正在使用的数据库
SELECT DATABASE();

# 使用/切换数据库
USE 数据库名;
```

查看指定库下所有的表：

```sql
SHOW TABLES FROM 数据库名;
```

查看数据库的创建信息：

```sql
SHOW CREATE DATABASE 数据库名;
# 或
SHOW CREATE DATABASE 数据库名\G
```

> 注意：要操作表格和数据之前必须先说明是对哪个数据库进行操作，否则就要对所有对象加上 `数据库名.` 。

## 修改数据库

更改数据库字符集：

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集;  #比如：gbk、utf8等
```

## 删除数据库

```sql
# 方式1：删除指定的数据库
DROP DATABASE 数据库名;

# 方式2：删除指定的数据库（推荐）
DROP DATABASE IF EXISTS 数据库名;
```

## 创建表

创建表的前提：CREATE TABLE权限 和 存储空间。

```sql
CREATE TABLE [IF NOT EXISTS] 表名(
	字段1, 数据类型 [约束条件] [默认值],
	字段2, 数据类型 [约束条件] [默认值],
	字段3, 数据类型 [约束条件] [默认值],
	……
	[表约束条件]
);
```

另一种创建表的方式：使用 AS subquery 选项，将创建表和插入数据结合起来。

```sql
CREATE TABLE emp1 
AS 
SELECT * FROM employees;

CREATE TABLE emp2 
AS
SELECT * FROM employees WHERE 1=2; # 创建的emp2是空表
```

## 查看表结构

MySQL支持使用 DESCRIBE/DESC 语句查看数据表结构，也支持使用 SHOW CREATE TABLE 语句查看数据表结构。

```sql
SHOW CREATE TABLE 表名\G
```

> 使用SHOW CREATE TABLE语句不仅可以查看表创建时的详细语句，还可以查看存储引擎和字符编码。

## 修改表

使用 ALTER TABLE 语句可以实现：

- 向已有的表中**添加**列

```sql
ALTER TABLE 表名 
ADD 【COLUMN】 字段名 字段类型 【FIRST|AFTER 字段名】;

ALTER TABLE dept80
ADD job_id varchar(15);
```

- **修改**现有表中的列。可以修改列的数据类型、长度、默认值和位置

```sql
ALTER TABLE 表名 
MODIFY 【COLUMN】 字段名1 字段类型 【DEFAULT 默认值】【FIRST|AFTER 字段名2】;

ALTER TABLE dept80
MODIFY salary double(9,2) default 1000;
```

- **删除**现有表中的列

```sql
ALTER TABLE 表名 
DROP 【COLUMN】字段名

ALTER TABLE dept80
DROP COLUMN job_id;
```

- **重命名**现有表中的列

```sql
ALTER TABLE 表名 
CHANGE 【column】 列名 新列名 新数据类型;

ALTER TABLE dept80
CHANGE department_name dept_name varchar(15);
```

## 重命名表

```sql
# 方式一：使用RENAME（推荐）
RENAME TABLE emp
TO myemp;

# 方式二
ALTER table dept
RENAME [TO] detail_dept; -- [TO]可以省略
```

## 删除表

在MySQL中，当一张数据表【没有与其他任何数据表形成关联关系】时，可以将当前数据表直接删除。

- 数据和结构都被删除
- 所有正在运行的相关事务被提交（DROP TABLE 语句不能回滚）
- 所有相关索引被删除

```sql
DROP TABLE [IF EXISTS] 数据表1 [, 数据表2, …, 数据表n];
```

## 清空表

TRUNCATE TABLE语句：

- 删除表中所有的数据
- 释放表的存储空间
- TRUNCATE语句**不能回滚**，而使用 DELETE 语句删除数据，可以回滚

```sql
TRUNCATE TABLE detail_dept;
```

# 第12章：数据处理之增删改

## 插入数据

方式1：通过 VALUES 的方式添加

```sql
# 情况1：没有指明添加的字段
INSERT INTO 表名
VALUES (value1,value2,...);

# 情况2：指明要添加的字段（推荐）
INSERT INTO table_name(column1 [, column2, ..., columnn])
VALUES (value1,value2,...);

# 情况3：同时插入多条记录
INSERT INTO table_name VALUES
(value1 [,value2, ..., valuen]),
(value1 [,value2, ..., valuen]),
......
(value1 [,value2, ..., valuen]);
```

方式2：将查询结果插入到表中。

INSERT还可以将SELECT语句查询的结果插入到表中，此时不需要把每一条记录的值一个一个输入，只需要使用一条INSERT语句和一条SELECT语句组成的组合语句即可。

```sql
INSERT INTO 目标表名(tar_column1 [, tar_column2, …, tar_columnn])
SELECT (src_column1 [, src_column2, …, src_columnn])
FROM 源表名
[WHERE condition]

INSERT INTO emp1(id,NAME,salary,hire_date)
SELECT employee_id,last_name,salary,hire_date  #查询的字段一定要与添加到的表的字段一一对应
FROM employees
WHERE department_id IN (70,60);
```

> emp1表中要添加数据的字段的长度不能低于employees表中查询的字段的长度。
> 如果emp1表中要添加数据的字段的长度低于employees表中查询的字段的长度的话，就有添加不成功的风险。

## 更新数据

```sql
UPDATE table_name
SET column1=value1, column2=value2, ..., column=valuen
[WHERE condition]

UPDATE employees
SET department_id = 70
WHERE employee_id = 113;
```

## 删除数据

```sql
DELETE FROM table_name 
[WHERE <condition>]
```

## 计算列

什么叫计算列？简单来说就是某一列的值是通过别的列计算得来的。例如，a列值为1、b列值为2，c列不需要手动插入，定义a+b的结果为c的值，那么c就是计算列，是通过别的列计算得来的。

在MySQL 8.0中，CREATE TABLE 和 ALTER TABLE 中都支持增加计算列。

```sql
CREATE TABLE tb1(
	id INT,
	a INT,
	b INT,
	c INT GENERATED ALWAYS AS (a + b) VIRTUAL
);
```

# 第13章：约束

约束是表级的强制规定。

- 可以在创建表时规定约束（通过 `CREATE TABLE` 语句）
- 或者在表创建之后通过 `ALTER TABLE` 语句规定约束。

> [!info] 数据完整性（Data Integrity）
> 数据完整性是指数据的精确性（Accuracy）和可靠性（Reliability）。它是防止数据库中存在不符合语义规定的数据和防止因错误信息的输入输出造成无效操作或错误信息而提出的。

为了保证数据的完整性，SQL规范以**约束**的方式对表数据进行额外的条件限制：

- 实体完整性（Entity Integrity）例如，同一个表中，不能存在两条完全相同无法区分的记录
- 域完整性（Domain Integrity）例如：年龄范围0-120，性别范围“男/女”
- 引用完整性（Referential Integrity）例如：员工所在部门，在部门表中要能找到这个部门
- 用户自定义完整性（User-defined Integrity）例如：用户名唯一、密码不能为空等

约束的分类：

- 根据约束数据列的限制，约束可分为：
	- 单列约束：每个约束只约束一列
	- 多列约束：每个约束可约束多列数据
- 根据约束的作用范围，约束可分为：
	- 列级约束：只能作用在一个列上，跟在列的定义后面
	- 表级约束：可以作用在多个列上，不与列一起，而是单独定义
- 根据约束起的作用，约束可分为：
	- `NOT NULL` 非空约束，规定某个字段不能为空
	- `UNIQUE` 唯一约束，规定某个字段在整个表中是唯一的
	- `PRIMARY KEY` 主键(非空且唯一)约束
	- `FOREIGN KEY` 外键约束
	- `CHECK` 检查约束
	- `DEFAULT` 默认值约束

查看某个表已有的约束。

```sql
#information_schema 数据库名（系统库）
#table_constraints  表名称（专门存储各个表的约束）
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'employees';
```

## 非空约束

非空约束 `NOT NULL` 用于限定某个字段/某列的值不允许为空。

- 非空约束是单列约束
- 一个表可以有很多列都分别限定了非空

### 添加约束

建表时添加非空约束：

```sql
CREATE TABLE 表名称(
字段名 数据类型,
字段名 数据类型 NOT NULL,
字段名 数据类型 NOT NULL
);
```

建表后添加非空约束：

```sql
alter table 表名称 
modify 字段名 数据类型 not null;
```

### 删除约束

删除非空约束：

```sql
alter table 表名称 
modify 字段名 数据类型 NULL;
-- 或
alter table 表名称 
modify 字段名 数据类型;
```

## 唯一性约束

唯一性约束 `UNIQUE` 用来限制某个字段/某列的值不能重复（允许重复多个空值 NULL）。

- 同一个表可以有多个唯一约束。
- 唯一约束可以是某一个列的值唯一，也可以多个列组合的值唯一。
- 在创建唯一约束的时候，如果不给唯一约束命名，就默认和列名相同。
- **MySQL会给唯一约束的列上默认创建一个唯一索引**。

### 添加约束

建表时添加唯一性约束：

```sql
-- 方式一
create table 表名称(
字段名 数据类型,
-- 列级约束
字段名 数据类型 UNIQUE, 
字段名 数据类型 UNIQUE KEY,
字段名 数据类型
);

-- 方式二
create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
-- 表级约束
[constraint 约束名] UNIQUE KEY(字段名)
);

-- 举例
CREATE TABLE USER(
id INT NOT NULL,
name VARCHAR(25),
password VARCHAR(16),
CONSTRAINT uk_name_pwd UNIQUE(name,password)
);
```

建表后指定唯一性约束：

```sql
-- 方式一：字段列表可以是一个字段，也可以是多个字段，如果是多个字段的话，是复合主键
alter table 表名称
add UNIQUE KEY(字段列表);

-- 方式二
alter table 表名称 
modify 字段名 字段类型 UNIQUE;

-- 方式三
ALTER TABLE test2
ADD CONSTRAINT uk_test2_sal UNIQUE(salary);
```

添加于复合唯一约束：

```sql
create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
UNIQUE KEY(字段列表) 
);
```

### 删除约束

删除唯一约束只能通过**删除唯一索引**的方式删除。删除时需要指定唯一索引名，唯一索引名就和唯一约束名一样。

如果创建唯一约束时未指定名称，如果是单列，就默认和列名相同；如果是组合列，那么默认和()中排在第一个的列名相同。也可以自定义唯一性约束名。

```sql
-- 查看都有哪些约束
-- 也可以通过 show index from 表名称; 查看表的索引
SELECT * FROM information_schema.table_constraints WHERE table_name = '表名'; 

ALTER TABLE USER
DROP INDEX uk_name_pwd;
```

## 主键约束

主键约束 `PRIMARY KEY` 用来唯一标识表中的一行记录。

- 主键约束相当于**唯一约束+非空约束**的组合，主键约束列不允许重复，也不允许出现空值。
- 一个表最多只能有一个主键约束，建立主键约束可以在列级别创建，也可以在表级别上创建。
- 如果是多列组合的复合主键约束，那么这些列都不允许为空值，并且组合的值不允许重复。
- MySQL的主键名总是PRIMARY，就算自己命名了主键约束名也没用。

> 当创建主键约束时，系统默认会在所在的列或列组合上建立对应的主键索引（能够根据主键查询的，就根据主键查询，效率更高）。如果删除主键约束了，主键约束对应的索引就自动删除了。
> 注意，不要修改主键字段的值。因为主键是数据记录的唯一标识，如果修改了主键的值，就有可能会破坏数据的完整性。

### 添加约束

建表时指定主键约束：

```sql
-- 方式一
create table 表名称(
字段名 数据类型,
-- 列级约束
字段名 数据类型 PRIMARY KEY,
字段名 数据类型
);

-- 方式二
create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
-- 表级约束
[constraint 约束名] PRIMARY KEY(字段名)
);
```

建表后增加主键约束：

```sql
-- 字段列表可以是一个字段，也可以是多个字段，如果是多个字段的话，是复合主键
ALTER TABLE 表名称 
ADD PRIMARY KEY(字段列表);

-- 或者
ALTER TABLE books
MODIFY id INT PRIMARY KEY;
```

添加复合唯一约束：

```sql
create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
PRIMARY KEY(字段列表) 
);
```

### 删除约束

删除主键约束，不需要指定主键名，因为一个表只有一个主键，删除主键约束后，非空还存在。

```sql
ALTER TABLE 表名称 
DROP PRIMARY KEY;
```

> 注意：在实际开发中，不会去删除表中的主键约束！

## 自增约束

自增列 `AUTO_INCREMENT` 用于某个字段的值自增。

- 一个表最多只能有一个自增长列
- 当需要产生唯一标识符或顺序值时，可设置自增长
- 自增长列约束的列必须是**键列**（主键列，唯一键列）

```sql
-- [42000][1075] Incorrect table definition; there can be only one auto column and it must be defined as a key
CREATE TABLE employee(
eid INT AUTO_INCREMENT,
ename VARCHAR(20)
);
```

- 自增约束的列的数据类型必须是**整数类型**

```sql
-- [42000][1063] Incorrect column specifier for column 'ename'
CREATE TABLE employee(
eid INT PRIMARY KEY,
ename VARCHAR(20) UNIQUE KEY AUTO_INCREMENT
);
```

- 如果自增列指定了 0 和 null，会在当前最大值的基础上自增；如果自增列手动指定了具体值，直接赋值为具体值。

### 添加约束

建表时添加自增约束：

```sql
CREATE TABLE 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型 PRIMARY KEY AUTO_INCREMENT,
);

CREATE TABLE 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型 UNIQUE KEY AUTO_INCREMENT,
PRIMARY KEY(字段名)
);
```

开发中，一旦主键作用的字段上声明有AUTO_INCREMENT，则我们在添加数据时，就不要给主键对应的字段去赋值了。

```sql
CREATE TABLE IF NOT EXISTS test7(
id INT PRIMARY KEY AUTO_INCREMENT,
last_name VARCHAR(15) 
);

INSERT INTO test7(last_name)
VALUES('Tom');

-- 当我们向主键（含AUTO_INCREMENT）的字段上添加0 或 null时，
-- 实际上会自动的往上添加指定的字段的数值
INSERT INTO test7(id,last_name)
VALUES(0,'Tom');

INSERT INTO test7(id,last_name)
VALUES(NULL,'Tom');

-- 即使是自增字段也可以指定数值，比如下面的-10和10
-- 而且插入记录的位置根据自增字段升序排序
INSERT INTO test7(id,last_name)
VALUES(10,'Tom');

INSERT INTO test7(id,last_name)
VALUES(-10,'Tom');
```

建表后添加自增约束：

```sql
ALTER TABLE 表名称
MODIFY 字段名 数据类型 AUTO_INCREMENT;
```

### 删除约束

```sql
ALTER TABLE 表名称 
MODIFY 字段名 数据类型; #去掉auto_increment相当于删除
```

## 外键约束

外键约束 `FOREIGN KEY` 用于限定某个表的某个字段的引用完整性。比如：员工表的员工所在部门的选择，必须在部门表能找到对应的部分。

上面例子中的员工表是从表，部门表是主表。

- 主表（父表）：被引用的表，被参考的表
- 从表（子表）：引用别人的表，参考别人的表

主从表的创建与删除：

- 创建表时就指定外键约束的话，先创建主表，再创建从表
- 创建外键约束时，如果不给外键约束命名，默认名不是列名，而是自动产生一个外键名
- **创建从表的外键列，必须引用/参考主表的主键或唯一约束的列**。因为被参考的字段必须是唯一的。
- 删表时，先删从表（或先删除外键约束），再删除主表
	- 当主表的记录被从表参照时，主表的记录将不允许删除，如果要删除数据，需要先删除从表中依赖该记录的数据，然后才可以删除主表的数据

外键约束的索引：

- 当创建外键约束时，系统默认会在所在的列上建立对应的普通索引。索引名是外键的约束名。因为有索引，根据外键查询效率很高
- 删除外键约束后，必须**手动**删除对应的索引

### 添加约束

建表时添加外键约束：

```sql
CREATE TABLE 主表名称(
字段名 数据类型 PRIMARY KEY,
字段名 数据类型
);

CREATE TABLE 从表名称(
字段名 数据类型 PRIMARY KEY,
字段名 数据类型,
[CONSTRAINT <外键约束名称>] FOREIGN KEY（从表的某个字段) REFERENCES 主表名(被参考字段)
);
```

```sql
CREATE TABLE dept( #主表
did INT PRIMARY KEY,  #部门编号
dname VARCHAR(50)     #部门名称
);

CREATE TABLE emp(  #从表
eid INT PRIMARY KEY,  #员工编号
ename VARCHAR(5),     #员工姓名
deptid INT,           #员工所在的部门
FOREIGN KEY (deptid) REFERENCES dept(did)  #在从表中指定外键约束
-- emp表的deptid和和dept表的did的数据类型一致，意义都是表示部门的编号
);
```

建表后添加外键约束：

```sql
ALTER TABLE 从表名
ADD [CONSTRAINT 约束名] FOREIGN KEY (从表的字段) REFERENCES 主表名(被引用字段) 
[on update 约束等级][on delete 约束等级];

-- 举例

ALTER TABLE emp1
ADD [CONSTRAINT emp_dept_id_fk] FOREIGN KEY(dept_id) REFERENCES dept(dept_id);

-- 查看约束
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'emp1';
```

### 约束等级

- `Cascade`方式 ：在父表上update/delete记录时，同步update/delete掉子表的匹配记录
- Set null方式 ：在父表上update/delete记录时，将子表上匹配记录的列设为null，但是要注意子表的外键列不能为not null
- No action方式 ：如果子表中有匹配的记录，则不允许对父表对应候选键进行update/delete作
- `Restrict`方式 ：同no action， 都是立即检查外键约束
- Set default方式 ：父表有变更时，子表将外键列设置成一个默认的值，但Innodb不能识别

> 如果没有指定等级，就相当于`Restrict`方式。
> 对于外键约束，最好是采用: `ON UPDATE CASCADE ON DELETE RESTRICT` 的方式。

### 删除约束

```sql
-- (1)第一步先查看约束名和删除外键约束
SELECT * FROM information_schema.table_constraints 
WHERE table_name = '表名称';

ALTER TABLE 从表名 
DROP FOREIGN KEY 外键约束名;

--（2）第二步查看索引名和删除索引。（注意，只能手动删除）
SHOW INDEX FROM 表名称;

ALTER TABLE 从表名 
DROP INDEX 索引名;
```

## 检查约束

> 注意：MySQL不支持check约束，但可以使用check约束，而没有任何效果

检查约束 `CHECK` 用于检查某个字段的值是否符号xx要求，一般指的是值的范围。

```sql
CREATE TABLE test10(
id INT,
last_name VARCHAR(15),
salary DECIMAL(10,2) CHECK(salary > 2000)
);

-- 添加成功
INSERT INTO test10
VALUES(1,'Tom',2500);

-- 添加失败
-- [HY000][3819] Check constraint 'test10_chk_1' is violated.
INSERT INTO test10
VALUES(2,'Tom1',1500);
```

## 默认值约束

默认值约束 `DEFAULT` 用于给某个字段/某列指定默认值，一旦设置默认值，在插入数据时，如果此字段没有显式赋值，则赋值为默认值。

### 添加约束

建表时添加默认值约束：

```sql
-- 说明：默认值约束一般不在唯一键和主键列上加
CREATE TABLE 表名称(
字段名 数据类型 PRIMARY KEY,
字段名 数据类型 DEFAULT 默认值,
字段名 数据类型 NOT NULL DEFAULT 默认值,
);
```

建表后添加默认值约束：

```sql
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 DEFAULT 默认值;

ALTER TABLE 表名称 
MODIFY 字段名 数据类型 DEFAULT 默认值 NOT NULL;
```

如果这个字段原来有非空约束，你还保留非空约束，那么在加默认值约束时，还得保留非空约束，否则非空约束就被删除了

同理，在给某个字段加非空约束也一样，如果这个字段原来有默认值约束，你想保留，也要在modify语句中保留默认值约束，否则就删除了

### 删除约束

```sql
-- 删除默认值约束，也不保留非空约束
ALTER TABLE 表名称 
MODIFY 字段名 数据类型;

-- 删除默认值约束，保留非空约束
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 NOT NULL; 
```

