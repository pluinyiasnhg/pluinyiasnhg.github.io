---
title: JavaScript 入门
date: 2025-09-30
tags:
  - JavaScript
category:
  - 编程语言
---
# 前言

学习阮一峰老师的 [JavaScript 教程](https://wangdoc.com/javascript/)，不包括 ES6 语法。

<!-- more -->


# 1. 基本语法

## 变量

JavaScript 是一种动态类型语言，也就是说，变量的类型没有限制，变量可以随时更改类型。

```js
var a = 1;
a = 'hello';
```

变量的后一次声明并进行赋值，会覆盖掉前一次的值。

```js
var x = 1;
var x = 2;

// 等同于

var x = 1;
var x;
x = 2;
```

变量提升：所有的变量的声明语句，都会被提升到代码的头部。JavaScript 引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。

```js
console.log(a);
var a = 1;

// 等同于

var a;
console.log(a)
a = 1;
```

## 标识符

标识符命名规则如下：

- 第一个字符，可以是任意 Unicode 字母（包括英文字母和其他语言的字母），以及美元符号（`$`）和下划线（`_`）。
- 第二个字符及后面的字符，除了 Unicode 字母、美元符号和下划线，还可以用数字`0-9`。

```js
// 合法字符

arg0
_tmp
$elem
π
临时变量

// 非法字符

1a  // 第一个字符不能是数字
23  // 同上
***  // 标识符不能包含星号
a+b  // 标识符不能包含加号
-d  // 标识符不能包含减号或连词线
```

## 注释

- 单行注释，用`//`起头
- 多行注释，放在`/*`和`*/`之间
- 兼容 HTML 代码的注释，所以`<!--`和`-->`也被视为合法的单行注释

需要注意的是，`-->`只有在行首，才会被当成单行注释，否则会当作正常的运算。

## 区块

JavaScript 使用大括号，将多个相关的语句组合在一起，称为“区块”（block）。

对于`var`命令来说，JavaScript 的区块不构成单独的作用域（scope）。也就是说，在区块内部，使用`var`命令声明并赋值了变量`a`，然后在区块外部，变量`a`依然有效，区块对于`var`命令不构成单独的作用域，与不使用区块的情况没有任何区别。

## 条件语句

和 C 语言一样有 if 结构和 switch 结构。

不一样的地方有：`switch`语句部分和`case`语句部分，都可以使用表达式。

```js
switch (1 + 3) {
  case 2 + 2:
    f();
    break;
  default:
    neverHappens();
}
```

switch 语句后面的表达式，与 case 语句后面的表示式比较运行结果时，采用的是严格相等运算符（`===`），而不是相等运算符（`==`），这意味着比较时不会发生类型转换。

和 Python 一样有三元运算符 `?:`。

```js
var even = (n % 2 === 0) ? true : false;
```

## 循环语句

有类似 C 语言的 while 循环、for 循环、do while 循环。

C 语言中有 goto 语句，JavaScript 中有标签（label）。语句的前面有标签，相当于定位符，用于跳转到程序的任意位置，标签的格式如下。

```
label:
  语句
```

标签可以是任意的标识符，但不能是保留字，语句部分可以是任意语句。

标签通常与`break`语句和`continue`语句配合使用，跳出特定的循环。

```js
top:
  for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
      if (i === 1 && j === 1) break top;
      console.log('i=' + i + ', j=' + j);
    }
  }
```

# 2. 数据类型

JavaScript 的数据类型，共有六种。在 ES6 中又新增了 Symbol 和 BigInt 数据类型。

- 数值（number）：整数和小数
- 字符串（string）：文本
- 布尔值（boolean）：表示真伪的两个特殊值，即`true`（真）和`false`（假）。
- `undefined`：表示“未定义”或不存在，即由于目前没有定义，所以此处暂时没有任何值。
- `null`：表示空值
- 对象（object）：各种值组成的集合。

对象是最复杂的数据类型，又可以分成三个子类型。

- 狭义的对象（object）
- 数组（array）
- 函数（function）

JavaScript 把函数当成一种数据类型，可以赋值给变量，这为编程带来了很大的灵活性，也为 JavaScript 的“函数式编程”奠定了基础。

## 查看类型

JavaScript 有三种方法，可以确定一个值到底是什么类型。

- `typeof`运算符
- `instanceof`运算符
- `Object.prototype.toString`方法

```js
typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"
typeof undefined // "undefined"

function f() {}
typeof f  // "function"

typeof window // "object"
typeof {} // "object"
typeof [] // "object"
```

上面代码中，空数组（`[]`）的类型也是`object`，这表示在 JavaScript 内部，数组本质上只是一种特殊的对象。

区分数组和对象可以用`instanceof`运算符。

```js
var o = {};
var a = [];

o instanceof Array // false
a instanceof Array // true
```

`null`的类型是`object`，这是由于历史原因造成的。后来`null`独立出来，作为一种单独的数据类型，为了兼容以前的代码，`typeof null`返回`object`就没法改变了。

## 数值

JavaScript 内部，**所有数字都是以64位浮点数形式储存**，即使整数也是如此。所以，`1`与`1.0`是相同的，是同一个数。必须用整数进行运算时，会将浮点数转换为整数参与运算。

上溢。如果一个数大于等于2的1024次方，那么就会发生“正向溢出”，即 JavaScript 无法表示这么大的数，这时就会返回`Infinity`。

下溢。如果一个数小于等于2的-1075次方（指数部分最小值-1023，再加上小数部分的52位），那么就会发生为“负向溢出”，即 JavaScript 无法表示这么小的数，这时会直接返回`0`。

特殊数值有以下几个：

- 正负0是等价的。但由于正负 Infinity 的存在，所以 `1 / +0` 和 `1 / -0` 结果不一样
- `NaN`[^1]，Not a Number，属于 Number 类型。有时可以看作微积分中的未定式
- `Infinity` 表示“无穷”，有正无穷和负无穷

这三个特殊数值之间可以像微积分中那样进行四则运算。注意，`Infinity`与`null`计算时，`null`会转成0，等同于与`0`的计算；`Infinity`与`undefined`计算，返回的都是`NaN`。

`parseInt`方法用于将字符串转为整数。它的第一个参数是接收字符串，第二个参数是指定整数的进制格式。如果第一个参数是其他类型，会进行一次字符串转换，再转换为整数。建议，第一个参数老老实实的输入字符串格式的，如果是数值类型，会出现各种奇怪问题。

```js
parseInt([1]) // 1
// 等同于
parseInt(String([1])) // 1
```

`parseInt` 处理字符串时，会尽最大努力转换成数字，比如输入 `'  12**'`，输出 `12` 。返回值为各种进制格式（2到36进制）的整数，或者 NaN。

`parseFloat`方法用于将一个字符串转为浮点数。

`isNaN`方法可以用来判断一个值是否为`NaN`。注意，`isNaN`只对数值有效，如果传入其他值，会被先转成数值。对于字符串，该方法先把字符串转换为 NaN，所以字符串也被 `isNaN` 视作 NaN。

```js
isNaN('Hello') // true
// 相当于
isNaN(Number('Hello')) // true
```

判断`NaN`的可靠方法是，利用`NaN`为唯一不等于自身的值的这个特点，进行判断。

```js
function myIsNaN(value) {
  return value !== value;
}
```

`isFinite`方法返回一个布尔值，表示某个值是否为正常的数值。除了`Infinity`、`-Infinity`、`NaN`和`undefined`这几个值会返回`false`，`isFinite`对于其他的数值都会返回`true`。

## 字符串

JavaScript 的字符串使用单引号或双引号。要在单引号里面继续使用单引号，需要对内部单引号进行转义。双引号的情况同理。

由于 HTML 语言的属性值使用双引号，所以很多项目约定 JavaScript 语言的字符串只使用单引号。

太长的字符串可以分成多行，需要在每行的尾部使用反斜杠 `\`。

```js
var longString = 'Long \
long \
long \
string';

longString
// "Long long long string"
```

字符串可以被视为字符数组，可以像数组那样访问元素，但不能修改字符。

```js
var s = 'hello';
s[0] // "h"
s[5] // undefined
s[-1] // undefined

// 直接对字符串使用方括号运算符
'hello'[1] // "e"
```

对于码点在`U+10000`到`U+10FFFF`之间的字符，JavaScript 总是认为它们是两个字符（`length`属性为2）。JavaScript 初版标准将 Unicode 字符长度限定为两字节，后来 Unicode 扩充后，JavaScript 无法正常识别四字节字符。所以，JavaScript 返回的字符串长度可能是不正确的。

## 布尔值

下列运算符会返回布尔值：

- 前置逻辑运算符： `!` (Not)
- 相等运算符：`===`，`!==`，`==`，`!=`
- 比较运算符：`>`，`>=`，`<`，`<=`

转换规则是除了下面六个值被转为`false`，其他值都视为`true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`或`''`（空字符串）

注意，空数组（`[]`）和空对象（`{}`）对应的布尔值，都是`true`。

## null, undefined

`null` 和 `undefined` 在写法上几乎等价。两者区别在于：`null`是一个表示“空”的对象，转为数值时为`0`；`undefined`是一个表示“此处无定义”的原始值，转为数值时为`NaN`。

## 狭义对象

（未完）

## 数组

## 函数



[^1]: `NaN` 不等于任何值，包括它本身。
