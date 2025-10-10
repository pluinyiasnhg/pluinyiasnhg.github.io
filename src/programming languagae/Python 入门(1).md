---
title: Python 入门(1)
date: 2025-10-08
tags:
  - Python
  - 官方教程
category:
  - 编程语言
---
# 前言

学习 Python 官方的 [Python3 tutorial 中文版](https://docs.python.org/zh-cn/3.14/tutorial/index.html) 前六章，主要包括函数、数据结构、模块与包。

<!-- more -->

有关该文档的介绍如下：

> 本教程对每一个功能的介绍并不完整，甚至没有涉及全部常用功能，只是介绍了 Python 中最值得学习的功能，旨在让读者快速感受一下 Python 的特色。学完本教程的读者可以阅读和编写 Python 模块和程序，也可以继续学习 [Python 标准库](https://docs.python.org/zh-cn/3.14/library/index.html#library-index)。
> 标准库与模块的内容详见 [Python 标准库](https://docs.python.org/zh-cn/3.14/library/index.html#library-index)。[Python 语言参考手册](https://docs.python.org/zh-cn/3.14/reference/index.html#reference-index) 是更正规的语言定义。

# 1. 课前甜点

目前 Python 3.8 及之前的版本已经 EOL，大概是 End Of Life 的意思；3.10 到 3.12 还在维护中；3.13 是稳定版；3.14 是先行版；3.15 是正在开发中。

Python 容易上手，在完成一些琐碎的日常小任务时，能非常高效的完成。相比于 C 语言，Python 是一门更高级的语言，内置了高级数据类型，比如动态数组和字典。此外，Python 大量的通用数据类型使得 Python 在解决更大问题时丝毫不弱于 awk、Perl。

模块（module）：Python 允许将程序分成一个个模块来管理和复用。

使用 Python 实现功能的代码量通常要比 C++、Java 等语言的代码量要少，原因有：

- Python 内置的高级数据类型，能用一条语句实现更复杂的功能
- Python 通过缩进而不是括号来管理语句
- 无需声明变量

# 2. 使用 Python 解释器

python 解释器的安装路径通常在 `/usr/share/bin` 路径下面，在 shell 中输入 `python` 就能启动解释器，想要退出解释器，可以输入 `quit()` 或者快捷键 `Ctrl-d`（Linux）、`Ctrl-z`（Windows）。

如果使用 miniconda 管理 python 虚拟环境，默认的 base 环境在 `[安装路径]/miniconda3` 下面，其他虚拟环境在 `[安装路径]/miniconda3/env/[环境名]` 。可以在 shell 中用 `conda env list` 查看。

启动解释器时候，可以传递参数，比如 `-i` 在运行脚本文件的同时进入交互模式，`-c` 后接命令，`-m` 后接模块名。更多的参数详见[命令行和环境](https://docs.python.org/3/using/cmdline.html#using-on-general)。

解释器读取命令行参数，把脚本名与其他参数转化为字符串列表存到 `sys` 模块的 `argv` 变量里。

- 未给定输入参数时，`sys.argv[0]` 是空字符串
- 给定脚本名是 `'-'` （标准输入）时，`sys.argv[0]` 是 `'-'`
- 使用 [`-c`](https://docs.python.org/zh-cn/3.14/using/cmdline.html#cmdoption-c) 时，`sys.argv[0]` 是 `'-c'`
- 使用 [`-m`](https://docs.python.org/zh-cn/3.14/using/cmdline.html#cmdoption-m) 时，`sys.argv[0]` 就是包含目录的模块全名
- 解释器不处理 [`-c`](https://docs.python.org/zh-cn/3.14/using/cmdline.html#cmdoption-c) 或 [`-m`](https://docs.python.org/zh-cn/3.14/using/cmdline.html#cmdoption-m) 之后的选项，而是直接留在 `sys.argv` 中由命令或模块来处理

默认情况下，python 源代码文件是以 UTF-8 格式编码，这种编码支持世界上大多数语言的字符。如果想要指定其他编码格式，则要声明文件的编码，在源代码文件的第一行添加特殊注释，格式如下。其中，encoding 可以是 Python 支持的任意一种 [codecs](https://docs.python.org/zh-cn/3.14/library/codecs.html#module-codecs "codecs: Encode and decode data and streams.")。


```python
# -*- coding: encoding -*-
```

第一行的规则也有一种例外情况，源码以 [UNIX "shebang" 行](https://docs.python.org/zh-cn/3.14/tutorial/appendix.html#tut-scripts) 开头。此时，编码声明要写在文件的第二行。

```python
#!/usr/bin/env python3
# -*- coding: cp1252 -*-
```

# 3. Python 速览

除法运算 (`/`) 总是返回浮点数。 如果要做 [floor division](https://docs.python.org/zh-cn/3.14/glossary.html#term-floor-division) 得到一个整数结果，可以使用 `//` 运算符；要计算余数你可以使用 `%` 。

Python 用 `**` 运算符计算乘方。

交互模式下，上次输出的表达式会赋给变量 `_`。把 Python 当作计算器时，用该变量实现下一步计算更简单。

> [!warning] 
> 最好把变量 `_` 当作只读类型。不要为它显式赋值，否则会创建一个同名独立局部变量，该变量会用它的魔法行为屏蔽内置变量。

原始字符串。如果不希望前置 `\` 的字符转义成特殊字符，可以使用原始字符串，在引号前添加 `r` 即可：

```python
>>> print('C:\some\name')  # 这里 \n 表示换行符！
C:\some
ame
>>> print(r'C:\some\name')  # 请注意引号前的 r
C:\some\name
```

字符串字面值可以跨越多行。 一种做法是使用三重引号: `"""..."""` 或 `'''...'''`。 行结束符会自动包括在字符串中，但可以通过在行尾添加 `\` 来避免此行为。

```python
>>> print("""
... python
... """)

python

>>> print("""\
... python
... """)
python

>>>
```

相邻的两个或多个 _字符串字面值_ （引号标注的字符）会自动合并。拼接分隔开的长字符串时，这个功能特别实用。

自动合并功能只能用于两个字面值，不能用于变量或表达式。合并多个变量，或合并变量与字面值，要用 `+` 。

Python 字符串的其他操作：

- 可以进行索引和切片操作。索引有越界报错，但切片会自动处理越界索引
- 字符串不能修改
- 内置函数 [`len()`](https://docs.python.org/zh-cn/3.14/library/functions.html#len "len") 返回字符串的长度

Python 列表也支持索引和切片、返回自身的长度。

此外，列表中的元素可修改：

- 可添加新元素，比如 `list.append()` 方法在列表末尾添加新元素
- 通过赋值删除元素，比如 `mylist[2:5] = []`
- 通过赋值更改元素，比如 `mylist[0] = 0`

# 4. 更多控制流工具

- `if` 语句。可有零个或多个 `elif` 部分，`else` 部分也是可选的。关键字 `elif` 是 else if 的缩写
- `for` 语句。Python 的 `for` 语句不迭代算术递增数值（如 Pascal），或是给予用户定义迭代步骤和结束条件的能力（如 C），而是在列表或字符串等任意序列的元素上迭代，按它们在序列中出现的顺序
- `range()` 用于生成等差数列
- `break` 语句将跳出最近的一层 for 或 while 循环
- `continue` 语句将继续执行循环的下一次迭代
- 在 `for` 或 `while` 循环中 `break` 语句可能对应一个 `else` 子句。 如果循环在未执行 `break` 的情况下结束，`else` 子句将会执行
- `pass` 语句不执行任何动作。常用于创建最小的类和用作函数或条件语句体的占位符

Python 3.10 引入的 [`match`](https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#match) 表面上像 C中的 switch 语句，但其实它更像 Rust 中的模式匹配。

1. **匹配顺序**：按顺序匹配，第一个匹配的模式会被执行
2. **通配符**：`_` 是通配符，匹配任何值
3. **变量绑定**：在模式中可以使用变量来绑定值

```python
match subject:
    case pattern1:
        # 处理 pattern1
    case pattern2:
        # 处理 pattern2
    case _:
        # 默认情况
```

Python 的 `match` 语句提供了强大的模式匹配功能，可以：

- 匹配简单的值和多个值
- 匹配序列、映射和对象
- 使用守卫条件进行更复杂的匹配
- 提取和绑定变量

函数内的第一条语句是字符串时，该字符串就是文档字符串，也称为 _docstring_。利用文档字符串可以自动生成在线文档或打印版文档，还可以让开发者在浏览代码时直接查阅文档。

```python
def my_function():
    """第一行应为对象用途的简短摘要。为保持简洁，不要在这里显式说明对象名或类型

    后面的行可包含若干段落，描述对象的调用约定、副作用等
    """
    pass

print(my_function.__doc__)
```

编码风格：

- 缩进，用 4 个空格，不要用制表符。
- 换行，一行不超过 79 个字符。这样换行的小屏阅读体验更好，还便于在大屏显示器上并排阅读多个代码文件。
- 用空行分隔函数和类，及函数内较大的代码块。
- 最好**把注释放到单独一行**。
- **使用文档字符串**。
- 运算符前后、逗号后要用空格，但不要直接在括号内使用： `a = f(1, 2) + g(3, 4)`。
- 类和函数的命名要一致；按惯例，命名类用 `UpperCamelCase`，命名函数与方法用 `lowercase_with_underscores`。命名方法中第一个参数总是用 `self` (类和方法详见 [初探类](https://docs.python.org/zh-cn/3.14/tutorial/classes.html#tut-firstclasses))。
- 编写用于国际多语环境的代码时，不要用生僻的编码。Python 默认的 UTF-8 或纯 ASCII 可以胜任各种情况。
- 同理，就算多语阅读、维护代码的可能再小，也不要在标识符中使用非 ASCII 字符。

## 有关函数参数

为参数指定默认值。调用函数时，可以使用比定义时更少的参数。默认值一般只计算一次，但当默认值为列表、字典或类实例等可变对象时，会产生与该规则不同的结果。例如，下面的函数会累积后续调用时传递的参数：

```python
def f(a, L=[]):
    L.append(a)
    return L

print(f(1))  # [1]
print(f(2))  # [1, 2]
print(f(3))  # [1, 2, 3]
```

不想在后续调用之间共享默认值时，需要每次给可边对象清空。

```python
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L
```
 
调用函数时可以用形如 `kwarg=value` 的关键字参数。同时有位置参数和关键字参数时，位置参数写在关键字参数前面，因为关键字参数不要求位置。

```python
parrot(1000)                                          # 1 个位置参数
parrot(voltage=1000)                                  # 1 个关键字参数
```

还有 `*arguments` 和 `**keywords` 形参。`*arguments` 接收一个元组，该元组包含除形参列表之外的**位置参数**；`**keywords` 接收一个字典，该字典包含与函数中已定义形参对应之外的所有**关键字参数**。

```python
def cheeseshop(kind, *arguments, **keywords):
    pass

cheeseshop("Limburger", "It's very runny, sir.",
           "It's really very, VERY runny, sir.",
           shopkeeper="Michael Palin",
           client="John Cleese",
           sketch="Cheese Shop Sketch")
```

上述代码中，kind 的实参是 Limburger，`*arguments` 元组包括剩下两个位置实参，`**keywords` 字典包括剩下三个关键字实参。

> [!warning]
> `*args` 形参后的任何形参，只能是关键字参数。

为了让代码易读、高效，最好限制参数的传递方式，这样，开发者只需查看函数定义，即可确定参数项是仅按位置、按位置或关键字，还是仅按关键字传递。函数定义如下：

```txt
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
      -----------    ----------     ----------
        |             |                  |
        |        位置或关键字             |
        |                                - 仅限关键字
         -- 仅限位置
```

`/` 和 `*` 是可选的。这些符号表明形参如何把参数值传递给函数：位置、位置或关键字、关键字。关键字形参也叫作命名形参。

解包实参列表。用 `*` 操作符把实参从列表或元组解包出来，字典可以用 `**` 操作符传递关键字参数：

```python
args = [3, 6]
list(range(*args))            # 附带从一个列表解包的参数的调用

def parrot(voltage, state='a stiff', action='voom'):
    pass
d = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
parrot(**d)
```

函数注解是可选的用户自定义函数类型的元数据完整信息。 下面的示例具有加了标注的一个必需参数、一个可选参数以及返回值:

```python
>>> def f(ham: str, eggs: str = 'eggs') -> str:
...     print("Annotations:", f.__annotations__)
...     print("Arguments:", ham, eggs)
...     return ham + ' and ' + eggs
... 
>>> f('spam')
Annotations: {'ham': <class 'str'>, 'eggs': <class 'str'>, 'return': <class 'str'>}
Arguments: spam eggs
'spam and eggs'
```

# 5. 数据结构

## 列表

列表数据类型支持很多方法，列表对象的所有方法所示如下：

- list.append(_x_) 
	- 在列表末尾添加一项。 类似于 `a[len(a):] = [x]`。
- list.extend(_iterable_) 
	- 通过添加来自 iterable 的所有项来扩展列表。 类似于 `a[len(a):] = iterable`。
- list.insert(_i_, _x_) 
	- 在指定位置插入元素。第一个参数是插入元素的索引
- list.remove(_x_) 
	- 从列表中删除第一个值为 _x_ 的元素
- list.pop([_i_]) 
	- 移除列表中给定位置上的条目，并返回该条目。 如果未指定索引号，则 `a.pop()` 将移除并返回列表中的最后一个条目
- list.clear() 
	- 移除列表中的所有项。 类似于 `del a[:]`。
- list.index(_x_[, _start_[, _end_]]) 
	- 返回列表中 _x_ 首次出现位置的从零开始的索引。可选参数 _start_ 和 _end_ 是切片符号，用于将搜索限制为列表的特定子序列。返回的索引是相对于整个序列的开始计算的，而不是 _start_ 参数。
- list.count(_x_) 
	- 返回列表中元素 _x_ 出现的次数。
- list.sort(_*_, _key=None_, _reverse=False_) 
	- 就地排序列表中的元素（要了解自定义排序参数，详见 [`sorted()`](https://docs.python.org/zh-cn/3.14/library/functions.html#sorted "sorted")）。
- list.reverse() 
	- 翻转列表中的元素。
- list.copy() 
	- 返回列表的浅拷贝。 类似于 `a[:]`。

仅修改列表的方法都不会打印返回值，比如 `insert`, `remove` 或 `sort`，它们返回默认值 None。这是适用于 Python 中所有可变数据结构的设计原则。

列表推导式创建列表的方式更简洁。列表推导式的方括号内包含以下内容：一个表达式，后面为一个 `for` 子句，然后，是零个或多个 `for` 或 `if` 子句。结果是由表达式依据 `for` 和 `if` 子句求值计算而得出一个新列表。 

```python
[(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]

# 等价于

combs = []
for x in [1,2,3]:
    for y in [3,1,4]:
        if x != y:
            combs.append((x, y))

combs
```

`del` 语句可以按索引而不是按值从一个列表移除条目。

```python
# 清空列表
del a[:]

# 删除列表，此时引用 a 会报错
del a
```

## 元组

Python 的序列类型有列表、range，以及本节的元组。

元组由多个用逗号隔开的值组成，输出时，元组都要由圆括号标注，这样才能正确地解释嵌套元组。输入时，圆括号可有可无。

```python
>>> t = 12345, 54321, 'hello!'
>>> t
(12345, 54321, 'hello!')
>>> # 元组是不可变对象，但可以包含可变对象
>>> v = ([1, 2, 3], [3, 2, 1])
>>> v
([1, 2, 3], [3, 2, 1])
>>> # 创建 0 个或 1 个元素的元组比较特殊
>>> empty = ()
>>> singleton = 'hello',
```

## 集合

集合是由不重复元素组成的无序容器。创建集合用花括号或 `set()` 函数。注意，创建空集合只能用 `set()`，不能用 `{}`，`{}` 创建的是空字典。

集合对象支持并集 `a | b`、交集 `a & b`、差集 `a - b`、对称差 `a ^ b` 等数学运算。

与列表推导式类似，集合也支持推导式，比如 `{x for x in 'abracadabra' if x not in 'abc'}`。

## 字典

字典理解为 _键值对_ 的集合，但字典的键必须是唯一的。字典是以 _键_ 来索引的，键可以是任何不可变类型：

- 字符串和数字总是可以作为键
- 元组在其仅包含字符串、数字或元组时也可以作为键；如果一个元组直接或间接地包含了任何可变对象，则不可以用作键
- 不能使用列表作为键

创建字典的方式有：

- `{}` 内指定键值対
- `dict()` 构造函数，如 `dict([('sape', 4139), ('guido', 4127), ('jack', 4098)])`
	- 用关键字参数指定键值对 `dict(sape=4139, guido=4127, jack=4098)`
- 字典推导式，如 `{x: x**2 for x in (2, 4, 6)}`

使用不存在的键获取字典的值时，会报错，可以改用字典的 `get()` 方法，遇到不存在的键会返回 `None`。

```python
>>> tel['Jack']
>>> tel.get('Jack')
>>> # del 删除键值対
>>> del tel['Jack']
```

## 循环的技巧

- 当对字典执行循环时，可以使用 [`items()`](https://docs.python.org/zh-cn/3.14/library/stdtypes.html#dict.items "dict.items") 方法同时提取键及其对应的值
- 在序列中循环时，用 [`enumerate()`](https://docs.python.org/zh-cn/3.14/library/functions.html#enumerate "enumerate") 函数可以同时取出位置索引和对应的值
- 同时循环两个或多个序列时，用 [`zip()`](https://docs.python.org/zh-cn/3.14/library/functions.html#zip "zip") 函数可以将其内的元素一一匹配

```python
knights = {'gallahad': 'the pure', 'robin': 'the brave'}
for k, v in knights.items():
    pass

for i, v in enumerate(['tic', 'tac', 'toe']):
    print(i, v)

for q, a in zip(questions, answers):
    print('What is your {0}?  It is {1}.'.format(q, a))
```

# 6. 模块

模块是包含 Python 定义和语句的文件。其文件名是模块名加后缀名 `.py` 。在模块内部，通过全局变量 `__name__` 可以获取模块名（即字符串）。

在 Python 解释器中导入模块 `import hello` ，此操作不会直接把 `hello` 中定义的函数名称添加到当前命名空间中，它只是将模块名称 `hello` 添加到那里。 使用该模块名称可以访问其中的函数，比如 `hello.print_hello()`。

以脚本方式执行模块 `python fibo.py <arguments>` ，此时会把模块的`__name__` 赋值为 `"__main__"`。通常在模块末尾见到的 `if __name__ == "__main__":` ，用于为模块提供一个便捷的用户接口，或用于测试（把模块作为执行测试套件的脚本运行）。只有在模块作为“main”文件执行时才会运行。

为了快速加载模块，Python 把模块的编译版本缓存在 `__pycache__` 目录中，文件名为 `module._version_.pyc`。从 `.pyc` 文件读取的程序不比从 `.py` 读取的执行速度快，`.pyc` 文件只是加载速度更快。

Python 对比编译版与源码的修改日期，查看编译版是否已过期，是否要重新编译。此进程完全是自动的。此外，编译模块与平台无关，因此，可在不同架构的系统之间共享相同的库。

## 包

包是通过使用“带点号模块名”来构造 Python 模块命名空间的一种方式。 例如，模块名 `A.B` 表示名为 `A` 的包中名为 `B` 的子模块。 就像使用模块可以让不同模块的作者不必担心彼此的全局变量名一样，使用带点号模块名也可以让 NumPy 或 Pillow 等多模块包的作者也不必担心彼此的模块名冲突。

需要有 `__init__.py` 文件才能让 Python 将包含该文件的目录当作包来处理。在最简单的情况下，`__init__.py` 可以是一个空文件，但它也可以执行包的初始化代码或设置 `__all__` 变量。

使用 `from package import item` 时，item 可以是包的子模块（或子包），也可以是包中定义的函数、类或变量等其他名称。相反，使用 `import item.subitem.subsubitem` 句法时，除最后一项外，每个 item 都必须是包；最后一项可以是模块或包，但不能是上一项中定义的类、函数或变量。

`from package import *` 和 `from module import *` 完全不同。从模块中导入 * 会导入模块内定义的所有名称；从包中导入 * 会导入包作者给的模块列表，如果作者认为没有必要在包中执行导入 * 操作，也可以不提供此列表。

包作者会在模块目录下面创建 `__init__.py` 文件，文件包含一个模块列表 `__all__` 。模块列表中的模块会被本地定义的名称影响，比如在 `__init__.py` 文件中定义一个 `reverse` 函数，这时导入模块列表中的 `reverse` 模块，实际是导入 `reverse` 函数。

当包由多个子包构成时，可以使用相对导入来导入所涉及的当前包和上级包。

```python
from . import echo
from .. import formats
from ..filters import equalizer
```

注意，相对导入是基于当前模块所属包的名称进行的。由于主模块（即直接运行的脚本）没有所属包，因此那些打算作为 Python 应用程序主模块使用的模块，必须始终使用绝对导入。
