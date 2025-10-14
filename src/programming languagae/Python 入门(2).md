---
title: Python 入门(2)
date: 2025-10-12
tags:
  - Python
  - 官方教程
category:
  - 编程语言
---
# 前言

学习 Python 官方的 [Python3 tutorial 中文版](https://docs.python.org/zh-cn/3.14/tutorial/index.html) 第 7 章到第 9 章，主要包括输出、异常、类。

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

# 8. 错误和异常

`BaseException` 是所有异常的共同基类。它的一个子类 `Exception` ，是所有非致命异常的基类。不是 `Exception` 的子类的异常通常不被处理，因为它们被用来指示程序应该终止。它们包括由 `sys.exit()` 引发的 `SystemExit` ，以及当用户希望中断程序时引发的 `KeyboardInterrupt` 。

try 语句的工作原理如下：

- 首先，执行 `try` 子句 
- 如果没有触发异常，则跳过 `except` 子句，try 语句执行完毕
- 如果在执行 try 子句时发生了异常，则跳过该子句中剩下的部分。 如果异常的类型与 except 关键字后指定的异常相匹配，则会执行 except 子句，然后跳到 try/except 代码块之后继续执行
- 如果发生的异常与 except 子句 中指定的异常不匹配，则它会被**传递到外层的 try 语句中**；如果没有找到处理器，则它是一个未处理异常且执行将停止并输出一条错误消息
- 可选子句 `else` ，该子句如果存在，它必须放在所有 except 子句之后。 它**适用于 try 子句没有引发异常但又必须要执行的代码**
- 可选子句 `finally` ，用于定义在所有情况下都必须要执行的清理操作。不论 `try` 语句是否触发异常，都会执行 `finally` 子句。实际应用程序中，finally 子句对于释放外部资源（例如文件或者网络连接）非常有用，无论是否成功使用资源
	- 如果 finally 子句执行 break、 continue 或 return 语句，异常不重新引发。 这可能会引起混淆，因此不鼓励使用。 从 3.14 版开始，编译器会为它发出一个 `SyntaxWarning` (参见 PEP 765)
	- 如果执行 try 语句时遇到 break,、continue 或 return 语句，则 finally 子句在执行 break、continue 或 return 语句**之前执行**
	- 如果 finally 子句和 try 子句都包含 return 语句 ，则返回的值将是来自 finally 子句的 return 语句 。这可能会引起混淆，因此不提倡使用。从版 3.14 开始，编译器会为它发出一个 `SyntaxWarning` 

```python
>>> # 有关“传递到外层的 try 语句中”的例子
>>> try:
...     try:
...         n = 1 / 0
...     except NameError:
...         print("This is NameError")
... except ZeroDivisionError:
...     print("This is ZeroDivisionError")
... 
This is ZeroDivisionError
>>> # finally 子句和 try 子句都包含 return 语句时
>>> def bool_return():
...     try:
...         return True
...     finally:
...         return False
... 
>>> bool_return()
False
```

try 语句可以有多个 except 子句来为不同的异常指定处理程序。 但最多只有一个处理程序会被执行。 处理程序只处理对应的 try 子句 中发生的异常，而不处理同一 try 语句内其他处理程序中的异常。 except 子句 以用元组来指定多个异常，例如 `except (RuntimeError, TypeError, NameError):` 。

一个 except 子句中的类匹配的异常将是该类本身的实例或其所派生的类的实例。例如，下面的代码将依次打印 `B, C, D`:

```python
class B(Exception):
    pass

class C(B):
    pass

class D(C):
    pass

for cls in [B, C, D]:
    try:
        raise cls()
    except D:
        print("D")
    except C:
        print("C")
    except B:
        print("B")
```

注意，如果把 except B 放在最前，则会输出 `B, B, B` ——即触发了第一个匹配的 except 子句。

except 子句可能会在异常名称后面指定一个变量。 这个变量将被绑定到异常实例，该实例通常会有一个存储参数的 args 属性。 为了方便起见，内置异常类型定义了 `__str__()` 来打印所有参数而不必显式地访问 .args。

```python
>>> try:
...     raise Exception('spam', 'eggs')
... except Exception as inst:
...     print(type(inst))    # 异常的类型
...     print(inst.args)     # 参数保存在 .args 中
...     print(inst)          # __str__ 允许 args 被直接打印，
...                          # 但可能在异常子类中被覆盖
...     x, y = inst.args     # 解包 args
...     print('x =', x)
...     print('y =', y)
... 
<class 'Exception'>
('spam', 'eggs')
('spam', 'eggs')
x = spam
y = eggs
```

raise 语句支持强制触发指定的异常。如果只想判断是否触发了异常，但并不打算处理该异常，则可以使用 raise 语句重新触发异常：

```python
>>> try:
...     raise NameError('HiThere')
... except NameError:
...     print('An exception flew by!')
...     raise
... 
An exception flew by!
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
NameError: HiThere
```

为了表明一个异常是另一个异常的直接后果， raise 语句允许一个可选的 from 子句。比如下面代码中引起 `RuntimeError` 的直接原因是 `exc` ，即 `ConnectionError`。

```python
>>> def func():
...     raise ConnectionError
... 
>>> try:
...     func()
... except ConnectionError as exc:
...     raise RuntimeError('Failed to open database') from exc
... 
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
  File "<stdin>", line 2, in func
ConnectionError

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Failed to open database
```

使用 from None 表达禁用自动异常链，比如下面报错跳过了 `OSError` ：

```python
>>> try:
...     open('database.sqlite')
... except OSError:
...     raise RuntimeError from None
... 
Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError
```

异常也可以添加注释说明，就像用注释解释代码那样。异常有一个 `add_note(note)` 方法接受一个字符串，并将其添加到异常的注释列表。标准的回溯在异常之后按照它们被添加的顺序呈现包括所有的注释。

```python
>>> try:
...     raise TypeError('bad type')
... except Exception as e:
...     e.add_note('Add some information')
...     e.add_note('Add some more information')
...     raise
... 
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
TypeError: bad type
Add some information
Add some more information
```

# 9. 类

## 命名空间

namespace （命名空间）是从名称到对象的映射。现在，大多数命名空间都使用 Python 字典实现。命名空间的例子有：内置名称集合（包括 abs() 函数以及内置异常的名称等）；一个模块的全局名称；一个函数调用中的局部名称；对象的属性集合。

对模块中名称的引用是属性引用：表达式 `modname.funcname` 中，`modname` 是模块对象，`funcname` 是模块的属性。模块属性和模块中定义的全局名称之间存在直接的映射：它们共享相同的命名空间。

命名空间是在不同时刻创建的，且拥有不同的生命周期：

- 模块的全局命名空间在读取模块定义时创建；通常，模块的命名空间也会持续到解释器退出
	- 从脚本文件读取或交互式读取的，由解释器顶层调用执行的语句是 `__main__` 模块调用的一部分，也拥有自己的全局命名空间
	- 内置名称也在模块里，即 `builtins` 模块
- 函数的局部命名空间在函数被调用时被创建，并在函数返回或抛出未在函数内被处理的异常时，被删除。每次递归调用都有自己的局部命名空间

## 作用域

命名空间的作用域是Python 代码中的一段文本区域，从这个区域可直接访问该命名空间。

Python 的作用域规则（LEGB）：

- L (Local)：局部作用域，在函数内部定义。
- E (Enclosing)：嵌套函数的外层函数作用域。
- G (Global)：模块级别的作用域。
- B (Built-in)：Python 内建作用域。

Python 中 `global` 和 `nonlocal` 语句的作用就是在内部作用域中，**修改**定义在外部作用域的变量，而不仅仅是读取：

- `global` 语句用于在函数内部**修改**定义在**模块全局**（Global Scope）的变量。如果只是**读取**全局变量，不需要 `global`。如果要在函数内部**赋值/修改**全局变量，**必须**使用 `global` 声明。
- `nonlocal` 语句用于在**嵌套函数**中，修改其**外层（非全局）函数**作用域中的变量。它会修改**直接外层**（Enclosing Scope）的变量，但不会查找到全局作用域，如果外层没有，会报错 `SyntaxError`。

```python
# 全局变量
global_var = "I'm global"

def outer():
    # 外层函数的变量
    enclosing_var = "I'm in enclosing scope"

    def inner():
        # 使用 global 修改全局变量
        global global_var
        global_var = "Modified by inner!"

        # 使用 nonlocal 修改外层变量
        nonlocal enclosing_var
        enclosing_var = "Modified by inner!"

        # 创建一个局部变量
        local_var = "I'm local to inner"
        print("Inside inner - local_var:", local_var)

    print("Before inner - global_var:", global_var)
    print("Before inner - enclosing_var:", enclosing_var)
    inner()
    print("After inner - enclosing_var:", enclosing_var)

print("In global scope - Before outer:", global_var)
outer()
print("In global scope - After outer:", global_var)
```

示例代码的输出：

```txt
In global scope - Before outer: I'm global
Before inner - global_var: I'm global
Before inner - enclosing_var: I'm in enclosing scope
Inside inner - local_var: I'm local to inner
After inner - enclosing_var: Modified by inner!
In global scope - After outer: Modified by inner!
```

## 类对象和实例对象

类对象支持两种操作：属性引用和实例化。

```python
class MyClass:
    """一个简单的示例类"""
    i = 12345

    def f(self):
        return 'hello world'
```

上述代码中有三次属性引用：

- `MyClass.__doc__` 返回一个文档字符串
- `MyClass.i` 返回一个整数
- `MyClass.f` 返回一个函数对象

类的实例化使用函数表示法。 可以把类对象视为返回该类的一个新实例的不带参数的函数，如 `x = MyClass()`。实例化操作会创建一个空对象。 许多类都希望创建的对象实例是根据特定初始状态定制的，特殊方法 `__init__()` 可以定制类如何初始化。

类实例化后，得到一个实例对象 `x`。实例对象支持一种操作：属性引用，属性包括数据属性和方法。注意，`x.f` 是一个方法对象，`MyClass.f` 才是函数对象。

```python
>>> MyClass.f
<function MyClass.f at 0x7929cf4acea0>
>>> x.f
<bound method MyClass.f of <__main__.MyClass object at 0x7929cf548290>>
```

方法对象的特殊之处在于，实例对象会作为函数的第一个参数被传入，比如调用 `x.f()` 其实就相当于 `MyClass.f(x)`（这里的实参 `x` 就是 `__init__()` 中的形参 `self` ）；调用一个具有 n 个参数的方法就相当于调用再多一个参数的对应函数，这个参数值为方法所属实例对象，位置在其他参数之前。

## 类变量和实例变量

实例变量用于每个实例的唯一数据，而类变量用于类的所有实例共享的属性和方法:

```python
class Dog:

    kind = 'canine'         # 类变量被所有实例所共享

    def __init__(self, name):
        self.name = name    # 实例变量为每个实例所独有
```

共享数据在涉及 mutable 对象，例如列表和字典，会有令人惊讶的结果。 例如以下代码中的 tricks 列表不应该被用作类变量，因为所有的 Dog 实例将只共享一个单独的列表:

```python
class Dog:

    tricks = []             # 类变量的错误用法

    def __init__(self, name):
        self.name = name
		# self.tricks = []    # 正确用法：为每个 Dog 实例新建一个空列表

    def add_trick(self, trick):
        self.tricks.append(trick)
```

## 继承

Python 有两个内置函数可被用于继承机制：

- 使用 `isinstance()` 来检查一个实例的类型: `isinstance(obj, int)` 仅会在 `obj.__class__` 为 int 或某个派生自 int 的类时为 True。
- 使用 `issubclass()` 来检查类的继承关系: `issubclass(bool, int)` 为 True，因为 bool 是 int 的子类。 但是，`issubclass(float, int)` 为 False，因为 float 不是 int 的子类。

多重继承，可以简单认为搜索从父类所继承属性的操作是深度优先、从左到右的，当存在重复时不会在同一个类中搜索两次。 因此，如果某个属性在 DerivedClassName 中找不到，就会在 Base1 中搜索它，然后（递归地）在 Base1 的基类中搜索，如果在那里也找不到，就将在 Base2 中搜索，依此类推。

```python
class DerivedClassName(Base1, Base2, Base3):
    <语句-1>
    .
    .
    .
    <语句-N>
```

## 名称改写

Python 不存在私有的实例变量。由于存在对于类私有成员的有效使用场景（例如避免名称与子类所定义的名称相冲突），因此存在对此种机制的有限支持，称为名称改写。 任何形式为 `__spam` 的标识符（至少带有两个前缀下划线，至多一个后缀下划线）的文本将被替换为 `_classname__spam`。

```python
class Mapping:
    def __init__(self, iterable):
        self.items_list = []
        self.__update(iterable)

    def update(self, iterable):
        for item in iterable:
            self.items_list.append(item)

    __update = update   # 原始 update() 方法的私有副本

class MappingSubclass(Mapping):

    def update(self, keys, values):
        # 为 update() 提供了新的签名
        # 但不会破坏 __init__()
        for item in zip(keys, values):
            self.items_list.append(item)
```

上面的示例即使在 `MappingSubclass` 引入了一个 `__update` 标识符的情况下也不会出错，因为它会在 `Mapping` 类中被替换为 `_Mapping__update` ；在 `MappingSubclass` 类中被替换为 `_MappingSubclass__update`。

## 迭代器与生成器

Python 中 for 语句就用上了迭代器：for 语句会在容器对象上调用 `iter()`。 该函数返回一个定义了 `__next__()` 方法的迭代器对象，此方法将逐一访问容器中的元素。 当元素用尽时，`__next__()` 将引发 `StopIteration` 异常来通知终止 for 循环。 内置函数 `next()` 可以调用 `__next__()` 方法

了解了迭代器后，可以为自定义的类添加迭代器行为：定义 [`__iter__()`](https://docs.python.org/zh-cn/3.14/library/stdtypes.html#container.__iter__ "container.__iter__") 方法用于返回一个带有 [`__next__()`](https://docs.python.org/zh-cn/3.14/library/stdtypes.html#iterator.__next__ "iterator.__next__") 方法的对象。 如果类已定义了 `__next__()`，那么 `__iter__()` 可以简单地返回 `self`:

```python
class Reverse:
    """对一个序列执行反向循环的迭代器。"""
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]
```

生成器是一个用于创建迭代器的简单而强大的工具。 它们的写法类似于标准的函数，但当它们要返回数据时会使用 `yield` 语句。 每次在生成器上调用 `next()` 时，它会从上次离开的位置恢复执行（它会记住上次执行语句时的所有数据值）。 一个显示如何非常容易地创建生成器的示例如下:

```python
def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]
```

生成器的写法更为紧凑，因为它会自动创建 `__iter__()` 和 `__next__()` 方法。

生成器表达式，语法类似列表推导式，但外层为圆括号而非方括号，表达式内的生成器立即被括号外的外层函数使用。生成器表达式相比完整的生成器更紧凑但较不灵活，相比等效的列表推导式则更为节省内存。如 `sum(i*i for i in range(10))`。
