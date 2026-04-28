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

帮助文档参考火狐的 [JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)。

<!-- more -->

JavaScript 有如下特点：

- 解释型语言
- 基于对象
	- JavaScript是一门基于对象的脚本语言，它不仅可以创建对象，也能使用现有的对象。但是面向对象的三大特性：『封装』、『继承』、『多态』中，JavaScript能够实现封装，可以模拟继承，不支持多态
- 弱类型
	- JavaScript中有明确的数据类型，但是声明一个变量后它可以接收任何类型的数据，并且会在程序执行过程中根据上下文自动转换类型
- 事件驱动。不需要经过Web服务器就可以对用户的输入做出响应
- 跨平台性。不依赖于操作系统，仅需要浏览器的支持

JavaScript 由三部分组成：

- ECMA
- BOM编程
	- Browser Object Model的简写，即浏览器对象模型。
	- BOM编程是将浏览器窗口的各个组成部分抽象成各个对象，通过各个对象的API操作组件行为的一种编程
- DOM编程
	- DOM（页面文档对象模型）编程是使用 `document` 对象的API完成对网页HTML文档进行动态修改，以实现网页数据和样式动态变化效果的编程
	- DOM编程是用window对象的 `document` 属性的相关API完成对页面元素的控制的编程

DOM 和 BOM 都是 Web APIs 。

- BOM 操作浏览器，比如页面弹窗，检测窗口宽度、存储数据到浏览器等等
- DOM 操作文档，比如对页面元素进行移动、大小、添加删除等操作

> [!info] BOM编程的对象结构
> window 顶级对象，代表整个浏览器窗口，windows 对象有如下属性
> - location属性，代表浏览器的地址栏
> - history属性，代表浏览器的访问历史
> - screen属性，代表屏幕
> - navigator属性,代表浏览器软件本身
> - `document` 属性，代表浏览器窗口目前解析的html文档
>
> 这五个属性，自身也是对象

# JS引入方式

## 内部脚本引入

在 html 页面中，通过一对 `<script>` 标签引入JS代码。

缺点：

- 内部脚本仅能在当前页面上使用，代码复用度不高

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小标题</title>
    <style>
        .btn1 {
            display: block;
            width: 150px;
            height: 40px;
            background-color: rgb(245, 241, 129);
            color: rgb(238, 31, 31);
            border: 3px solid rgb(238, 23, 66);
            font-size: 22px;
            font-family: '隶书',serif;
            line-height: 30px;
            border-radius: 5px;
        }
    </style>
    <script>
        function surprise(){
            alert("Hello,我是惊喜")
        }
    </script>
</head>
<body>
	<button class="btn1" onclick="surprise()">点我有惊喜</button>
</body>
</html>
```

![效果|500x0](https://vip.123pan.cn/1844935313/obsidian/Kooha-2026-04-20-08-53-18.gif)

## 外部脚本引入

一个html文档中，可以有多个 `<script>` 标签，但是一对 script 标签要么用于定义内部脚本，要么用于引入外部js文件，不能混用。

```js
// buttons.js

function surprise(){
    alert("Hello,我是惊喜")
}
```

在 `<head>` 标签中，通过 `<style>` 标签引入外部JS样式即可。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小标题</title>
    <style>
        .btn1 {
            display: block;
            width: 150px;
            height: 40px;
            background-color: rgb(245, 241, 129);
            color: rgb(238, 31, 31);
            border: 3px solid rgb(238, 23, 66);
            font-size: 22px;
            font-family: '隶书',serif;
            line-height: 30px;
            border-radius: 5px;
        }
    </style>
	<!-- 引入外部脚本 buttons.js -->
    <script src="js/buttons.js" type="text/javascript"></script>
</head>
<body>
    <button class="btn1" onclick="surprise()">点我有惊喜</button>
</body>
</html>
```

# JS变量和常量

变量语法格式：`let 变量名`

```js
let age = 18
let uname = prompt('请输入你的姓名：')
```

变量命名规则：

- 不能用关键字。
- 只能用下划线、字母、数字、$ 组成，且数字不能开头。
- 字母严格区分大小写。

变量命名规范：

- 起名要有意义。
- 遵守小驼峰命名法。第一个单词首字母小写，后面每个单词首字母大写。例：userName。

> 规则必须遵守，规范则不强制。

使用 `const` 声明的变量称为常量。常量声明后，其值不能改变。

```js
const PI = 3.14
```

# JS数据类型

JS 是一门弱数据类型的语言，只有当我们赋值了变量，才知道变量的数据类型，即 JavaScript 中变量的值决定了变量的数据类型。

- JS 变量可以使用不同的数据类型多次赋值

JS 的数据类型，共有六种。在 ES6 中又新增了 Symbol 和 BigInt 数据类型。

- 数值（`number`）：整数和小数
- 字符串（`string`）：文本
- 布尔值（`boolean`）：表示真伪的两个特殊值，即`true`（真）和`false`（假）。
- `undefined`：表示“未定义”或不存在，即由于目前没有定义，所以此处暂时没有任何值。
- `null`：表示空值
- 对象（object）：各种值组成的集合。

对象是最复杂的数据类型，又可以分成三个子类型。

- 狭义的对象（object）
- 数组（array）
- 函数（function）

> JS 把函数当成一种数据类型，可以赋值给变量，这为编程带来了很大的灵活性，也为 JS 的“函数式编程”奠定了基础。

## Number

数值类型统一为 number，不区分整数和浮点数。

数值类型包括 NaN。任何对 NaN 的操作都返回 NaN。

```js
console.log(NaN === NaN) // false
```

## String

通过单引号、双引号或反引号包裹的数据都叫字符串。

推荐用单引号书写 JS 的字符串类型。由于 HTML 语言的属性值使用双引号，所以很多项目约定 JS 的字符串只使用单引号。

```js
// 三种引号都可以表示字符串
let str = 'pink'
let str1 = "pink"
let str2 = `pink`
```

单引号/双引号可以互相嵌套，但是不可以自已嵌套自已。必要时可以使用转义符转义。

 ```js
console.log('Pink老师讲课有\'激情\'')  
 ```

String 的 `+` 不同于 Number 的 `+` ，前者用于拼接字符串，后者是做加法运算符。

```js
console.log('Pink老师讲课' + '有激情') // Pink老师讲课有激情
console.log(1 + 1)                   // 2

let age = 10
console.log('我今年' + age + '岁了')  // 我今年10岁了
```

**模板字符串**可以在一个字符串内解决不同类型的输出。

```js
// 外面用 `` ，里面 ${变量名}
console.log(`我今年${age}岁了`)
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

## Boolean

布尔类型表示肯定或否定，它有两个固定的值 `true` 和 `false` 。

转换规则是除了下面六个值被转为`false`，其他值都视为`true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`或`''`（空字符串）

> 注意，空数组（`[]`）和空对象（`{}`）对应的布尔值，都是 true 。

## Undefined

如果一个变量只声明，没赋值，那么值是 undefined 。

一般很少直接为某个变量赋值为 undefined。

## Null

null 是赋值为空。如果一个变量里面确定存放的是对象，但还没准备好对象，可以放个 null 。

```js
console.log(undefined + 1) // NaN
console.log(null + 1)      // 1
```

null 和 undefined 在写法上几乎等价。两者区别在于：

- `null`是一个表示“空”的对象，转为数值时为 `0`；
- `undefined`是一个表示“此处无定义”的原始值，转为数值时为 `NaN`。

## 数组

```js
// 声明数组
let arr = [10, 20, 30]

//数组长度
console.log(arr.length)
```

## 函数

JS函数说明

- 函数没有权限控制符
- 声明函数时需要用 `function` 关键字
- 不用声明函数的返回值类型，需要返回在函数体中直接 return 即可，也无需 void 关键字
- 参数列表中，无需数据类型

> 以上几条，JS函数和Python函数很相似。

- 调用函数时，实参和形参的个数可以不一致
- 函数没有异常列表

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
    /*
    语法1：function 函数名 (参数列表){函数体}
    */
    function sum(a, b){
        return a+b;
    }
    let result =sum(10, 20)
    console.log(result)

    /*
    语法2：let 函数名 = function (参数列表){函数体}
    */
    let add = function(a, b){
        return a+b;
    }
    console.log(add(1, 2))
</script>
</body>
</html>
```

## 检测类型

通过 `typeof` 关键字检测数据类型。typeof 有两种用法，作为运算符使用和作为函数使用。

```js
console.log(typeof 1)      // number
console.log(typeof '1')    // string
console.log(typeof true)   // boolean
let un
console.log(typeof un)     // undefined
console.log(typeof null)   // object
```

## 类型转换

某些运算符被执行时，系统内部自动将数据类型进行转换，这种转换称为**隐式转换**。

规则：

- `+` 号两边只要有一个是字符串，都会把另外一个转成字符串
- 除了 `+` 以外的算术运算符比如 `- * /` 等都会把数据转成数字类型

```js
console.log(2 + 2)    // 4
console.log(2 + '2')  // 22
console.log(2 - 2)    // 0
console.log(2 - '2')  // 0
```

为了避免因隐式转换带来的问题，可以对数据进行**显示类型转换**。

```js
// 字符串转换为数值，如果转换失败，则输出 NaN
let str = '123'
console.log(Number(str))
console.log(+str)
console.log(Number('str')) // NaN

// 转换为整数
console.log(parseInt('12.34px'))     // 12
console.log(parseInt('px12.34px'))   // NaN
// 转换为浮点数
console.log(parseFloat('12.34px'))   // 12.34
console.log(parseFloat('px12.34px')) // NaN
``` 

# JS运算符

算数运算符 `+ - * / %`

- 需要注意的是 / 和 %
    - `/` 在除0时，结果是 Infinity，而不是报错
    - `%` 在模0时，结果是 NaN，而不是报错

复合算数运算符 `++ -- += -= *= /= %=`

关系运算符 `> < >= <= == === !=`

- 需要注意的是 == 和 === 差别
    - `==` 符号，如果两端的数据类型不一致，会尝试将两端的数据转换成 number，再对比number大小
    - `===` 符号，如果两端数据类型不一致，直接返回false，数据类型一致在比较是否相同

逻辑运算符 `|| &&`

- 需要注意的是，这里直接就是短路的逻辑运算符

条件运算符 `条件? 值1 : 值2`

位运算符 `| & ^ << >> >>>`

# 流程控制

## JS注释

- 单行注释 `//`
- 多行注释 `/* */`
- 为了兼容 HTML 代码的注释，`<!-- -->` 也被视为合法的单行注释

## 输入输出

JavaScript代码执行顺序：

- 按 HTML 文档流顺序执行JS 代码
- `alert()` 和 `prompt()` 会跳过页面渲染优先执行

```js
// 输出内容是标签，也会被解析成网页元素
document.write('要出的内容')

// 页面弹出警告对话框
alert('要出的内容')

// 控制台输出语法，用于测试
console.log('要出的内容')

// 弹出一个对话框，对话框中包含一条提示用户的文字信息
prompt('请输入你的姓名：')
```

## 分支结构

### if 结构

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
	// 非空字符串 if判断为true
	if('false'){
	    console.log(true)
	}else{
	    console.log(false)
	}
	// 空字符串 if判断为false
	if(''){
	    console.log(true)
	}else{
	    console.log(false)
	}
	// 非零数字 if判断为true
	if(1){
	    console.log(true)
	}else{
	    console.log(false)
	}
	if(0){
	    console.log(true)
	}else{
	    console.log(false)
	}
</script>
</body>
</html>
```

### switch 结构

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
	let monthStr = prompt("请输入月份","例如:10 ");
	let month = Number.parseInt(monthStr)
	switch(month){
	    case 3:
	    case 4:
	    case 5:
	        console.log("春季");
	        break;
	    case 6:
	    case 7:
	    case 8:
	        console.log("夏季");
	        break;
	    case 9:
	    case 10:
	    case 11:
	        console.log("秋季");
	        break;
	    case 1:
	    case 2:
	    case 12:
	        console.log("冬季");
	        break;
	    default :
	        console.log("月份有误")
	}
</script>
</body>
</html>
```

> switch 语句后面的表达式，与 case 语句后面的表示式比较运行结果时，采用的是严格相等运算符（`===`），而不是相等运算符（`==`），这意味着比较时不会发生类型转换。

和 Python 一样有三元运算符 `?:`。

```js
var even = (n % 2 === 0) ? true : false;
```

## 循环结构

### while 循环

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
	// 打印九九乘法表
    let i = 1;
    while(i <= 9){
        let j = 1;
        while(j <= i){
            document.write(j+"*"+i+"="+i*j+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
            j++;
        }
        document.write("<hr/>");
        i++;
    }
</script>
</body>
</html>
```

### for 循环

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
    // 打印九九乘法表
    for(let i = 1; i <= 9; i++){
        for(let j = 1; j <= i; j++){
            document.write(j+"*"+i+"="+i*j+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        }
        document.write("<hr/>");
    }
</script>
</body>
</html>
```

### foreach 循环

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script>
    let cities = ["北京","上海","深圳","武汉","西安","成都"]
    document.write("<ul>")
    for(let index in cities){
        document.write("<li>" + cities[index] + "</li>")
    }
    document.write("</ul>")
</script>
</body>
</html>
```

### 标签

C 语言中有 goto 语句，JavaScript 中有标签（label）。语句的前面有标签，相当于定位符，用于跳转到程序的任意位置，标签的格式如下。

```
label:
  语句
```

标签可以是任意的标识符，但不能是保留字，语句部分可以是任意语句。

```js
// 标签通常与 `break` 语句和 `continue` 语句配合使用，跳出特定的循环
top:
	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 3; j++){
			if (i === 1 && j === 1) break top;
			console.log('i=' + i + ', j=' + j);
		}
	}
```

# 狭义对象

对象就是一组“键值对”（key-value）的集合，是一种无序的复合数据集合。对象的所有 key 都是字符串，所以加不加引号都可以。

对象的每一个 key 又称为“属性”（property），它的值可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用。对象的属性之间用逗号分隔，最后一个属性后面可以不加逗号。

## 创建对象

- 通过 `new Object()` 直接创建对象
- （推荐）通过 `{}` 形式创建对象

```js
let person = new Object();

// 给对象添加属性并赋值
// 属性可以动态创建，不必在对象声明时就指定。
person.name = "张小明";
person.age = 10;
person.foods = ["苹果","橘子","香蕉","葡萄"];
// 给对象添加功能函数
person.eat = function (){
	console.log(this.age + "岁的" + this.name + "喜欢吃:")
	for(let i=0; i < this.foods.length; i++){
		console.log(this.foods[i])
	}
}
//获得对象属性值
console.log(person.name)
console.log(person.age)
//调用对象方法
person.eat();
```

```js
let person = {
	"name": "张小明",
	"age": 10,
	"foods": ["苹果","香蕉","橘子","葡萄"],
	"eat": function (){
		console.log(this.age + "岁的" + this.name + "喜欢吃:")
		for(let i = 0; i < this.foods.length; i++){
			console.log(this.foods[i])
		}
	}
}

//获得对象属性值
console.log(person.name)
console.log(person.age)
//调用对象方法
person.eat();
```

## 数组对象

- `new Array()` 创建空数组
- `new Array(5)` 创建数组时给定长度
- `new Array(ele1,ele2,ele3,...,elen);` 创建数组时指定元素值
- `[ele1,ele2,ele3,...,elen]`; 相当于第三种语法的简写



如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

但是，这种引用只局限于对象，如果两个变量指向同一个原始类型的值。那么，变量这时都是值的拷贝，比如数值类型。

对象采用大括号表示，这导致了一个问题：如果行首是一个大括号，它到底是表达式还是语句？
JavaScript 一律视作语句。如果要解释为对象（表达式），最好在大括号前加上圆括号。因为圆括号的里面，只能是表达式。

```js
eval('{foo: 123}') // 123
eval('({foo: 123})') // {foo: 123}
```

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```js
var obj = {
  p: 'Hello World'
};

obj.p // "Hello World"
obj['p'] // "Hello World"
```

> [!warning] 
> 使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。
> 数值键名不能使用点运算符（因为会被当成小数点），只能使用方括号运算符。

```js
var foo = 'bar';

var obj = {
  foo: 1,
  bar: 2
  123: 'hello world'
};

obj.foo  // 1
obj[foo]  // 2
obj.123 // 报错
obj[123] // "hello world"
```

查看对象的所有属性，用`Object.keys`方法，如 `Object.keys(obj)`。

删除对象的属性，用`delete`命令，删除成功后返回`true`。如 `delete obj.foo` 。

> [!warning]
> 注意，删除一个不存在的属性，`delete`不报错，而且返回`true`。当 delete 无法删除属性时，才会返回 `false` 。
> `delete`命令只能删除对象本身的属性，无法删除继承的属性。此时 `delete` 返回 `true`，但继承的属性仍然正常使用。

查看属性是否存在：in 运算符。它的左边是一个字符串，表示属性名，右边是一个对象。

```js
var obj = { p: 1 };
'p' in obj // true
'toString' in obj // true
```

`in`运算符的一个问题是，它不能识别哪些属性是对象自身的，哪些属性是继承的。这时，可以使用对象的`hasOwnProperty`方法判断一下，是否为对象自身的属性。

属性的遍历：`for...in` 循环。它不仅遍历对象自身的属性，还遍历继承的属性，前提是这些属性是可遍历的，否则会跳过不可遍历的属性。

```js
// 利用对象的 hasOwnProperty 方法，仅遍历对象自身的属性
var person = { name: '老张' };

for (var key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key);
  }
}
```

`with` 语句用于操作同一个对象的多个属性时，提供一些书写的方便。

```js
var obj = {
  p1: 1,
  p2: 2,
};
with (obj) {
  p1 = 4;
  p2 = 5;
}
// 等同于
obj.p1 = 4;
obj.p2 = 5;
```

> [!warning] 
> 注意，如果`with`区块内部有变量的赋值操作，必须是当前对象已经存在的属性，否则会创造一个当前作用域的全局变量。
> 建议不要使用`with`语句，可以考虑用一个临时变量代替`with`。

