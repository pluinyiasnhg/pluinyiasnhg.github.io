---
title: Python 入门(2)
date: 2025-10-10
tags:
  - Python
  - 官方教程
category:
  - 编程语言
---
# 前言

学习 Python 官方的 [Python3 tutorial 中文版](https://docs.python.org/zh-cn/3.14/tutorial/index.html) 前六章，主要包括函数、数据结构、模块与包。

<!-- more -->

[[Python 入门(1)]]

# 7. 输入与输出

## f-字符串

格式化字符串字面值（简称为 f-字符串）在字符串前加前缀 `f` 或 `F`，通过 `{expression}` 表达式，把 Python 表达式的值添加到字符串内。

格式说明符是可选的，写在表达式后面，可以更好地控制格式化值的方式：

- 确定小数点前后的位置，如 `f'The number is |{num:<4.2f}|.'` 
	- `<` 标示左对齐，类似的还有右对齐 `>`、居中 `^`
	- 小数点前的 4 表示字段宽度指定为 4 个字符
	- 小数点后的 2f 表示小数点保留 2 位
- 在 `':'` 后传递整数，为该字段设置最小字符宽度，常用于列对齐。整数为负数时，显示为右对齐，否则左对齐
- `=` 说明符可被用于将一个表达式扩展为表达式文本、等号再加表达式求值结果的形式

```python
>>> # = 说明符
>>> bugs, count, area = 'roaches', 13, 'living room'
>>> print(f'Debugging {bugs=} {count=} {area=}')
Debugging bugs='roaches' count=13 area='living room'
```

## format()方法

字符串 `format()` 方法有点类似 f-字符串：把 f 和 `{}` 里的值都放到字符串的后面。不过 format() 方法更为灵活，可以像调用函数那样，既可以使用位置参数，也可以用关键字参数。

```python
>>> # 位置
>>> print('{0} and {1}'.format('spam', 'eggs'))
spam and eggs
>>> print('{1} and {0}'.format('spam', 'eggs'))
eggs and spam
>>> # 关键字
>>> print('This {food} is {adjective}.'.format(food='spam', adjective='absolutely horrible'))
This spam is absolutely horrible.
>>> # 混合使用
>>> print('The story of {0}, {1}, and {other}.'.format('Bill', 'Manfred', other='Georg'))
The story of Bill, Manfred, and Georg.
```

特别的，format() 方法可以将 `table` 字典作为采用 `**` 标记的关键字参数传入。

```python
>>> table = {'Sjoerd': 4127, 'Jack': 4098, 'Dcab': 8637678}
>>> print('Jack: {Jack:d}; Sjoerd: {Sjoerd:d}; Dcab: {Dcab:d}'.format(**table))
Jack: 4098; Sjoerd: 4127; Dcab: 8637678
```

## printf 风格

printf 风格的字符串格式化是旧时的输出方法。

给定 `format % values` (其中 _format_ 是一个字符串)，则 _format_ 中的 `%` 转换占位符将以 _values_ 中的零个或多个元素来替换。 此操作通常称为字符串插值。 例如 `'The value of pi is approximately %5.3f.' % math.pi`。

## 读写文件

`open()` 返回一个文件对象 ，最常用的是两个位置参数和一个关键字参数：`f = open(filename, mode, encoding=None)`。

- `filename` 是文件名字符串
- `mode` 是包含描述文件使用方式字符的字符串。
	- 文本模式下，mode 的值包括 `'r'` （读取文件）、`'w'` （覆盖写入文件）、`'a'` （追加文件）、`'r+'` （读写文件，文件须已存在）、`w+` （读写文件，不存在则创建）。mode 默认值为 `'r'`
	- 二进制模式下，mode 包含 `'b'` ，但 `'b'` 不能单独使用，需要与文本模式下的 mode 组合使用：`rb wb ab rb+ wb+`
- `encoding` 是文本文件的编码标准。对于二进制文件，该参数无用

用 open() 打开文件，完成文件操作后，需要用 `close()` 方法对文件进行关闭。可以用 `with` 关键字实现自动关闭文件。

```python
# 在 with 下完成文件所有操作，离开 with 后文件自动关闭
with open('workfile', encoding="utf-8") as f:
    read_data = f.read()
```

上面代码中的 `f.read()` 读取文件中的所有内容，并返回字符串（文本模式），或字节串对象（在二进制模式下）。该方法有一个可选参数 _size_ 。省略 _size_ 或 _size_ 为负数时，读取并返回整个文件的内容；_size_ 取其他值时，读取并返回最多 _size_ 个字符（文本模式）或 _size_ 个字节（二进制模式）。如已到达文件末尾，`f.read()` 返回空字符串。

`f.readline()` 和 `f.read()` 十分类似：都能读取到每行之间的换行符，但前者是按行读取，后者默认读取全部。不想读取到换行符且想一次性读取多行，可以用循环遍历整个文件对象，代码如下：

```python
for line in f:
    print(line, end='')
```

`f.readlines()` 就是边循环遍历文件对象，边把 `f.readline()` 读取到的字符串添加到一个空列表。遍历完毕，返回这个列表。

`f.write(string)` 把 string 的内容写入文件，并返回写入的字符数（包括换行符）。写入其他类型的对象前，要先把它们转化为字符串（文本模式）或字节对象（二进制模式）。

`f.tell()` 返回整数，给出文件对象在文件中的当前位置。我记得 C 语言有一个文件指针，负责跟踪在文件中的当前读写位置。

`f.seek(offset, whence)` 改变文件对象的位置。通过向参考点添加 _offset_ 计算位置；参考点由 _whence_ 参数指定。 _whence_ 值为 0 表示从文件开头计算，1 表示使用当前文件位置，2 表示使用文件末尾作为参考点，默认值为 0，即从头再读取。

 JSON (JavaScript Object Notation)数据格式，可以用来方便的进行数据交换和网络传输。将用户编码需要的数据转换为 JSON 格式的过程，是为序列化过程；JSON 格式还原回去，就是逆序列化。

- `json.dumps(x)` 查看数据 x 的 JSON 格式是什么样
- `json.dump(x, f)` 将数据 x 序列化为文本文件 f
- `json.load(f)` 将文本文件或二进制文件 f 逆序列化回数据

这种简单的序列化技术可以处理列表和字典，但在 JSON 中序列化任意类的实例，则需要付出额外努力。[`json`](https://docs.python.org/zh-cn/3.14/library/json.html#module-json "json: Encode and decode the JSON format.") 模块的参考包含对此的解释。

# 8. 异常
