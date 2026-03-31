---
title: MySQL 基础-SELECT使用篇
date:
tags:
  - MySQL
category:
  - 数据库
---
# 前言

学习尚硅谷的[《MySQL数据库入门到大牛，mysql安装到优化》](https://www.bilibili.com/video/BV1iq4y1u7vj)的分集

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

# 第03章：基本的SELECT语句

数据导入：

```zsh
mysql> source ~/Downloads/尚硅谷MySQL入门到高级-宋红康版/基础篇/资料/atguigudb.sql
mysql> use atguigudb;
mysql> show tables;
+---------------------+
| Tables_in_atguigudb |
+---------------------+
| countries           |
| departments         |
| emp_details_view    |
| employees           |
| job_grades          |
| job_history         |
| jobs                |
| locations           |
| order               |
| regions             |
+---------------------+
```

## SQL 分类

SQL语言在功能上主要分为如下3大类：

- **DDL（Data Definition Languages、数据定义语言）**，这些语句定义了不同的数据库、表、视图、索引等数据库对象，还可以用来创建、删除、修改数据库和数据表的结构。
	- 主要的语句关键字包括 `CREATE` 、 `DROP` 、 `ALTER` 等。
- **DML（Data Manipulation Language、数据操作语言）**，用于添加、删除、更新和查询数据库记录，并检查数据完整性。
	- 主要的语句关键字包括 `INSERT` 、 `DELETE` 、 `UPDATE` 、 SELECT 等。
	- `SELECT`是SQL语言的基础，最为重要。
- **DCL（Data Control Language、数据控制语言）**，用于定义数据库、表、字段、用户的访问权限和安全级别。
	- 主要的语句关键字包括 `GRANT` 、 `REVOKE` 、 `COMMIT` 、 `ROLLBACK` 、 `SAVEPOINT` 等。

> 因为查询语句使用的非常的频繁，所以很多人把查询语句单拎出来一类：DQL（数据查询语言）。
> 还有单独将 COMMIT 、 ROLLBACK 取出来称为TCL （Transaction Control Language，事务控制语言）。

## SELECT

最基本的SELECT语句： SELECT 字段1,字段2,... FROM 表名。

```sql
SELECT 1 + 1,3 * 2;

SELECT 1 + 1,3 * 2
FROM DUAL; #dual：伪表

# 选择全部列
# * : 表中的所有的字段（或列）
SELECT * 
FROM employees;

# 使用通配符虽然可以节省输入查询语句的时间，但是获取不需要的列数据通常会降低查询和所使用的应用程序的效率。
SELECT employee_id, last_name, salary
FROM employees;
```

列的别名可以使用一对 `""` 引起来，不要使用 `''` 。

- 重命名一个列
- 别名紧跟列名，也可以在列名和别名之间加入关键字AS，别名使用双引号，以便在别名中包含空格或特殊的字符并区分大小写。

```sql
# AS:全称：alias(别名),可以省略
SELECT employee_id emp_id, last_name AS lname, department_id "部门id", salary * 12 AS "annual sal"
FROM employees;
```

### 去除重复行

```sql
#查询员工表中一共有哪些部门id？

#错误的:没有去重的情况
SELECT department_id
FROM employees;

#正确的：使用关键字DISTINCT去重
SELECT DISTINCT department_id
FROM employees;
```

### 空值参与运算

所有运算符或列值遇到null值，运算的结果都为null。

- 空值：null
- null不等同于0，''，'null'

```sql
# 若一条记录的commission_pct为null，则它的年工资也为null，显然我们希望此时的commison_pct为0
SELECT employee_id,salary "月工资",salary * (1 + commission_pct) * 12 "年工资",commission_pct
FROM employees;

#实际问题的解决方案：引入 IFNULL
SELECT employee_id,salary "月工资",salary * (1 + IFNULL(commission_pct,0)) * 12 "年工资",commission_pct
FROM employees;
```

### 着重号

表中的字段、表名等，和保留字、数据库系统或常用方法冲突时，请在SQL语句中使用一对\`\`（着重号）引起来。

```sql
#Order 是关键字，无法直接使用
#SELECT * FROM order;

SELECT * FROM `order`;
```

### 查询常数

在 SELECT 查询结果中增加一列固定的常数列。

```sql
mysql> SELECT '尚硅谷',123,employee_id,last_name
    -> FROM employees;
+-----------+-----+-------------+-------------+
| 尚硅谷    | 123 | employee_id | last_name   |
+-----------+-----+-------------+-------------+
| 尚硅谷    | 123 |         100 | King        |
| 尚硅谷    | 123 |         101 | Kochhar     |
| 尚硅谷    | 123 |         102 | De Haan     |
...
```

### 显示表结构

```sql
mysql> DESC employees;  # 或 DESCRIBE employees; 
+----------------+-------------+------+-----+---------+-------+
| Field          | Type        | Null | Key | Default | Extra |
+----------------+-------------+------+-----+---------+-------+
| employee_id    | int         | NO   | PRI | 0       |       |
| first_name     | varchar(20) | YES  |     | NULL    |       |
| last_name      | varchar(25) | NO   |     | NULL    |       |
| email          | varchar(25) | NO   | UNI | NULL    |       |
| phone_number   | varchar(20) | YES  |     | NULL    |       |
| hire_date      | date        | NO   |     | NULL    |       |
| job_id         | varchar(10) | NO   | MUL | NULL    |       |
| salary         | double(8,2) | YES  |     | NULL    |       |
| commission_pct | double(2,2) | YES  |     | NULL    |       |
| manager_id     | int         | YES  | MUL | NULL    |       |
| department_id  | int         | YES  | MUL | NULL    |       |
+----------------+-------------+------+-----+---------+-------+
11 rows in set (0.00 sec)
```

其中，各个字段的含义分别解释如下：

- Field：表示字段名称。
- Type：表示字段类型。
- Null：表示该列是否可以存储NULL值。
- Key：表示该列是否已编制索引。
	- PRI表示该列是表主键的一部分；
	- UNI表示该列是UNIQUE索引的一部分；
	- MUL表示在列中某个给定值允许出现多次。
- Default：表示该列是否有默认值，如果有，那么值是多少。
- Extra：表示可以获取的与给定列有关的附加信息，例如AUTO_INCREMENT等。

### 过滤数据

```sql
#练习：查询90号部门的员工信息
SELECT *
FROM employees
#过滤条件,声明在FROM结构的后面
WHERE department_id = 90;
```

# 第04章：运算符

## 算术运算符

算术运算符主要用于数学运算，其可以连接运算符前后的两个数值或表达式，对数值或表达式进行加（+）、减（-）、乘（\*）、除（/或div）和取模（%或mod）运算。

```sql
SELECT 100, 100 + 0, 100 - 0, 100 + 50, 100 + 50 * 30, 100 + 35.5, 100 - 35.5 
FROM DUAL;
```

在Java中，+的左右两边如果有字符串，那么表示字符串的拼接。但是在MySQL中 + 只表示数值相加。如果遇到非数值类型，先尝试转成数值，如果转失败，就按0计算。

> MySQL中字符串拼接要使用字符串函数CONCAT()实现）

```sql
mysql> SELECT 100 + '1'  # 在Java语言中，结果是：1001。在sql中，结果是101 
    -> FROM DUAL;
+-----------+
| 100 + '1' |
+-----------+
|       101 |
+-----------+
1 row in set (0.00 sec)

mysql> SELECT 100 + 'a' #此时将'a'看做0处理
    -> FROM DUAL;
+-----------+
| 100 + 'a' |
+-----------+
|       100 |
+-----------+
1 row in set, 1 warning (0.00 sec)
```

乘法与除法运算符：

- 一个数除以整数后，不管是否能除尽，结果都为一个浮点数；
- 一个数除以另一个数，除不尽时，结果为一个浮点数，并保留到小数点后4位；
- 在数学运算中，0不能用作除数，在MySQL中，一个数除以0为 NULL。

```sql
mysql> SELECT 100, 100 * 1, 100 * 1.0, 100 / 1.0, 100 / 2,100 /3, 100 DIV 0 
    -> FROM DUAL;
+-----+---------+-----------+-----------+---------+---------+-----------+
| 100 | 100 * 1 | 100 * 1.0 | 100 / 1.0 | 100 / 2 | 100 /3  | 100 DIV 0 |
+-----+---------+-----------+-----------+---------+---------+-----------+
| 100 |     100 |     100.0 |  100.0000 | 50.0000 | 33.3333 |      NULL |
+-----+---------+-----------+-----------+---------+---------+-----------+
1 row in set, 1 warning (0.00 sec)
```

求模（求余）运算符得到结果的正负号，只与被除数符号相关。

```sql
mysql> SELECT 12 % 5, 12 MOD -5,-12 % 5,-12 % -5
    -> FROM DUAL;
+--------+-----------+---------+----------+
| 12 % 5 | 12 MOD -5 | -12 % 5 | -12 % -5 |
+--------+-----------+---------+----------+
|      2 |         2 |      -2 |       -2 |
+--------+-----------+---------+----------+
1 row in set (0.00 sec)
```

## 比较运算符

比较运算符用来对表达式左边的操作数和右边的操作数进行比较，比较的结果为真则返回1，比较的结果为假则返回0，其他情况则返回 NULL。

### 等号运算符

在使用等号运算符时，遵循如下规则：

- 如果等号两边的值、字符串或表达式都为字符串，则MySQL会按照字符串进行比较，其比较的是每个字符串中字符的ANSI编码是否相等。

```sql
mysql> SELECT 'a' = 'a','ab' = 'ab','a' = 'b' 
    -> FROM DUAL; #两边都是字符串的话，则按照ANSI的比较规则进行比较。
+-----------+-------------+-----------+
| 'a' = 'a' | 'ab' = 'ab' | 'a' = 'b' |
+-----------+-------------+-----------+
|         1 |           1 |         0 |
+-----------+-------------+-----------+
1 row in set (0.00 sec)
```

- 如果等号两边的值一个是整数，另一个是字符串，则MySQL会将字符串转化为数字（转换不成功则看作0）进行比较。

```sql
mysql> SELECT 1 = 2,1 != 2,1 = '1',1 = 'a',0 = 'a' 
    -> FROM DUAL;
+-------+--------+---------+---------+---------+
| 1 = 2 | 1 != 2 | 1 = '1' | 1 = 'a' | 0 = 'a' |
+-------+--------+---------+---------+---------+
|     0 |      1 |       1 |       0 |       1 |
+-------+--------+---------+---------+---------+
1 row in set, 2 warnings (0.00 sec)
```

- 如果等号两边的值都是整数，则MySQL会按照整数来比较两个值的大小。
- 如果等号两边的值、字符串或表达式中有一个为NULL，则比较结果为NULL。

> 不等于运算符（<>和!=）用法类似。

### 安全等于运算符 

安全等于运算符（<=>）与等于运算符（=）的作用是相似的， 唯一的区别 是‘<=>’可
以用来对NULL进行判断。

- 在两个操作数均为NULL时，其返回值为1，而不为NULL；
- 当一个操作数为NULL时，其返回值为0，而不为NULL。

```sql
mysql> SELECT 1 <=> 2,1 <=> '1',1 <=> 'a',0 <=> 'a',1 <=> NULL, NULL <=> NULL
    -> FROM DUAL;
+---------+-----------+-----------+-----------+------------+---------------+
| 1 <=> 2 | 1 <=> '1' | 1 <=> 'a' | 0 <=> 'a' | 1 <=> NULL | NULL <=> NULL |
+---------+-----------+-----------+-----------+------------+---------------+
|       0 |         1 |         0 |         1 |          0 |             1 |
+---------+-----------+-----------+-----------+------------+---------------+
1 row in set, 2 warnings (0.00 sec)
```

### 空运算符与非空运算符

- 空运算符（IS NULL或者ISNULL）判断一个值是否为NULL，如果为NULL则返回1，否则返回 0。
- 非空运算符（IS NOT NULL）判断一个值是否不为NULL，如果不为NULL则返回1，否则返回0。

```sql
mysql> SELECT NULL IS NULL, ISNULL(NULL), ISNULL('a'), 1 IS NULL;
+--------------+--------------+-------------+-----------+
| NULL IS NULL | ISNULL(NULL) | ISNULL('a') | 1 IS NULL |
+--------------+--------------+-------------+-----------+
|            1 |            1 |           0 |         0 |
+--------------+--------------+-------------+-----------+
1 row in set (0.00 sec)

mysql> SELECT NULL IS NOT NULL, 'a' IS NOT NULL,  1 IS NOT NULL;
+------------------+-----------------+---------------+
| NULL IS NOT NULL | 'a' IS NOT NULL | 1 IS NOT NULL |
+------------------+-----------------+---------------+
|                0 |               1 |             1 |
+------------------+-----------------+---------------+
1 row in set (0.00 sec)
```

### 最值运算符

最小值运算符LEAST：

- 当参数是整数或者浮点数时，LEAST将返回其中最小的值；
- 当参数为字符串时，返回字母表中顺序最靠前的字符；
- 当比较值列表中有NULL时，不能判断大小，返回值为NULL。

最大值运算符GREATEST用法类似。

```sql
mysql> SELECT LEAST (1,0,2), LEAST('b','a','c'), LEAST(1,NULL,2);
+---------------+--------------------+-----------------+
| LEAST (1,0,2) | LEAST('b','a','c') | LEAST(1,NULL,2) |
+---------------+--------------------+-----------------+
|             0 | a                  |            NULL |
+---------------+--------------------+-----------------+
1 row in set (0.00 sec)

mysql> SELECT GREATEST(1,0,2), GREATEST('b','a','c'), GREATEST(1,NULL,2);
+-----------------+-----------------------+--------------------+
| GREATEST(1,0,2) | GREATEST('b','a','c') | GREATEST(1,NULL,2) |
+-----------------+-----------------------+--------------------+
|               2 | c                     |               NULL |
+-----------------+-----------------------+--------------------+
1 row in set (0.00 sec)
```

### BETWEEN AND运算符

语法格式：BETWEEN 条件下界1 AND 条件上界2（查询条件1和条件2范围内的数据，包含边界）。

```sql
mysql> SELECT 1 BETWEEN 0 AND 1, 10 BETWEEN 11 AND 12, 'b' BETWEEN 'a' AND 'c';
+-------------------+----------------------+-------------------------+
| 1 BETWEEN 0 AND 1 | 10 BETWEEN 11 AND 12 | 'b' BETWEEN 'a' AND 'c' |
+-------------------+----------------------+-------------------------+
|                 1 |                    0 |                       1 |
+-------------------+----------------------+-------------------------+
1 row in set (0.01 sec)
```

### IN运算符与NOT IN运算符

- IN运算符用于判断给定的值是否是IN列表中的一个值，如果是则返回1，否则返回0。如果给定的值为NULL，则结果为NULL。
- NOT IN运算符用于判断给定的值是否不是IN列表中的一个值，如果不是IN列表中的一个值，则返回1，否则返回0。

```sql
mysql> SELECT 'a' IN ('a','b','c'), 1 IN (2,3), NULL IN ('a','b'), 'a' IN ('a', NULL);
+----------------------+------------+-------------------+--------------------+
| 'a' IN ('a','b','c') | 1 IN (2,3) | NULL IN ('a','b') | 'a' IN ('a', NULL) |
+----------------------+------------+-------------------+--------------------+
|                    1 |          0 |              NULL |                  1 |
+----------------------+------------+-------------------+--------------------+
1 row in set (0.00 sec)

mysql> SELECT 'a' NOT IN ('a','b','c'), 1 NOT IN (2,3);
+--------------------------+----------------+
| 'a' NOT IN ('a','b','c') | 1 NOT IN (2,3) |
+--------------------------+----------------+
|                        0 |              1 |
+--------------------------+----------------+
1 row in set (0.01 sec)
```

### LIKE运算符 

LIKE运算符主要用来匹配字符串，通常用于模糊匹配，如果满足条件则返回1，否则返回0。如果给定的值或者匹配条件为NULL，则返回结果为NULL。

```sql
# % : 代表不确定个数的字符 （0个，1个，或多个）

#练习：查询last_name中包含字符'a'的员工信息
SELECT last_name
FROM employees
WHERE last_name LIKE '%a%';

#练习：查询last_name中以字符'a'开头的员工信息
SELECT last_name
FROM employees
WHERE last_name LIKE 'a%';

#练习：查询last_name中包含字符'a'且包含字符'e'的员工信息
#写法1：
SELECT last_name
FROM employees
WHERE last_name LIKE '%a%' AND last_name LIKE '%e%';
#写法2：
SELECT last_name
FROM employees
WHERE last_name LIKE '%a%e%' OR last_name LIKE '%e%a%';

# _ ：代表一个不确定的字符

#练习：查询第3个字符是'a'的员工信息
SELECT last_name
FROM employees
WHERE last_name LIKE '__a%';

#练习：查询第2个字符是_且第3个字符是'a'的员工信息
#需要使用转义字符: \ 
SELECT last_name
FROM employees
WHERE last_name LIKE '_\_a%';

#如果使用\表示转义，要省略ESCAPE。如果不是\，则要加上ESCAPE。
SELECT last_name
FROM employees
WHERE last_name LIKE '_$_a%' ESCAPE '$';
```

### REGEXP运算符

REGEXP运算符用来匹配字符串，语法格式为： `expr REGEXP 匹配条件` 。如果expr满足匹配条件，返回1；如果不满足，则返回0。若expr或匹配条件任意一个为NULL，则结果为NULL。

REGEXP运算符在进行匹配时，常用的有下面几种通配符：

```txt
（1）‘^’匹配以该字符后面的字符开头的字符串。
（2）‘$’匹配以该字符前面的字符结尾的字符串。
（3）‘.’匹配任何一个单字符。
（4）“[...]”匹配在方括号内的任何字符。例如，“[abc]”匹配“a”或“b”或“c”。为了命名字符的范围，使用一个‘-’。“[a-z]”匹配任何字母，而“[0-9]”匹配任何数字。
（5）‘*’匹配零个或多个在它前面的字符。例如，“x*”匹配任何数量的‘x’字符，“[0-9]*”匹配任何数量的数字，而“*”匹配任何数量的任何字符。
```

```sql
SELECT 'shkstart' REGEXP '^shk', 'shkstart' REGEXP 't$', 'shkstart' REGEXP 'hk'
FROM DUAL;

SELECT 'atguigu' REGEXP 'gu.gu','atguigu' REGEXP '[ab]'
FROM DUAL;
```

### 逻辑运算符

逻辑运算符主要用来判断表达式的真假，在MySQL中，逻辑运算符的返回结果为1、0或者NULL。

```sql
# 逻辑非运算符（NOT或!）
mysql>  SELECT NOT 1, NOT 0, NOT(1+1), NOT !1, NOT NULL;
+-------+-------+----------+--------+----------+
| NOT 1 | NOT 0 | NOT(1+1) | NOT !1 | NOT NULL |
+-------+-------+----------+--------+----------+
|     0 |     1 |        0 |      1 |     NULL |
+-------+-------+----------+--------+----------+
1 row in set, 1 warning (0.00 sec)

# 逻辑与运算符（AND或&&）
mysql> SELECT 1 AND -1, 0 AND 1, 0 AND NULL, 1 AND NULL;
+----------+---------+------------+------------+
| 1 AND -1 | 0 AND 1 | 0 AND NULL | 1 AND NULL |
+----------+---------+------------+------------+
|        1 |       0 |          0 |       NULL |
+----------+---------+------------+------------+
1 row in set (0.00 sec)

# 逻辑或运算符（OR或||）
mysql> SELECT 1 OR -1, 1 OR 0, 1 OR NULL, 0 || NULL, NULL || NULL;
+---------+--------+-----------+-----------+--------------+
| 1 OR -1 | 1 OR 0 | 1 OR NULL | 0 || NULL | NULL || NULL |
+---------+--------+-----------+-----------+--------------+
|       1 |      1 |         1 |      NULL |         NULL |
+---------+--------+-----------+-----------+--------------+
1 row in set, 2 warnings (0.00 sec)

# 逻辑异或运算符（XOR）
mysql>  SELECT 1 XOR -1, 1 XOR 0, 0 XOR 0, 1 XOR NULL, 0 XOR NULL;
+----------+---------+---------+------------+------------+
| 1 XOR -1 | 1 XOR 0 | 0 XOR 0 | 1 XOR NULL | 0 XOR NULL |
+----------+---------+---------+------------+------------+
|        0 |       1 |       0 |       NULL |       NULL |
+----------+---------+---------+------------+------------+
1 row in set (0.00 sec)
```

### 位运算符

位运算符是在二进制数上进行计算的运算符。位运算符会先将操作数变成二进制数，然后进行位运算，最后将计算结果从二进制变回十进制数。

位运算符包括：按位与 `&` 、按位或 `|` 、按位异或 `^` 、按位取反 `~` 、按位右移 `>>` 、按位左移 `<<` 。

# 第05章：排序与分页

## 排序规则

使用 ORDER BY 对查询到的数据进行排序操作。如果在ORDER BY 后没有显式指名排序的方式的话，则默认按照升序排列。

- 升序：ASC (ascend)，
- 降序：DESC (descend)

```sql
# 我们可以使用列的别名，进行排序
# 列的别名只能在 ORDER BY 中使用，不能在WHERE中使用。
SELECT employee_id,salary,salary * 12 annual_sal
FROM employees
ORDER BY annual_sal;
```

## 多列排序（二级排序）

在对多列进行排序的时候，首先排序的第一列必须有相同的列值，才会对第二列进行排序。如果第一列数据中所有值都是唯一的，将不再对第二列进行排序。

```sql
# 练习：显示员工信息，按照department_id的降序排列，salary的升序排列
SELECT employee_id,salary,department_id
FROM employees
ORDER BY department_id DESC,salary ASC;
```

##  分页

 分页显示，就是将数据库中的结果集，一段一段显示出来需要的条件。MySQL中使用 LIMIT 实现分页。
 
格式：`LIMIT [位置偏移量,] 行数`

- 第一个“位置偏移量”参数指示MySQL从哪一行开始显示，是一个可选参数，如果不指定“位置偏移量”，将会从表中的第一条记录开始（第一条记录的位置偏移量是0）
- 第二个参数“行数”指示返回的记录条数。
- 分页显式公式：`（当前页数-1）* 每页条数，每页条数`

```sql
# 每页显示20条记录，此时显示第1页
SELECT employee_id,last_name
FROM employees
LIMIT 0,20;

# 每页显示20条记录，此时显示第2页
SELECT employee_id,last_name
FROM employees
LIMIT 20,20;
```

MySQL8.0新特性：`LIMIT ... OFFSET ...`

```sql
# 表里有107条数据，我们只想要显示第 32、33 条数据怎么办呢？
SELECT employee_id,last_name
FROM employees
LIMIT 31,2;

SELECT employee_id,last_name
FROM employees
LIMIT 2 OFFSET 31;
```

注意：LIMIT 子句必须放在整个SELECT语句的最后！

```sql
# WHERE ... ORDER BY ... LIMIT 声明顺序如下：
SELECT employee_id,last_name,salary
FROM employees
WHERE salary > 6000
ORDER BY salary DESC
#limit 0,10;
LIMIT 10;
```

使用 LIMIT 的好处：

- 约束返回结果的数量可以减少数据表的网络传输量 ，也可以提升查询效率。
- 如果我们知道返回结果只有1条，就可以使用 LIMIT 1，告诉 SELECT 语句只需要返回一条记录即可。这样的好处就是 SELECT 不需要扫描完整的表，只需要检索到一条符合条件的记录即可返回。

> LIMIT 可以在MySQL、PGSQL、MariaDB、SQLite 等数据库中使用，表示分页。
> 但不能在SQL Server、DB2、Oracle使用

# 第06章：多表查询

## 笛卡尔积（交叉连接）

笛卡尔乘积是一个数学运算。假设有两个集合 X 和 Y，那么 X 和 Y 的笛卡尔积就是 X 和 Y 的所有可能组合。组合的个数即为两个集合中元素个数的乘积数。

笛卡尔积也称为交叉连接，英文是 `CROSS JOIN` 。交叉连接的作用就是可以把任意表进行连接，即使这两张表不相关。在MySQL中如下情况会出现笛卡尔积：

```sql
# 关键字 JOIN、INNER JOIN、CROSS JOIN 的含义是一样的，都表示内连接
SELECT last_name,department_name FROM employees,departments;
SELECT last_name,department_name FROM employees CROSS JOIN departments;
SELECT last_name,department_name FROM employees INNER JOIN departments;
SELECT last_name,department_name FROM employees JOIN departments;
```

为了避免笛卡尔积， 可以在 WHERE 加入有效的连接条件。

```sql
SELECT last_name, department_name
FROM employees, departments
WHERE employees.department_id = departments.department_id;
```

注意：

```sql
# 1. 多个表中有相同列时，必须在列名之前加上表名前缀。
# 2. 使用别名可以简化查询。如果我们使用了表的别名，在查询字段中、过滤条件中就只能使用别名进行代替，不能使用原有的表名，否则就会报错。
SELECT emp.employee_id,dept.department_name,emp.department_id
FROM employees emp,departments dept
WHERE emp.department_id = dept.department_id;
```

> 建议：从sql优化的角度，建议多表查询时，每个字段前都指明其所在的表。

## 内连接、外连接

内连接: 合并具有同一列的两个以上的表的行, 结果集中**不包含一个表与另一个表不匹配的行**。

外连接: 两个表在连接过程中除了返回满足连接条件的行以外，还**返回左（或右）表中不满足条件的行** ，这种连接称为左（或右） 外连接。没有匹配的行时, 结果表中相应的列为空(NULL)。

- 如果是左外连接，则连接条件中左边的表也称为 主表 ，右边的表称为 从表 。
- 如果是右外连接，则连接条件中右边的表也称为 主表 ，左边的表称为 从表 。

```sql
# 内连接语法 INNER
SELECT 字段列表
FROM A表 INNER JOIN B表
ON 关联条件
WHERE 等其他子句;

# 左外连接语法 LEFT
SELECT 字段列表
FROM A表 LEFT JOIN B表
ON 关联条件
WHERE 等其他子句;

# 右外连接语法 RIGHT
SELECT 字段列表
FROM A表 RIGHT JOIN B表
ON 关联条件
WHERE 等其他子句;
```

## 满外连接

满外连接的结果 = 左右表匹配的数据 + 左表没有匹配到的数据 + 右表没有匹配到的数据。

- SQL99是支持满外连接的。使用FULL JOIN 或 FULL OUTER JOIN来实现。
- 但是，MySQL不支持FULL JOIN，用 `LEFT JOIN UNION RIGHT JOIN` 代替。

利用UNION关键字，可以给出多条SELECT语句，并将它们的结果组合成单个结果集。合并
时，两个表对应的列数和数据类型必须相同，并且相互对应。各个SELECT语句之间使用 `UNION` 或 `UNION ALL` 关键字分隔。

- UNION 操作符返回两个查询的结果集的并集，**去除重复**记录。
- UNION ALL操作符返回两个查询的结果集的并集。对于两个结果集的重复部分，**不去重**。

> 因为不需要去重，执行UNION ALL语句时所需要的资源比UNION语句少，用UNION ALL语句，数据查询的效率更高。

```sql
# 举例：查询部门编号>90或邮箱包含a的员工信息

#方式1
SELECT * FROM employees WHERE email LIKE '%a%' OR department_id > 90;

#方式2
SELECT * FROM employees
WHERE email LIKE '%a%'
UNION
SELECT * FROM employees
WHERE department_id > 90;
```

![SQL JOIN](https://vip.123pan.cn/1844935313/obsidian/20260314152453384.png)

对上图的说明：

- 左上图是左外连接
- 右上图是右外连接
- 中间图是内连接
- 左中图是 `B.Key IS NULL` 的左外连接
- 右中图是 `A.Key IS NULL` 的右外连接
- 左下图是满外连接
- 右下图是 `A.Key IS NULL OR B.Key IS NULL` 的满外连接
- `UNION` 可以用 `左上图 UNION ALL 右中图` 或 `左中图 UNION ALL 右上图` 代替

## 其他连接

- 自然连接 `NATURAL JOIN` 会自动查询两张连接表中所有相同的字段，然后进行等值连接。
- `USING` 指定数据表里的 同名字段 进行等值连接。但是只能配合JOIN一起使用。

```sql
# USING连接
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
USING (department_id);

# 等同于
SELECT employee_id,last_name,department_name
FROM employees e ,departments d
WHERE e.department_id = d.department_id;
```

# 第07章：单行函数

MySQL提供的内置函数，从实现的功能角度可以分为数值函数、字符串函数、日期和时间函数、流程控制函数、加密与解密函数、获取MySQL信息函数、聚合函数等。

这些内置函数可以再分为两类： 单行函数 、 聚合函数（或分组函数）。

单行函数：

- 操作数据对象
- 接受参数返回一个结果
- **只对一行进行变换**
- **每行返回一个结果**
- 可以嵌套
- 参数可以是一列或一个值

## 数值函数

### 基本函数

| 函数                    | 用法                                  |
| --------------------- | ----------------------------------- |
| ABS(x)                | 返回x的绝对值                             |
| SIGN(x)               | 返回x的符号。正数返回1，负数返回-1，0返回0            |
| PI()                  | 返回圆周率的值                             |
| CEIL(x), CEILING(x)   | 返回大于或等于某个值的最小整数                     |
| FLOOR(x)              | 返回小于或等于某个值的最大整数                     |
| LEAST(e1,e2,e3...)    | 返回列表中的最小值                           |
| GREATEST(e1,e2,e3...) | 返回列表中的最大值                           |
| MOD(x,y)              | 返回x除以y后的余数                          |
| RAND()                | 返回0~1的随机值                           |
| RAND(x)               | 返回0~1的随机值，其中x的值用作种子值，相同的x值会产生相同的随机数 |
| ROUND(x)              | 返回一个对x的值进行四舍五入后，最接近于x的整数            |
| ROUND(x,y)            | 返回一个对x的值进行四舍五入后最接近x的值，并保留到小数点后面y位   |
| TRUNCATE(x,y)         | 返回数字截断为y位小数的结果                      |
| SQRT(x)               | 返回x的平方根。当x的值为负数时，返回NULL             |

### 角度与弧度互换函数

| 函数         | 用法                  |
| ---------- | ------------------- |
| RADIANS(x) | 将角度转化为弧度，其中，参数x为角度值 |
| DEGREES(x) | 将弧度转化为角度，其中，参数x为弧度值 |

### 三角函数

| 函数         | 用法                                                              |
| ---------- | --------------------------------------------------------------- |
| SIN(x)     | 返回x的正弦值，其中，参数x为弧度值                                              |
| ASIN(x)    | 返回x的反正弦值，即获取正弦为x的值。如果x的值不在-1到1之间，则返回NULL                        |
| COS(x)     | 返回x的余弦值，其中，参数x为弧度值                                              |
| ACOS(x)    | 返回x的反余弦值，即获取余弦为x的值。如果x的值不在-1到1之间，则返回NULL                        |
| TAN(x)     | 返回x的正切值，其中，参数x为弧度值                                              |
| ATAN(x)    | 返回x的反正切值，即返回正切值为x的值                                             |
| ATAN2(m,n) | 返回点 `(m, n)` 的反正切值（即从原点 `(0, 0)` 到点 `(m, n)` 的向量与 x 轴正方向的夹角弧度值） |
| COT(x)     | 返回x的余切值，其中，x为弧度值                                                |

### 指数与对数

| 函数                  | 用法                                |
| ------------------- | --------------------------------- |
| POW(x,y)，POWER(X,Y) | 返回x的y次方                           |
| EXP(X)              | 返回e的X次方，其中e是自然常数                  |
| LN(X)，LOG(X)        | 返回以e为底的X的对数，当X <= 0 时，返回的结果为NULL  |
| LOG10(X)            | 返回以10为底的X的对数，当X <= 0 时，返回的结果为NULL |
| LOG2(X)             | 返回以2为底的X的对数，当X <= 0 时，返回NULL      |

### 进制间的转换

| 函数            | 用法                     |
| ------------- | ---------------------- |
| BIN(x)        | 返回x的二进制编码              |
| HEX(x)        | 返回x的十六进制编码             |
| OCT(x)        | 返回x的八进制编码              |
| CONV(x,f1,f2) | 返回**f1进制**数变成**f2进制数** |

## 字符串函数

| 函数            | 用法                     |
| ------------- | ---------------------- |
| ASCII(S) | 返回字符串S中的第一个字符的ASCII码值 |
| CHAR_LENGTH(s) | 返回字符串s的字符数。作用与CHARACTER_LENGTH(s)相同 |
| LENGTH(s) | 返回字符串s的字节数，和字符集有关 |
| CONCAT(s1,s2,......,sn) | 连接s1,s2,......,sn为一个字符串 |
| CONCAT_WS(x,s1,s2,......,sn) | 同CONCAT(s1,s2,...)函数，但是每个字符串之间要加上x |
| INSERT(str, idx, len, replacestr) | 将字符串str从第idx位置开始，len个字符长的子串替换为字符串replacestr |
| REPLACE(str, a, b) | 用字符串b替换字符串str中所有出现的字符串a |
| UPPER(s) 或 UCASE(s) | 将字符串s的所有字母转成大写字母 |
| LOWER(s) 或LCASE(s) | 将字符串s的所有字母转成小写字母 |
| LEFT(str,n) | 返回字符串str最左边的n个字符 |
| RIGHT(str,n) | 返回字符串str最右边的n个字符 |
| LPAD(str, len, pad) | 用字符串pad对str最左边进行填充，直到str的长度为len个字符 |
| RPAD(str ,len, pad) | 用字符串pad对str最右边进行填充，直到str的长度为len个字符 |
| LTRIM(s) | 去掉字符串s左侧的空格 |
| RTRIM(s) | 去掉字符串s右侧的空格 |
| TRIM(s) | 去掉字符串s开始与结尾的空格 |
| TRIM(s1 FROM s) | 去掉字符串s开始与结尾的s1 |
| TRIM(LEADING s1 FROM s) | 去掉字符串s开始处的s1 |
| TRIM(TRAILING s1 FROM s) | 去掉字符串s结尾处的s1 |
| REPEAT(str, n) | 返回str重复n次的结果 |
| SPACE(n) | 返回n个空格 |
| STRCMP(s1,s2) | 比较字符串s1,s2的ASCII码值的大小 |
| SUBSTR(s,index,len) | 返回从字符串s的index位置其len个字符，作用与SUBSTRING(s,n,len)、MID(s,n,len)相同 |
| LOCATE(substr,str) | 返回字符串substr在字符串str中首次出现的位置，作用与POSITION(substr IN str)、INSTR(str,substr)相同。未找到，返回0 |
| ELT(m,s1,s2,…,sn) | 返回指定位置的字符串，如果m=1，则返回s1；如果m=2，则返回s2；如果m=n，则返回sn |
| FIELD(s,s1,s2,…,sn) | 返回字符串s在字符串列表中第一次出现的位置 |
| FIND_IN_SET(s1,s2) | 返回字符串s1在字符串s2中出现的位置。其中，字符串s2是一个以逗号分隔的字符串 |
| REVERSE(s) | 返回s反转后的字符串 |
| NULLIF(value1,value2) | 比较两个字符串，如果value1与value2相等，则返回NULL，否则返回value1 |

## 日期和时间函数

### 获取日期、时间

| 函数            | 用法                     |
| ------------- | ---------------------- |
| CURDATE()，CURRENT_DATE() | 返回当前日期，只包含年、月、日 |
| CURTIME()，CURRENT_TIME() | 返回当前时间，只包含时、分、秒 |
| NOW() / SYSDATE() / CURRENT_TIMESTAMP() / LOCALTIME() / LOCALTIMESTAMP() | 返回当前系统日期和时间 |
| UTC_DATE() | 返回UTC（世界标准时间）日期 |
| UTC_TIME() | 返回UTC（世界标准时间）时间 |

### 日期与时间戳的转换

| 函数            | 用法                     |
| ------------- | ---------------------- |
| UNIX_TIMESTAMP() | 以UNIX时间戳的形式返回当前时间。|
| UNIX_TIMESTAMP(date) | 将时间date以UNIX时间戳的形式返回。|
| FROM_UNIXTIME(timestamp) | 将UNIX时间戳的时间转换为普通格式的时间 |

### 获取月份、星期、星期数、天数等函数

| 函数            | 用法                     |
| ------------- | ---------------------- |
| YEAR(date) / MONTH(date) / DAY(date) | 返回具体的日期值 |
| HOUR(time) / MINUTE(time) / SECOND(time) | 返回具体的时间值 |
| MONTHNAME(date) | 返回月份：January，... |
| DAYNAME(date) | 返回星期几：MONDAY，TUESDAY.....SUNDAY |
| WEEKDAY(date) | 返回周几，注意，周1是0，周2是1，...周日是6 |
| QUARTER(date) | 返回日期对应的季度，范围为1～4 |
| WEEK(date)，WEEKOFYEAR(date) | 返回一年中的第几周 |
| DAYOFYEAR(date) | 返回日期是一年中的第几天 |
| DAYOFMONTH(date) | 返回日期位于所在月份的第几天 |
| DAYOFWEEK(date) | 返回周几，注意：周日是1，周一是2，...周六是7 |

### 日期的操作函数

| 函数            | 用法                     |
| ------------- | ---------------------- |
| EXTRACT(type FROM date) | 返回指定日期中特定的部分，type指定返回的值 |

![type的取值与含义|600x0](https://vip.123pan.cn/1844935313/obsidian/20260330190222950.png)

### 计算日期和时间的函数 

| 函数            | 用法                     |
| ------------- | ---------------------- |
| DATE_ADD(datetime, INTERVAL expr type)，ADDDATE(date,INTERVAL expr type) | 返回与给定日期时间相差INTERVAL时间段的日期时间 |
| DATE_SUB(date,INTERVAL expr type)，SUBDATE(date,INTERVAL expr type) | 返回与date相差INTERVAL时间间隔的日期 |
| ADDTIME(time1,time2) | 返回time1加上time2的时间。当time2为一个数字时，代表的是秒 ，可以为负数 |
| SUBTIME(time1,time2) | 返回time1减去time2后的时间。当time2为一个数字时，代表的是秒 ，可以为负数 |
| DATEDIFF(date1,date2) | 返回date1 - date2的日期间隔天数 |
| TIMEDIFF(time1, time2) | 返回time1 - time2的时间间隔 |
| FROM_DAYS(N) | 返回从0000年1月1日起，N天以后的日期 |
| TO_DAYS(date) | 返回日期date距离0000年1月1日的天数 |
| LAST_DAY(date) | 返回date所在月份的最后一天的日期 |
| MAKEDATE(year,n) | 针对给定年份与所在年份中的天数返回一个日期 |
| MAKETIME(hour,minute,second) | 将给定的小时、分钟和秒组合成时间并返回 |
| PERIOD_ADD(time,n) | 返回time加上n后的时间 |

### 日期的格式化与解析

| 函数            | 用法                     |
| ------------- | ---------------------- |
| DATE_FORMAT(date,fmt) | 按照字符串fmt格式化日期date值 |
| TIME_FORMAT(time,fmt) | 按照字符串fmt格式化时间time值 |
| GET_FORMAT(date_type,format_type) | 返回日期字符串的显示格式 |
| STR_TO_DATE(str, fmt) | 按照字符串fmt对str进行解析，解析为一个日期 |

fmt参数常用的格式符：

| 格式符  | 说明                                   | 格式符     | 说明                                   |
| ---- | ------------------------------------ | ------- | ------------------------------------ |
| `%Y` | 4位数字表示年份                             | %y      | 表示两位数字表示年份                           |
| %M   | 月名表示月份（January,....）                 | `%m`    | 两位数字表示月份（01,02,03...）                |
| %b   | 缩写的月名（Jan.，Feb.，....）                | %c      | 数字表示月份（1,2,3,...）                    |
| %D   | 英文后缀表示月中的天数（1st,2nd,3rd,...）         | `%d`    | 两位数字表示月中的天数(01,02...)                |
| %e   | 数字形式表示月中的天数（1,2,3,4,5...）            |         |                                      |
| `%H` | 两位数字表示小数，24小时制（01,02..）              | %h和%I   | 两位数字表示小时，12小时制（01,02..）              |
| %k   | 数字形式的小时，24小时制(1,2,3)                 | %l      | 数字形式表示小时，12小时制（1,2,3,4....）          |
| `%i` | 两位数字表示分钟（00,01,02）                   | %S和`%s` | 两位数字表示秒(00,01,02...)                 |
| %W   | 一周中的星期名称（Sunday...）                  | %a      | 一周中的星期缩写（Sun.，Mon.,Tues.，..）         |
| %w   | 以数字表示周中的天数(0=Sunday,1=Monday....)    |         |                                      |
| %j   | 以3位数字表示年中的天数(001,002...)             | %U      | 以数字表示年中的第几周，（1,2,3...）其中Sunday为周中第一天 |
| %u   | 以数字表示年中的第几周，（1,2,3...）其中Monday为周中第一天 |         |                                      |
| %T   | 24小时制                                | %r      | 12小时制                                |
| %p   | AM或PM                                | %%      | 表示%                                  |

## 流程控制函数

流程处理函数可以根据不同的条件，执行不同的处理流程，可以在SQL语句中实现不同的条件选择。

MySQL中的流程处理函数主要包括IF()、IFNULL()和CASE()函数。

| 函数                                                                | 用法                                 |
| ----------------------------------------------------------------- | ---------------------------------- |
| IF(value,value1,value2)                                           | 如果value的值为TRUE，返回value1，否则返回value2 |
| IFNULL(value1,value2)                                             | 如果value1不为NULL，返回value1，否则返回value2 |
| `CASE WHEN 条件1 THEN 结果1 WHEN 条件2 THEN 结果2 ... [ELSE resultn] END` | 相当于Java的if...else if...else...     |
| CASE expr WHEN 常量值1 THEN 值1 WHEN 常量值2 THEN 值2 ... [ELSE 值n] END   | 相当于Java的switch...case...           |

```sql
SELECT oid,`status`, CASE `status` WHEN 1 THEN '未付款'
								   WHEN 2 THEN '已付款'
								   WHEN 3 THEN '已发货'
								   WHEN 4 THEN '确认收货'
								   ELSE '无效订单' END
FROM t_order;
```

## 加密与解密函数

加密与解密函数主要用于对数据库中的数据进行加密和解密处理，以防止数据被他人窃取。这些函数在保证数据库安全时非常有用。

| 函数                          | 用法                                                           |
| --------------------------- | ------------------------------------------------------------ |
| PASSWORD(str)               | 返回字符串str的加密版本，41位长度的字符串。加密结果**不可逆**，常用于用户的密码加密               |
| MD5(str)                    | 返回字符串str的md5加密后的值，也是一种加密方式。若参数为NULL，则会返回NULL                 |
| SHA(str)                    | 从原明文密码str计算并返回加密后的密码字符串，当参数为NULL时，返回NULL。**SHA加密算法比MD5更加安全** |
| ENCODE(value,password_seed) | 返回使用password_seed作为加密密码加密value                               |
| DECODE(value,password_seed) | 返回使用password_seed作为加密密码解密value                               |

## 获取MySQL信息函数

MySQL中内置了一些可以查询MySQL信息的函数，这些函数主要用于帮助数据库开发或运维人员更好地对数据库进行维护工作。

| 函数                                                    | 用法                               |
| ----------------------------------------------------- | -------------------------------- |
| VERSION()                                             | 返回当前MySQL的版本号                    |
| CONNECTION_ID()                                       | 返回当前MySQL服务器的连接数                 |
| DATABASE(), SCHEMA()                                  | 返回MySQL命令行当前所在的数据库               |
| USER(), CURRENT_USER(), SYSTEM_USER(), SESSION_USER() | 返回当前连接MySQL的用户名，返回结果格式为“主机名@用户名” |
| CHARSET(value)                                        | 返回字符串value自变量的字符集                |
| COLLATION(value)                                      | 返回字符串value的比较规则                  |

| 函数                             | 用法                                      |
| ------------------------------ | --------------------------------------- |
| FORMAT(value,n)                | 返回对数字value进行格式化后的结果数据。n表示四舍五入后保留到小数点后n位 |
| CONV(value,from,to)            | 将value的值进行不同进制之间的转换                     |
| INET_ATON(ipvalue)             | 将以点分隔的IP地址转化为一个数字                       |
| INET_NTOA(value)               | 将数字形式的IP地址转化为以点分隔的IP地址                  |
| BENCHMARK(n,expr)              | 将表达式expr重复执行n次。用于测试MySQL处理expr表达式所花费的时间 |
| CONVERT(value USING char_code) | 将value所使用的字符编码修改为char_code              |

# 第08章：聚合函数

除了单行函数，SQL 函数还有一类，叫做聚合（或聚集、分组）函数，它是对一组数据进行汇总的函数，输入的是一组数据的集合，输出的是单个值。

聚合函数不能嵌套调用。比如不能出现类似“AVG(SUM(字段名称))”形式的调用。

```sql
# 可以对数值型数据使用AVG 和 SUM 函数。
# 可以对任意数据类型的数据使用 MIN 和 MAX 函数。
mysql> SELECT AVG(salary), MAX(salary), MIN(salary), SUM(salary)
    -> FROM employees
    -> WHERE job_id LIKE '%REP%';
+-------------+-------------+-------------+-------------+
| AVG(salary) | MAX(salary) | MIN(salary) | SUM(salary) |
+-------------+-------------+-------------+-------------+
| 8272.727273 |    11500.00 |     6000.00 |   273000.00 |
+-------------+-------------+-------------+-------------+
1 row in set (0.00 sec)
```

`COUNT(*)`返回表中记录总数，适用于任意数据类型。`COUNT(expr)` 返回expr不为空的记录总数。

```sql
mysql> SELECT COUNT(*)
    -> FROM employees
    -> WHERE department_id = 50;
+----------+
| COUNT(*) |
+----------+
|       45 |
+----------+
1 row in set (0.00 sec)

mysql> SELECT COUNT(commission_pct)
    -> FROM employees
    -> WHERE department_id = 50;
+-----------------------+
| COUNT(commission_pct) |
+-----------------------+
|                     0 |
+-----------------------+
1 row in set (0.00 sec)
```

> `count(*)`会统计值为 NULL 的行，而 `count(列名)`不会统计此列为 NULL 值的行。

## GROUP BY

可以使用GROUP BY子句将表中的数据分成若干组。

```sql
# 在SELECT列表中所有未包含在组函数中的列都应该包含在 GROUP BY子句中。
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id;

# 包含在 GROUP BY 子句中的列不必包含在SELECT 列表中。
SELECT AVG(salary)
FROM employees
GROUP BY department_id;
```

GROUP BY中使用WITH ROLLUP。在所有查询出的分组记录之后增加一条记录，该记录计算查询出的所有记录的总和，即统计记录数量。

```sql
mysql> SELECT department_id,AVG(salary)
    -> FROM employees
    -> WHERE department_id > 80
    -> GROUP BY department_id WITH ROLLUP;
+---------------+--------------+
| department_id | AVG(salary)  |
+---------------+--------------+
|            90 | 19333.333333 |
|           100 |  8600.000000 |
|           110 | 10150.000000 |
|          NULL | 11809.090909 |
+---------------+--------------+
4 rows in set (0.01 sec)
```

> 注意：当使用ROLLUP时，不能同时使用ORDER BY子句进行结果排序，即ROLLUP和ORDER BY是互相排斥的。

## HAVING

过滤分组：HAVING子句

1. 行已经被分组。
2. 使用了聚合函数。
3. 满足HAVING 子句中条件的分组将被显示。
4. HAVING 不能单独使用，必须要跟 GROUP BY 一起使用。

```sql
mysql> SELECT department_id, MAX(salary)
    -> FROM employees
    -> GROUP BY department_id;
+---------------+-------------+
| department_id | MAX(salary) |
+---------------+-------------+
|          NULL |     7000.00 |
|            10 |     4400.00 |
|            20 |    13000.00 |
|            30 |    11000.00 |
|            40 |     6500.00 |
|            50 |     8200.00 |
|            60 |     9000.00 |
|            70 |    10000.00 |
|            80 |    14000.00 |
|            90 |    24000.00 |
|           100 |    12000.00 |
|           110 |    12000.00 |
+---------------+-------------+
12 rows in set (0.00 sec)

mysql> SELECT department_id, MAX(salary)
    -> FROM employees
    -> GROUP BY department_id
    -> HAVING MAX(salary)>10000;
+---------------+-------------+
| department_id | MAX(salary) |
+---------------+-------------+
|            20 |    13000.00 |
|            30 |    11000.00 |
|            80 |    14000.00 |
|            90 |    24000.00 |
|           100 |    12000.00 |
|           110 |    12000.00 |
+---------------+-------------+
6 rows in set (0.00 sec)
```

> [!info] WHERE和HAVING的对比
> - 在查询语法结构中，WHERE 在 GROUP BY 之前，所以无法对分组结果进行筛选。
> - HAVING 在 GROUP BY 之后，**可以使用分组字段和分组中的计算函数**，对分组的结果集进行筛选，这个功能是 WHERE 无法完成的。
> - 另外，WHERE排除的记录不再包括在分组中。如果需要通过连接从关联表中获取需要的数据，WHERE 是**先筛选后连接**，而 HAVING 是先连接后筛选。 这一点，就决定了在关联查询中，WHERE 比 HAVING 更高效。

## SELECT的执行过程

```sql
SELECT ..., ..., ...
FROM ... JOIN ...
ON 多表的连接条件
JOIN ...
ON ...
WHERE 不包含组函数的过滤条件
AND/OR 不包含组函数的过滤条件
GROUP BY ..., ...
HAVING 包含组函数的过滤条件
ORDER BY ... ASC/DESC
LIMIT ..., ...

#其中：
#（1）from：从哪些表中筛选
#（2）on：关联多表查询时，去除笛卡尔积
#（3）where：从表中筛选的条件
#（4）group by：分组依据
#（5）having：在统计结果中再次筛选
#（6）order by：排序
#（7）limit：分页
```

SELECT 语句的执行顺序：`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT 的字段 -> DISTINCT -> ORDER BY -> LIMIT` 。

- **FROM/JOIN**：首先确定数据源。
- **WHERE**：在分组前过滤掉不符合条件的行。
- **GROUP BY/HAVING**：进行聚合计算。
- **SELECT**：最后才选出需要的列。
- **DISTINCT**：过滤掉重复的行
- **ORDER BY/LIMIT**：最后对结果集进行排序和截取。

```sql
FROM <left_table>
ON <join_condition>
<join_type> JOIN <right_table>
WHERE <where_condition>
GROUP BY <group_by_list>
HAVING <having_condition>
SELECT
DISTINCT <select_list>
ORDER BY <order_by_condition>
LIMIT <limit_number>
```

# 第09章：子查询

子查询指一个查询语句嵌套在另一个查询语句内部的查询。

很多时候查询需要从结果集中获取数据，或者需要从同一个表中先计算得出一个数据结果，然后与这个数据结果（可能是某个标量，也可能是某个集合）进行比较。

```txt
主查询：谁的工资比Abel高
	子查询：Abel的工资是多少
```

按内查询的结果返回一条还是多条记录，将子查询分为：

- 单行子查询
- 多行子查询

按内查询是否被执行多次，将子查询划分为：

- **相关(或关联)子查询**：子查询的执行依赖于外部查询，通常情况下是因为子查询中的表用到了外部的表，并进行了条件关联，因此每执行一次外部查询，子查询都要重新计算一次
- **不相关(或非关联)子查询**：子查询的执行不依赖于外部查询，子查询只需执行一次。

## 单行子查询

内查询的结果返回一条，外查询使用这一条结果，需要用到单行比较操作符 `= <> > >= < <=` 。

### WHERE中的子查询

```sql
# 题目：返回job_id与141号员工相同，salary比143号员工多的员工姓名，job_id和工资
SELECT last_name, job_id, salary
FROM employees
WHERE job_id =
				(SELECT job_id
				 FROM employees
				 WHERE employee_id = 141)
AND salary >
				(SELECT salary
				 FROM employees
				 WHERE employee_id = 143);
```

### HAVING 中的子查询

```sql
# 题目：查询最低工资大于50号部门最低工资的部门id和其最低工资
SELECT department_id, MIN(salary)
FROM employees
GROUP BY department_id
HAVING MIN(salary) >
					(SELECT MIN(salary)
					 FROM employees
					 WHERE
					 department_id = 50);
```

### CASE中的子查询

```sql
# 题目：显示员工的employee_id,last_name和location。其中，若员工department_id与location_id为1800的department_id相同，则location为’Canada’，其余则为’USA’。
SELECT employee_id, last_name, (CASE department_id WHEN
								(SELECT department_id FROM departments
								 WHERE location_id = 1800)
								 THEN 'Canada' ELSE 'USA' END) location
FROM employees;
```

## 多行子查询

内查询返回多行，使用多行比较操作符。

| 操作符  | 含义                               |
| ---- | -------------------------------- |
| IN   | 等于列表中的任意一个                       |
| ANY  | 需要和单行比较操作符一起使用，和子查询返回的**某一个值**比较 |
| ALL  | 需要和单行比较操作符一起使用，和子查询返回的**所有值**比较  |
| SOME | 实际上是ANY的别名，作用相同，一般常使用ANY         |

```sql
#题目：查询平均工资最低的部门id
#MySQL中聚合函数是不能嵌套使用的。
#方式1：单行子查询
SELECT department_id
FROM employees
GROUP BY department_id
HAVING AVG(salary) = (
			SELECT MIN(avg_sal)
			FROM(
				SELECT AVG(salary) avg_sal
				FROM employees
				GROUP BY department_id
				) t_dept_avg_sal
			);

#方式2：多行子查询，减少了一层嵌套
SELECT department_id
FROM employees
GROUP BY department_id
HAVING AVG(salary) <= ALL(	
			SELECT AVG(salary) avg_sal
			FROM employees
			GROUP BY department_id
			) 
```

## 相关子查询

相关子查询按照一行接一行的顺序执行，主查询的每一行都执行一次子查询。

### WHERE中的子查询

```sql
#题目：查询员工中工资大于本部门平均工资的员工的last_name,salary和其department_id
#子查询中，“本部门的平均工资”随着部门的改变而改变
SELECT last_name,salary,department_id
FROM employees outer
WHERE salary > (
		SELECT AVG(salary)
		FROM employees 
		WHERE department_id = outer.department_id
		);
```

### FROM中的子查询

from型的子查询：子查询是作为from的一部分，子查询要用`()`引起来，并且要给这个子查询取别名， 把它当成一张“临时的虚拟的表”来使用。

```sql
#题目：查询员工中工资大于本部门平均工资的员工的last_name,salary和其department_id
SELECT e.last_name,e.salary,e.department_id
FROM employees e,(
		SELECT department_id,AVG(salary) avg_sal
		FROM employees
		GROUP BY department_id) t_dept_avg_sal
WHERE e.department_id = t_dept_avg_sal.department_id
AND e.salary > t_dept_avg_sal.avg_sal
```

### ORDER BY中的子查询

```sql
#题目：查询员工的id,salary,按照department_name 排序
SELECT employee_id,salary
FROM employees e
ORDER BY (
	 SELECT department_name
	 FROM departments d
	 WHERE e.`department_id` = d.`department_id`
	);
```

### EXISTS关键字

关联子查询通常也会和 EXISTS操作符一起来使用，用来检查在子查询中是否存在满足条件的行。

- 如果在子查询中不存在满足条件的行：
	- 条件返回 FALSE，继续在子查询中查找
- 如果在子查询中存在满足条件的行：
	- 不在子查询中继续查找，条件返回 TRUE

NOT EXISTS关键字表示如果不存在某种条件，则返回TRUE，否则返回FALSE。

```sql
#题目：查询公司管理者的employee_id，last_name，job_id，department_id信息

#方式1：自连接
SELECT DISTINCT mgr.employee_id, mgr.last_name, mgr.job_id, mgr.department_id
FROM employees emp JOIN employees mgr
ON emp.manager_id = mgr.employee_id;

#方式2：子查询。找出所有manager_id
SELECT employee_id, last_name, job_id, department_id
FROM employees
WHERE employee_id IN (
			SELECT DISTINCT manager_id
			FROM employees
			);

#方式3：使用EXISTS
SELECT employee_id, last_name, job_id, department_id
FROM employees e1
WHERE EXISTS (
	       SELECT *
	       FROM employees e2
	       WHERE e1.employee_id = e2.manager_id
	     );
```

