---
title: Java 基础-高级应用
date: 2026-03-14
tags:
  - Java
category:
  - 编程语言
---
# 前言

学习尚硅谷的[《Java零基础全套视频教程(宋红康主讲，java入门自学必备)》](https://www.bilibili.com/video/BV1PY411e7J6)的分集124到193。

第3阶段：Java语言的高级应用，包括：异常处理、多线程、IO流、集合框架、反射、网络编程、其它常用的API等，不包括新特性。

<!-- more -->

- 第1阶段：Java基本语法
	- Java概述、关键字、标识符、变量、运算符、流程控制（条件判断、选择结构、循环结构）、IDEA、数组
- 第2阶段：Java面向对象编程
	- 类及类的内部成员
	- 面向对象的三大特征
	- 其它关键字的使用
- 第3阶段：Java语言的高级应用
	- 异常处理、多线程、IO流、集合框架、反射、网络编程、新特性、其它常用的API等

# 异常处理

在使用计算机语言进行项目开发的过程中，即使程序员把代码写得尽善尽美，在系统的运行过程中仍然会遇到一些问题，因为很多问题不是靠代码能够避免的，比如：`客户输入数据的格式问题`，`读取文件是否存在`，`网络是否始终保持通畅` 等等。

异常：是指程序在执行过程中，出现的非正常情况，如果不处理最终会导致 JVM 的非正常停止。

异常指的并不是语法错误和逻辑错误。语法错了，编译不通过，不会产生字节码文件，根本不能运行。代码逻辑错误，只是没有得到想要的结果，例如：求a与b的和，你写成了a-b。

Java中是如何表示不同的异常情况，又是如何让程序员得知，并处理异常的呢？

Java中把不同的异常用不同的类表示，一旦发生某种异常，就`创建该异常类型的对象`，并且抛出（throw）。然后程序员可以捕获(catch)到这个异常对象，并处理；如果没有捕获(catch)这个异常对象，那么这个异常对象将会导致程序终止。

**Java异常体系**

```txt
java.lang.Throwable:异常体系的根父类
    |---java.lang.Error:错误。Java虚拟机无法解决的严重问题。如：JVM系统内部错误、资源耗尽等严重情况。一般不编写针对性的代码进行处理。
               |---- StackOverflowError、OutOfMemoryError
    |---java.lang.Exception:异常。我们可以编写针对性的代码进行处理。
               |----编译时异常：(受检异常)在执行javac.exe命令时，出现的异常。
                    |----- ClassNotFoundException
                    |----- FileNotFoundException
                    |----- IOException
               |----运行时异常：(非受检异常)在执行java.exe命令时，出现的异常。
                    |---- ArrayIndexOutOfBoundsException
                    |---- NullPointerException
                    |---- ClassCastException
                    |---- NumberFormatException
                    |---- InputMismatchException
                    |---- ArithmeticException
```

> 本章讲的异常处理，针对的是 Exception。

**Throwable中的常用方法：**

- `public void printStackTrace()`：打印异常的详细信息。包含了异常的类型、异常的原因、异常出现的位置、在开发和调试阶段都得使用 printStackTrace。
- `public String getMessage()`：获取发生异常的原因。

Java提供了异常处理的**抓抛模型**。

```txt
过程1：“抛”
	"自动抛"：程序在执行的过程当中，一旦出现异常，就会在出现异常的代码处，自动生成对应异常类的对象，并将此对象抛出。
	"手动抛"：程序在执行的过程当中，不满足指定条件的情况下，我们主动的使用"throw + 异常类的对象"方式抛出异常对象。

过程2：“抓”
    狭义上讲：try-catch的方式捕获异常，并处理。
    广义上讲：把“抓”理解为“处理”。则此时对应着异常处理的两种方式：1. try-catch-finally 2. throws
```

- Java程序的执行过程中如出现异常，会生成一个异常类对象，该异常对象将被提交给Java运行时系统，这个过程称为**抛出(throw)异常**。一旦抛出，此程序就不执行其后的代码了。
- 如果一个方法内抛出异常，该异常对象会被抛给调用者方法中处理。如果异常没有在调用者方法中处理，它继续被抛给这个调用方法的上层方法。这个过程将一直继续下去，直到异常被处理。这一过程称为**捕获(catch)异常**。
- 如果一个异常回到main()方法，并且main()也不处理，则程序运行终止。

## 捕获异常（try-catch-finally）

```java
try {
	......	//可能产生异常的代码
}
catch( 异常类型1 e ) {
	......	//当产生异常类型1型异常时的处置措施
}
catch( 异常类型2 e ) {
	...... 	//当产生异常类型2型异常时的处置措施
}  
finally {
	...... //无论是否发生异常，都无条件执行的语句
} 
```

![try-catch|600x0](https://vip.123pan.cn/1844935313/obsidian/image-20220503122722605.png)

**finally使用**：

异常会引发程序跳转，从而导致有些语句执行不到。而程序中有一些特定的代码无论异常是否发生，都需要执行。例如，数据库连接、输入流输出流、Socket连接、Lock锁的关闭等，这样的代码通常就会放到finally块中，即把一定要被执行的代码声明在finally中。

> 唯一的例外，使用 System.exit(0) 来终止当前正在运行的 Java 虚拟机。

## 声明异常（throws）

```java
// 修饰符 返回值类型 方法名(参数) throws 异常类名1, 异常类名2… {   }	
public void readFile(String file)  throws FileNotFoundException, IOException {
	...
    FileInputStream fis = new FileInputStream(file);
	...
}
```

如果在编写方法体的代码时，某句代码可能发生某个编译时异常，不处理编译不通过，但是在当前方法体中可能`不适合处理`或`无法给出合理的处理方式`，则此方法应`显示地`声明抛出异常，表明该方法将不对这些异常进行处理，而由该方法的调用者负责处理。

在方法声明中用`throws语句`可以声明抛出异常的列表，throws后面的异常类型可以是方法中产生的异常类型，也可以是它的父类。

**两种异常处理方式的选择**

前提：对于异常，使用相应的处理方式。此时的异常，主要指的是编译时异常。

- 如果程序代码中，涉及到资源的调用（流、数据库连接、网络连接等），则必须考虑使用 try-catch-finally 来处理，保证不出现内存泄漏。
- 如果父类被重写的方法没有throws异常类型，则子类重写的方法中如果出现异常，只能考虑使用try-catch-finally进行处理，不能throws。
- 开发中，方法a中依次调用了方法b,c,d等方法，方法b,c,d之间是递进关系。此时，如果方法b,c,d中有异常，我们通常选择使用throws，而方法a中通常选择使用try-catch-finally。

## 抛出异常（throw）

Java 中异常对象的生成有两种方式：

- 由虚拟机**自动生成**：程序运行过程中，虚拟机检测到程序发生了问题，那么针对当前代码，就会在后台自动创建一个对应异常类的实例对象并抛出。
- 由开发人员**手动创建**：`new 异常类型([实参列表]);`，如果创建好的异常对象不抛出对程序没有任何影响，和创建一个普通对象一样，但是一旦throw抛出，就会对程序运行产生影响了。

throw语句会导致程序执行流程被改变，throw语句是明确抛出一个异常对象，因此它`下面的代码将不会执行`。

如果当前方法没有try...catch处理这个异常对象，throw语句就会`代替return语句`提前终止当前方法的执行，并返回一个异常对象给调用者。

## 自定义异常

Java中不同的异常类，分别表示着某一种具体的异常情况。开发中总是有些异常情况是核心类库中没有定义好的，此时我们需要根据业务的异常情况来定义异常类。例如年龄负数问题，考试成绩负数问题，某员工已在团队中等。

**自定义异常类**

1. 继承于现有的异常体系。
	- 自定义一个编译时异常类型：自定义类继承 `java.lang.Exception`。
	- 自定义一个运行时异常类型：自定义类继承 `java.lang.RuntimeException`。
2. 建议大家提供至少两个构造器，一个是无参构造，一个是(String message)构造器。
3. 提供一个全局常量，声明为：`static final long serialVersionUID`。

```java
//自定义异常
public class NotTriangleException extends Exception {
    static final long serialVersionUID = 13465653435L;

    public NotTriangleException() {
    }

    public NotTriangleException(String message) {
        super(message);
    }
}
```

> [!info] 为什么需要自定义异常类？
> 我们其实更关心的是，通过异常的名称，就能直接判断此异常出现的原因。
> 既然如此，我们就有必要在实际开发场景中，不满足我们指定的条件时，指明我们自己特有的异常类。通过此异常类的名称，就能判断出具体出现的问题（**见名知意**）。

# 多线程

**进程与线程：**

- **进程**（process）：程序的一次执行过程，或是正在内存中运行的应用程序。如：运行中的QQ，运行中的网易音乐播放器。
	- 进程作为`操作系统调度和分配资源的最小单位`（亦是系统运行程序的基本单位），系统在运行时会为每个进程分配不同的内存区域。
- **线程**（thread）：进程可进一步细化为线程，是程序内部的`一条执行路径`。一个进程中至少有一个线程。
	- 一个进程同一时间，若`并行`执行多个线程，就是支持多线程的。
	- 线程作为`CPU调度和执行的最小单位`。单核CPU在一个时间单元内，只能执行一个线程的任务。

![线程共享区与隔离区|700x0](https://vip.123pan.cn/1844935313/obsidian/image-20220514175737426.png)

**多线程程序的优点：**

1. 提高应用程序的响应。对图形化界面更有意义，可增强用户体验。
2. 提高计算机系统CPU的利用率
3. 改善程序结构。将既长又复杂的进程分为多个线程，独立运行，利于理解和修改

**并行与并发：**

- **并行**（parallel）：指两个或多个事件在`同一时刻`发生（同时发生）。指在同一时刻，有`多条指令`在`多个CPU`上`同时`执行。比如：多个人同时做不同的事。
- **并发**（concurrency）：指两个或多个事件在`同一个时间段内`发生。即在一段时间内，有`多条指令`在`单个CPU`上`快速轮换、交替`执行，使得在宏观上具有多个进程同时执行的效果。

## 创建线程

Java语言的JVM允许程序运行多个线程，使用`java.lang.Thread`类代表**线程**，所有的线程对象都必须是Thread类或其子类的实例。

- 每个线程都是通过某个特定Thread对象的`run()`方法来完成操作的，因此把run()方法体称为线程执行体。
- 通过该Thread对象的`start()`方法来启动这个线程，而非直接调用run()

### 方式一：继承Thread类

Java通过继承Thread类来创建并启动多线程的步骤如下：

1. 定义Thread类的子类，并重写该类的run()方法，该run()方法的方法体就代表了线程需要完成的任务
2. 创建Thread子类的实例，即创建了线程对象
3. 调用线程对象的start()方法来启动该线程

```java
//自定义线程类
class MyThread extends Thread {
    //定义指定线程名称的构造方法
    public MyThread(String name) {
        super(name);
    }
    /**
     * 重写run方法，完成该线程执行的逻辑
     */
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(getName() + "：正在执行！" + i);
        }
    }
}

public class TestMyThread {
    public static void main(String[] args) {
        //创建自定义线程对象1
        MyThread mt1 = new MyThread("子线程1");
        //开启子线程1
        mt1.start();
        
        //创建自定义线程对象2
        MyThread mt2 = new MyThread("子线程2");
        //开启子线程2
        mt2.start();
    }
}
```

注意事项：

- 如果自己手动调用run()方法，那么就只是普通方法，没有启动多线程模式。
- run()方法由JVM调用，什么时候调用，执行的过程控制都有操作系统的CPU调度决定。
- 一个线程对象只能调用一次start()方法启动。如果重复调用了，则将抛出以上的异常 `IllegalThreadStateException`。

### 方式二：实现Runnable接口

Java有单继承的限制，当我们无法继承Thread类时，那么该如何做呢？在核心类库中提供了Runnable接口，我们可以实现Runnable接口，重写run()方法，然后再通过Thread类的对象代理启动和执行我们的线程体run()方法。

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);
        }
    }
}

public class TestMyRunnable {
    public static void main(String[] args) {
		//创建Runnable实现类的实例
        MyRunnable mr = new MyRunnable();
		
		//以此实例作为Thread的target参数来创建Thread对象，该Thread对象才是真正的线程对象。
        MyThread mt1 = new MyThread(mr, "子线程1");
        mt1.start();
        MyThread mt2 = new MyThread(mr, "子线程2");
        mt2.start();
    }
}
```

| 对比  | 方式一和方式二                      |
| --- | ---------------------------- |
| 共同点 | 启动线程，使用的都是Thread类中定义的start() |
|     | 创建的线程对象，都是Thread类或其子类的实例。    |
| 不同点 | 一个是类的继承，一个是接口的实现。            |

> [!info] 建议使用实现Runnable接口的方式。
> Runnable方式的好处：
> 1. 实现的方式，避免的类的单继承的局限性
> 2. 更适合处理有共享数据的问题。
> 3. 实现了代码和数据的分离。

### 方式三：实现Callable接口

与使用Runnable相比， Callable功能更强大。

- 相比run()方法，可以有返回值
- 方法可以抛出异常
- 支持泛型的返回值（需要借助`FutureTask`类，获取返回结果）
	- FutureTask是Futrue接口的唯一的实现类
	- FutureTask 同时实现了Runnable, Future接口。它既可以作为Runnable被线程执行，又可以作为Future得到Callable的返回值

缺点是，如果在主线程中需要获取分线程call()的返回值，则此时的主线程是阻塞状态的。

```java
//1.创建一个实现Callable的实现类
class NumThread implements Callable {
    //2.实现call方法，将此线程需要执行的操作声明在call()中
    @Override
    public Object call() throws Exception {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
                System.out.println(i);
                sum += i;
            }
        }
        return sum;
    }
}

public class CallableTest {
    public static void main(String[] args) {
        //3.创建Callable接口实现类的对象
        NumThread numThread = new NumThread();

        //4.将此Callable接口实现类的对象作为传递到FutureTask构造器中，创建FutureTask的对象
        FutureTask futureTask = new FutureTask(numThread);
		
        //5.将FutureTask的对象作为参数传递到Thread类的构造器中，创建Thread对象，并调用start()
        new Thread(futureTask).start();

        try {
            //6.获取Callable中call方法的返回值
            //get()返回值即为FutureTask构造器参数Callable实现类重写的call()的返回值。
            Object sum = futureTask.get();
            System.out.println("总和为：" + sum);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

### 方式四：线程池

提前创建多个线程，放入线程池中，使用时直接获取，使用完放回池中。可以避免频繁创建销毁、实现重复利用。

**线程池的好处**：

- 提高了程序执行的效率。（因为线程已经提前创建好了）
- 提高了资源的复用率。（因为执行完的线程并未销毁，而是可以继续执行其他的任务）
- 可以设置相关的参数，对线程池中的线程的使用进行管理

**线程池相关API**

JDK5.0之前，我们必须手动自定义线程池。从JDK5.0开始，Java内置线程池相关的API。在java.util.concurrent包下提供了线程池相关API：`ExecutorService` 和 `Executors`。

- `ExecutorService`：真正的线程池接口。常见子类 `ThreadPoolExecutor`
    - `void execute(Runnable command)` ：执行任务/命令，没有返回值，一般用来执行Runnable
    - `<T> Future<T> submit(Callable<T> task)`：执行任务，有返回值，一般用来执行Callable
    - `void shutdown()` ：关闭连接池
- `Executors`：一个线程池的工厂类，通过此类的静态工厂方法可以创建多种类型的线程池对象。
    - `Executors.newCachedThreadPool()`：创建一个可根据需要创建新线程的线程池
    - `Executors.newFixedThreadPool(int nThreads)`; 创建一个可重用固定线程数的线程池
    - `Executors.newSingleThreadExecutor()` ：创建一个只有一个线程的线程池
    - `Executors.newScheduledThreadPool(int corePoolSize)`：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。

```java
//1. 提供指定线程数量的线程池
ExecutorService service = Executors.newFixedThreadPool(10);
ThreadPoolExecutor service1 = (ThreadPoolExecutor) service;

//        //设置线程池的属性
//        System.out.println(service.getClass());//ThreadPoolExecutor
service1.setMaximumPoolSize(50); //设置线程池中线程数的上限

//2.执行指定的线程的操作。需要提供实现Runnable接口或Callable接口实现类的对象
service.execute(new NumberThread()); //适合使用于Runnable
service.execute(new NumberThread1());//适合使用于Runnable

try {
	Future future = service.submit(new NumberThread2());//适合使用于Callable
	System.out.println("总和为：" + future.get());
} catch (Exception e) {
	e.printStackTrace();
}

//3.关闭连接池
service.shutdown();
```

## 线程生命周期

JDK 1.5之前，线程的生命周期有五种状态：新建（New）、就绪（Runnable）、运行（Running）、阻塞（Blocked）、死亡（Dead）。CPU需要在多条线程之间切换，于是线程状态会多次在运行、阻塞、就绪之间切换。

![JDK 1.5之前的线程生命周期|700x0](https://vip.123pan.cn/1844935313/obsidian/image-20220401002307038.png)

- `public void start()` :导致此线程开始执行; Java虚拟机调用此线程的run方法。
- `public static void yield()`：让当前线程释放CPU的执行权，线程进入就绪态。
- `public final void stop()`：**已过时，不建议使用**。强行结束一个线程的执行，直接进入死亡状态。run()即刻停止，可能会导致一些清理性的工作得不到完成，如文件，数据库等的关闭。同时，会立即释放该线程所持有的所有的锁，导致数据得不到同步的处理，出现数据不一致的问题。
- `public static void sleep(long millis)` :使当前正在执行的线程以指定的毫秒数堵塞。这是个静态方法，即 `new MyThread().sleep(1000)` 实际运行是 `Thread.sleep(1000)` 。
- `void join()` ：在线程a中通过线程b调用join()，意味着线程a进入阻塞状态，直到线程b执行结束，线程a才结束阻塞状态，继续执行。
- `void suspend()` / `void resume()` : 这两个操作就好比播放器的暂停和恢复。二者必须成对出现，否则非常容易发生死锁。suspend()调用会导致线程暂停，但不会释放任何锁资源，导致其它线程都无法访问被它占用的锁，直到调用resume()。**已过时，不建议使用**。

![JDK1.5及以后的线程生命周期|700x0](https://vip.123pan.cn/1844935313/obsidian/image-20220524203355448.png)

 - `RUNNABLE`（可运行）：这里没有区分就绪和运行状态。对于Java对象来说，只能标记为可运行，至于什么时候运行，不是JVM来控制的了，是OS来进行调度的，而且时间非常短暂，因此对于Java对象的状态来说，无法区分。
 - 根据Thread.State的定义，阻塞状态分为三种：`BLOCKED`、`WAITING`、`TIMED_WAITING`。

## 线程安全问题解决

什么是线程的安全问题？多个线程操作共享数据，就有可能出现安全问题。

### 同步机制

同步机制的原理，其实就相当于给某段代码加“锁”，任何线程想要执行这段代码，都要先获得“锁”，我们称它为同步锁。

哪个线程获得了“同步锁”对象之后，”同步锁“对象就会记录这个线程的ID，这样其他线程就只能等待了，除非这个线程”释放“了锁对象，其他线程才能重新获得/占用”同步锁“对象。

**同步代码块**：synchronized 关键字可以用于某个区块前面，表示只对这个区块的资源实行互斥访问。

```java
//同步监视器,俗称锁。哪个线程获取了锁，哪个线程就能执行需要被同步的代码。
//同步监视器，可以使用任何一个类的对象充当。但是，多个线程必须共用同一个同步监视器。
synchronized(同步监视器) {
     需要同步操作的代码
}
```

**同步方法**：synchronized 关键字直接修饰方法，表示同一时刻只有一个线程能进入这个方法，其他线程在外面等着。

```java
public synchronized void method() {
    可能会产生线程安全问题的代码
}
```

**synchronized的锁**

- 同步锁对象可以是任意类型，但是必须保证竞争“同一个共享资源”的多个线程必须使用同一个“同步锁对象”。
- 对于同步代码块来说，同步锁对象是由程序员手动指定的（很多时候也是指定为this或类名.class）。
- 但是对于同步方法来说，同步锁对象只能是默认的：
	- 静态方法：当前类的Class对象（类名.class）
	- 非静态方法：this

**应用：解决懒汉式线程安全问题**

懒汉式：延迟创建对象，第一次调用getInstance方法再创建对象

```java
public class LazyOne {
    private static LazyOne instance;

    private LazyOne() {}

    //方式1：同步静态方法
    public static synchronized LazyOne getInstance1() {
        if(instance == null) {
            instance = new LazyOne();
        }
        return instance;
    }
    //方式2：同步代码块
    public static LazyOne getInstance2() {
        synchronized(LazyOne.class) {
            if (instance == null) {
                instance = new LazyOne();
            }
            return instance;
        }
    }
    //方式3：指令重排问题
    // private static volatile LazyOne instance;
    public static LazyOne getInstance3() {
        if(instance == null) {
            synchronized (LazyOne.class) {
                try {
                    Thread.sleep(10);//加这个代码，暴露问题
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if(instance == null) {
                    instance = new LazyOne();
                }
            }
        }

        return instance;
    }
}
```

> [!warning] 上述方式3中，有指令重排问题
> mem = allocate(); 为单例对象分配内存空间
> instance = mem;   instance引用现在非空，但还未初始化
> ctorSingleton(instance); 为单例对象通过instance调用构造器
>
> 如果在 instance 引用非空但未初始化时，另一个线程返回instance，就会出问题。
> 从JDK2开始，分配空间、初始化、调用构造器会在线程的工作存储区一次性完成，然后复制到主存储区。但是需要volatile关键字，避免指令重排。

### Lock（锁）

**死锁**：不同的线程分别占用对方需要的同步资源不放弃，都在等待对方放弃自己需要的同步资源，就形成了线程的死锁。

一旦出现死锁，整个程序既不会发生异常，也不会给出任何提示，只是所有线程处于阻塞状态，无法继续。

**诱发死锁的原因**：以下4个条件，同时出现就会触发死锁。

- 互斥条件
- 占用且等待
- 不可抢夺（或不可抢占）
- 循环等待

**解决死锁**：死锁一旦出现，基本很难人为干预，只能尽量规避。可以考虑打破上面的诱发条件。

- 针对条件1：互斥条件基本上无法被破坏。因为线程需要通过互斥解决安全问题。
- 针对条件2：可以考虑一次性申请所有所需的资源，这样就不存在等待的问题。
- 针对条件3：占用部分资源的线程在进一步申请其他资源时，如果申请不到，就主动释放掉已经占用的资源。
- 针对条件4：可以将资源改为线性顺序。申请资源时，先申请序号较小的，这样避免循环等待问题。

**Lock锁**也称同步锁，可以保证线程的安全，是JDK5.0的新增功能。

`java.util.concurrent.locks.Lock` 接口是控制多个线程对共享资源进行访问的工具。锁提供了对共享资源的独占访问，每次只能有一个线程对Lock对象加锁。线程开始访问共享资源之前应先获得Lock对象。

比较常用的是 `ReentrantLock`，可以显式加锁、释放锁。ReentrantLock类实现了 Lock 接口，它拥有与 synchronized 相同的并发性和内存语义，但是添加了类似锁投票、定时锁等候和可中断锁等候的一些特性。此外，它还提供了在激烈争用情况下更佳的性能。

加锁与释放锁方法，如下：

- public void lock() :加同步锁。
- public void unlock() :释放同步锁。

```java
class A {
    //1. 创建Lock的实例，必须确保多个线程共享同一个Lock实例
	private final ReentrantLock lock = new ReenTrantLock();
	public void m() {
        //2. 调动lock()，实现需共享的代码的锁定
		lock.lock();
		try {
			//保证线程安全的代码;
		}
		finally {
            //3. 调用unlock()，释放共享代码的锁定
			//如果同步代码有异常，将unlock()写入finally语句块。
			lock.unlock();  
		}
	}
}
```

**synchronized与Lock的对比**

1. Lock是显式锁（手动开启和关闭锁，别忘记关闭锁），synchronized是隐式锁，出了作用域、遇到异常等自动解锁
2. Lock只有代码块锁，synchronized有代码块锁和方法锁
3. 使用Lock锁，JVM将花费较少的时间来调度线程，性能更好。并且具有更好的扩展性（提供更多的子类），更体现面向对象。
4. （了解）Lock锁可以对读不加锁，对写加锁，synchronized不可以
5. （了解）Lock锁可以有多种获取锁的方式，可以从sleep的线程中抢到锁，synchronized不可以

> 开发建议中处理线程安全问题优先使用顺序为：
> Lock --> 同步代码块 --> 同步方法

## 线程间通信

当我们需要多个线程来共同完成一件任务，并且我们希望他们有规律的执行，那么多线程之间需要一些通信机制，可以协调它们的工作，以此实现多线程共同操作一份数据。

**等待唤醒机制**（依赖同步机制实现）：

> wait()和notify()方法要在同步块中调用，因为调用者必须是同步监视器。

在一个线程满足某个条件时，就进入等待状态（`wait() / wait(time)`）， 等待其他线程执行完他们的指定代码过后再将其唤醒（`notify()`）;或可以指定wait的时间，等时间到了自动唤醒；

在有多个线程进行等待时，如果需要，可以使用 `notifyAll()`来唤醒所有的等待线程。wait/notify 就是线程间的一种协作机制。

线程被唤醒后不一定能立即恢复执行，因为它当初中断的地方是在同步块内，而此刻它已经不持有锁，所以它需要再次尝试去获取锁（很可能面临其它线程的竞争）。如果能获取锁，线程就从 WAITING 状态变成 RUNNABLE 状态；否则，变成 BLOCKED（等待锁）状态。

```java
synchronized (this) {
	notify();
	if (i <= 100) {
		System.out.println(Thread.currentThread().getName() + ":" + i++);
	} else
		break;
	try {
		wait();
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
}
```

**wait()/notify()使用**： 

- `wait()`:线程一旦执行此方法，就进入等待状态。同时，会释放对同步监视器的调用
- `notify()`:一旦执行此方法，就会唤醒被wait()的线程中优先级最高的那一个线程。（如果被wait()的多个线程的优先级相同，则随机唤醒一个）。被唤醒的线程从当初被wait的位置继续执行。
- `notifyAll()`:一旦执行此方法，就会唤醒所有被wait的线程。

1. wait方法与notify方法必须要由`同一个锁对象调用`。对应的锁对象可以通过notify唤醒使用同一个锁对象调用的wait方法后的线程。
2. wait()与notify()是属于Object类的方法的。锁对象可以是任意对象，而任意对象的所属类都是继承了Object类的。
3. wait()与notify()必须要在`同步代码块`或者是`同步函数`中使用，因为必须要通过锁对象调用这两个方法。否则会报java.lang.IllegalMonitorStateException异常。

**区分sleep()和wait()**

相同点：一旦执行，当前线程都会进入阻塞状态。

|           | sleep()         | wait()                              |
| --------- | --------------- | ----------------------------------- |
| 定义方法所属的类  | Thread中定义       | Object中定义                           |
| 使用范围      | 可以在任何需要使用的位置被调用 | 必须使用在同步代码块或同步方法中                    |
| 是否释放同步监视器 | 不会释放同步监视器       | 会释放同步监视器                            |
| 结束等待的方式   | 指定时间一到就结束阻塞     | 可以指定时间<br>也可以无限等待直到notify或notifyAll |

# 常用类和基础API

## String

String 类的声明

```java
public final class String implements java.io.Serializable, Comparable<String>, CharSequence
```

> final:String是不可被继承的
> Serializable:可序列化的接口。凡是实现此接口的类的对象就可以通过网络或本地流进行数据的传输。
> Comparable:凡是实现此接口的类，其对象都可以比较大小。

String 内部声明的属性

```java
//jdk8中：
//final : 指明此value数组一旦初始化，其地址就不可变。
private final char value[]; //存储字符串数据的容器

//jdk9开始：为了节省内存空间，做了优化
private final byte[] value; //存储字符串数据的容器。
```

String的不可变性：String 对象本身的内容不可变

1. 当对字符串变量重新赋值时，需要重新指定一个字符串常量的位置进行赋值，不能在原有的位置修改
2. 当对现有的字符串进行拼接操作时，需要重新开辟空间保存拼接以后的字符串，不能在原有的位置修改
3. 当调用字符串的replace()替换现有的某个字符时，需要重新开辟空间保存修改以后的字符串，不能在原有的位置修改

![String内存结构|700x0](https://vip.123pan.cn/1844935313/obsidian/20260208214003919.png)

String的连接操作 `+`

- 情况1：常量+常量 结果是常量池。且常量池中不会存在相同内容的常量。用 final 修饰的 String 也看作常量。
- 情况2：常量与变量 或 变量与变量 结果在堆中。
- 情况3：拼接后调用 intern 方法，结果在常量池中共享。
- 情况4：concat(xxx) 不管是常量调用此方法，还是变量调用，同样不管参数是常量还是变量，总之，调用完 concat() 方法都返回一个新new的对象。

```java
String s1 = "hello";
String s2 = "world";
String s3 = "hello" + "world";
String s4 = s1 + "world";
String s5 = s1 + s2;
String s6 = (s1 + s2).intern();

System.out.println(s3 == s4);  // false
System.out.println(s3 == s5);  // false
System.out.println(s4 == s5);  // false
System.out.println(s3 == s6);  // true
```

String与常见的其它结构之间的转换：

- String与基本数据类型之间的转换

```java
//基本数据类型 ---> String
String s1 = num + "";            //方式1
String s2 = String.valueOf(num); //方式2

//String --> 基本数据类型:调用包装类的parseXxx(String str)
String s3 = "123";
int i1 = Integer.parseInt(s3);
```

- String与`char[]`之间的转换

```java
String str = "hello";

//String -->char[]:调用String的toCharArray()
char[] arr = str.toCharArray();
for (int i = 0; i < arr.length; i++) {
	System.out.println(arr[i]);
}

//char[] ---> String:调用String的构造器
String str1 = new String(arr);
System.out.println(str1);
```

- String与`byte[]`之间的转换

```java
String str = new String("abc中国");

//String -->byte[]:调用String的getBytes()
byte[] arr = str.getBytes();   //使用默认的字符集:utf-8
for (int i = 0; i < arr.length; i++){
	System.out.println(arr[i]);
}

//byte[] ---> String:
String str1 = new String(arr); //使用默认的字符集：utf-8
System.out.println(str1);
```

String 方法：

1. `boolean isEmpty()`：字符串是否为空
2. `int length()`：返回字符串的长度
3. `String concat(xx)`：拼接
4. `boolean equals(Object obj)`：比较字符串是否相等，区分大小写。不区分大小写用`equalsIgnoreCase()` 。
5. `int compareTo(String other)`：比较字符串大小，区分大小写，按照Unicode编码值比较大小。不区分大小写用`compareToIgnoreCase()` 。
6. `String toLowerCase()`：将字符串中大写字母转为小写。小写字母转为大写用 `toUpperCase()` 。
7. `String trim()`：去掉字符串前后空白符
8. `public String intern()`：结果在常量池中共享
9. `boolean contains(xx)`：是否包含xx
10. `int indexOf(xx)`：从前往后找当前字符串中xx，即如果有返回第一次出现的下标，要是没有返回-1
	- `int indexOf(String str, int fromIndex)`：返回指定子字符串在此字符串中第一次出现处的索引，从指定的索引开始
	- `int lastIndexOf(xx)`：从后往前找当前字符串中xx，即如果有返回最后一次出现的下标，要是没有返回-1
	- `int lastIndexOf(String str, int fromIndex)`：返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索。
11. `String substring(int beginIndex)` ：返回一个新的字符串，它是此字符串的从beginIndex开始截取到最后的一个子字符串。
	- `String substring(int beginIndex, int endIndex)` ：返回一个新字符串，它是此字符串从beginIndex开始截取到endIndex(不包含)的一个子字符串。
12. `char charAt(index)`：返回 index 位置的字符
13. `char[] toCharArray()`： 将此字符串转换为一个新的字符数组返回
14. `static String valueOf(char[] data)` ：返回指定数组中表示该字符序列的 String
15. `static String copyValueOf(char[] data)`： 返回指定数组中表示该字符序列的 String
16. `boolean startsWith(xx)`：测试此字符串是否以指定的前缀开始
	- `boolean endsWith(xx)`：测试此字符串是否以指定的后缀结束
17. `String replace(char oldChar, char newChar)`：返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。 不支持正则。
	- `String replace(CharSequence target, CharSequence replacement)`：使用指定的字面值替换序列替换此字符串所有匹配字面值目标序列的子字符串。
18. `String replaceAll(String regex, String replacement)`：使用给定的 replacement 替换此字符串所有匹配给定的正则表达式的子字符串。
	- `String replaceFirst(String regex, String replacement)`：使用给定的 replacement 替换此字符串匹配给定的正则表达式的第一个子字符串。

## StringBuffer

因为String对象是不可变对象，虽然可以共享常量对象，但是对于频繁字符串的修改和拼接操作，效率极低，空间消耗也比较高。因此，JDK又在java.lang包提供了可变字符序列StringBuffer和StringBuilder类型。

区分String、StringBuffer、StringBuilder：

   - String:不可变的字符序列； 底层使用`char[]`数组存储(JDK8.0中)
   - StringBuffer:可变的字符序列；**线程安全**（方法有synchronized修饰），效率低
   - StringBuilder:可变的字符序列； jdk1.5引入，**线程不安全，效率高**

StringBuilder、StringBuffer的API是完全一致的，并且很多方法与String相同。它们都继承了 AbstractStringBuilder。

```txt
增：  
    append(xx)  
删：  
    delete(int start, int end)  
    deleteCharAt(int index)
改：  
    replace(int start, int end, String str)  
    setCharAt(int index, char c)
查：  
    charAt(int index)  
插：  
    insert(int index, xx)  
长度：  
    length()
```

> 如果开发中需要频繁的针对于字符串进行增、删、改等操作，建议使用StringBuffer或StringBuilder替换String。因为使用String效率低。
> 如果开发中，不涉及到线程安全问题，建议使用StringBuilder替换StringBuffer。因为使用StringBuilder效率高
> 如果开发中大体确定要操作的字符的个数，建议使用带 int capacity 参数的构造器。因为可以避免底层多次扩容操作，性能更高。

## Java比较器

Java实现对象排序的方式有两种：

   - 自然排序：java.lang.Comparable
   - 定制排序：java.util.Comparator

Comparable接口强行对实现它的每个类的对象进行整体排序。这种排序被称为类的自然排序。实现Comparable接口的对象列表（和数组）可以通过 Collections.sort 或 Arrays.sort 进行自动排序。实现此接口的对象可以用作有序映射中的键或有序集合中的元素，无需指定比较器。

```java
public interface Comparable {
    int compareTo(Object obj);
}
```

定制排序 java.util.Comparator 的由来：

- 当元素的类型没有实现 java.lang.Comparable 接口而又不方便修改代码（例如：一些第三方的类，你只有.class文件，没有源文件）
- 如果一个类，实现了Comparable接口，也指定了两个对象的比较大小的规则，但是此时此刻我不想按照它预定义的方法比较大小，但是我又不能随意修改，因为会影响其他地方的使用

JDK在设计类库之初，也考虑到这种情况，所以又增加了一个java.util.Comparator接口。强行对多个对象进行整体排序的比较。

- 重写`compare(Object o1,Object o2)`方法，比较o1和o2的大小
- 可以将 Comparator 传递给 sort 方法（如 Collections.sort 或 Arrays.sort），从而允许在排序顺序上实现精确控制。

```java
public interface Comparator{
    int compare(Object o1,Object o2);
}
```

对比两种方式：

|      | 角度一     | 角度二   | 角度三                                                      |
| ---- | ------- | ----- | -------------------------------------------------------- |
| 自然排序 | 单一的，唯一的 | 一劳永逸的 | 对应的接口是Comparable，对应的抽象方法compareTo(Object obj)            |
| 定制排序 | 灵活的，多样的 | 临时的   | 对应的接口是Comparator，对应的抽象方法compare(Object obj1,Object obj2) |

## 其他

1. System类

属性：out、in、err
方法：currentTimeMillis() / gc() / exit(int status) / getProperty(String property)

2. Runtime类

对应着Java进程的内存使用的运行时环境，是单例的

3. Math类

凡是与数学运算相关的操作，大家可以在此类中找相关的方法即可

4. BigInteger类和BigDecimal类

- BigInteger:可以表示任意长度的整数
- BigDecimal:可以表示任意精度的浮点数

5. Random类

获取指定范围的随机整数： nextInt(int bound)

# 集合框架

面向对象语言对事物的体现都是以对象的形式，为了方便对多个对象的操作，就要对对象进行存储。此时，可以考虑的容器有：数组、集合类。

数组存储多个数据方面的特点：

- 数组一旦初始化，其长度就是确定的。
- 数组中的多个元素是依次紧密排列的，有序的，可重复的
- (优点) 数组一旦初始化完成，其元素的类型就是确定的。不是此类型的元素，就不能添加到此数组中。
- (优点)元素的类型既可以是基本数据类型，也可以是引用数据类型。

数组存储多个数据方面的弊端：

- 数组一旦初始化，其长度就不可变了。
- 数组中存储数据特点的单一性。对于无序的、不可重复的场景的多个数据就无能为力了。
- 数组中可用的方法、属性都极少。具体的需求，都需要自己来组织相关的代码逻辑。
- 针对于数组中元素的删除、插入操作，性能较差。

Java集合框架体系（java.util包下）

```txt
java.util.Collection:存储一个一个的数据
    |-----子接口：List:存储有序的、可重复的数据 ("动态"数组)
           |---- ArrayList(主要实现类)、LinkedList、Vector

    |-----子接口：Set:存储无序的、不可重复的数据(高中学习的集合)
           |---- HashSet(主要实现类)、LinkedHashSet、TreeSet


java.util.Map:存储一对一对的数据(key-value键值对，(x1,y1)、(x2,y2) --> y=f(x),类似于高中的函数)
    |---- HashMap(主要实现类)、LinkedHashMap、TreeMap、Hashtable、Properties
```

## Collection接口

JDK不提供此接口的任何直接实现，而是提供更具体的子接口（如：Set和List）去实现。

Collection 接口是 List和Set接口的父接口，该接口里定义的方法既可用于操作 Set 集合，也可用于操作 List 集合。14个抽象方法如下：

- 添加
	1. `add(Object obj)`：添加元素对象到当前集合中
	2. `addAll(Collection coll)`：添加coll集合中的所有元素对象到当前集合中
- 判断
	1. `size()`：获取当前集合中实际存储的元素个数
	2. `isEmpty()`：判断当前集合是否为空集合
	3. `contains(Object obj)`：判断当前集合中是否存在一个与obj对象equals返回true的元素
	4. `containsAll(Collection coll)`：判断coll集合中的元素是否在当前集合中都存在。即coll集合是否是当前集合的“子集”
	5. `equals(Object obj)`：判断当前集合与obj是否相等
- 删除
	1. `clear()`：清空集合元素
	2. `remove(Object obj)`：从当前集合中删除第一个找到的与obj对象equals返回true的元素
	3. `removeAll(Collection coll)`：从当前集合中删除所有与coll集合中相同的元素
	4. `retainAll(Collection coll)`：从当前集合中删除两个集合中不同的元素，使得当前集合仅保留与coll集合中的元素相同的元素，即当前集合中仅保留两个集合的交集
- 其他
	1. `Object[] toArray()`：返回包含当前集合中所有元素的数组
	2. `hashCode()`：获取集合对象的哈希值
	3. `iterator()`：返回迭代器对象，用于集合遍历

> [!info] 向 Collection 中添加元素的要求：
> 要求元素所属的类一定要重写`equals()`!
> 原因：因为Collection中的相关方法（比如：contains() / remove()）在使用时，要调用元素所在类的equals()。

```java
//集合转换为数组：集合的toArray()方法
Object[] objects = coll.toArray();
System.out.println(Arrays.toString(objects));

//对应的，数组转换为集合：调用Arrays的asList(Object ...objs)
Object[] arr1 = new Object[]{123,"AA","CC"};
Collection list = Arrays.asList(arr1);
System.out.println(list);
```

## Iterator接口

`Iterator`接口也是Java集合中的一员，但它与`Collection`、`Map`接口有所不同。

- Collection接口与Map接口主要用于`存储`元素
- `Iterator`，被称为迭代器接口，本身并不提供存储对象的能力，主要用于`遍历`Collection中的元素

`Iterator`接口的常用方法如下：

- `public E next()`:返回迭代的下一个元素。
- `public boolean hasNext()`:如果仍有元素可以迭代，则返回 true。

如何实现遍历：

```java
Iterator iterator = coll.iterator();    //获取迭代器对象
while(iterator.hasNext()) {             //判断是否还有元素可迭代
	System.out.println(iterator.next());//取出下一个元素
}
```

foreach 循环（也称增强for循环）是 JDK5.0 中定义的一个高级for循环，专门用来`遍历数组和集合`的。针对于集合来讲，增强for循环的底层仍然使用的是迭代器。

增强for循环的执行过程中，是将集合或数组中的元素依次赋值给临时变量，注意，循环体中对临时变量的修改，可能不会导致原有集合或数组中元素的修改。

```java
// foreach循环的语法格式
for(元素的数据类型 局部变量 : Collection集合或数组){ 
  	//操作局部变量的输出操作
}
```

## Collection子接口：List

鉴于Java中数组用来存储数据的局限性，我们通常使用`java.util.List`替代数组。List集合类中`元素有序`、且`可重复`，集合中的每个元素都有其对应的顺序索引。

List除了从Collection集合继承的方法外，List 集合里添加了一些`根据索引`来操作集合元素的方法。

- 增
	1. add(Object obj)
	2. addAll(Collection coll)
- 删
	1. remove(Object obj)
	2. `remove(int index)`：移除指定index位置的元素，并返回此元素
- 改
	1. `set(int index, Object ele)`：设置指定index位置的元素为ele
- 查
	1. `get(int index)`：获取指定index位置的元素
	2. `List subList(int fromIndex, int toIndex)`:返回从fromIndex到toIndex位置的子集合
- 插
	1. `add(int index, Object ele)`：在index位置插入ele元素
	2. `addAll(int index, Collection eles)`：从index位置开始将eles中的所有元素添加进来
- 长度
	1. size()
- 遍历
	1. iterator() ：使用迭代器进行遍历
	2. 增强for循环
	3. 一般的for循环

List及其实现类特点：

```txt
java.util.Collection:存储一个一个的数据
    |-----子接口：List:存储有序的、可重复的数据 ("动态"数组)
           |---- ArrayList:List的主要实现类；线程不安全的、效率高；底层使用Object[]数组存储
                           在添加数据、查找数据时，效率较高；在插入、删除数据时，效率较低
           |---- LinkedList:底层使用`双向链表`的方式进行存储；在对集合中的数据进行频繁的删
				           除、插入操作时，建议使用此类
                           在插入、删除数据时，效率较高；在添加数据、查找数据时，效率较低；
           |---- Vector:List的古老实现类；线程安全的、效率低；底层使用Object[]数组存储
```

## Collection子接口：Set

Set接口是Collection的子接口，Set 集合不允许包含相同的元素，如果把两个相同的元素加入同一个 Set 集合中，则添加操作失败。

Set接口相较于Collection接口没有提供额外的方法。

> [!info] 向 Set 中添加元素的要求：
> - HashSet/LinkedHashSet 要求元素所属的类一定要重写 `equals()` 和 `hashCode()`，实现对象相等规则。即：“相等的对象必须具有相等的散列码”。
> - TreeSet 要求元素必须是同一个类型的对象，否则会报ClassCastException。因为只有相同类的两个实例才能比较大小。
> - TreeSet 添加的元素需要考虑排序：① 自然排序 ② 定制排序。TreeSet 判断数据是否相同的标准，不再是考虑hashCode()和equals()方法，而是考虑自然排序或定制排序中，compareTo()或compare()的返回值。 

Set及其实现类特点：

```txt
java.util.Collection:存储一个一个的数据
    |-----子接口：Set:存储无序的、不可重复的数据(高中学习的集合)
           |---- HashSet：主要实现类；底层使用的是HashMap，即使用`数组+单向链表+红黑树`结构
				           进行存储。（jdk8中）
                |---- LinkedHashSet：是HashSet的子类；在现有的数组+单向链表+红黑树结构的基
					                础上，使用`双向链表`维护元素的次序，这使得元素看起来是
					                以`添加顺序`保存的。
           |---- TreeSet：底层使用`红黑树`存储。可以按照添加的元素的指定的属性的大小顺序进行
				          遍历。
```

HashSet 是 Set 接口的主要实现类，大多数时候使用 Set 集合时都使用这个实现类。HashSet 具有以下特点：

- 不能保证元素的排列顺序
- HashSet 不是线程安全的
- 集合元素可以是 null

HashSet集合中元素的`无序性 != 随机性`。这里的无序性**与元素的添加位置有关**。具体来说：我们在添加每一个元素到数组中时，具体的存储位置是由元素的`hashCode()`调用后返回的`hash值`决定的。导致在数组中每个元素不是依次紧密存放的，表现出一定的无序性。

## Map接口

有这样的一类集合：用户ID与账户信息、学生姓名与考试成绩、IP地址与主机名等，这种一一对应的关系，就称作映射。Java提供了专门的集合框架用来存储这种映射关系的对象，即 `java.util.Map` 接口。

Map接口的常用实现类：`HashMap`、`LinkedHashMap`、`TreeMap` 和 `Properties`。其中，HashMap是 Map 接口使用频率最高的实现类。

- 增：
	1. `put(Object key,Object value)`：将指定key-value添加到(或修改)当前map对象中
	2. `putAll(Map m)`：将m中的所有key-value对存放到当前map中
- 删：
	1. `Object remove(Object key)`：移除指定key的key-value对，并返回value
	2. `void clear()`：清空当前map中的所有数据
- 改：
	1. `put(Object key,Object value)`
	2. `putAll(Map m)`
- 查：
	1. `Object get(Object key)`：获取指定key对应的value
- 长度：
	1. `size()`：返回map中key-value对的个数
- 遍历：
	1. 遍历key集 `Set keySet()`：返回所有key构成的Set集合
	2. 遍历value集 `Collection values()`：返回所有value构成的Collection集合
	3. 遍历entry集 `Set entrySet()`：返回所有key-value对构成的Set集合

Map及其实现类特点：

```txt
java.util.Map:存储一对一对的数据(key-value键值对，(x1,y1)、(x2,y2) --> y=f(x),类似于高中的函数)
    |---- HashMap:主要实现类;线程不安全的，效率高;可以添加null的key和value值;底层使用数组+单
				  向链表+红黑树结构存储（jdk8）
        |---- LinkedHashMap:是HashMap的子类；在HashMap使用的数据结构的基础上，增加了一对双
					        向链表，用于记录添加的元素的先后顺序，进而我们在遍历元素时，就可
					        以按照添加的顺序显示。开发中，对于频繁的遍历操作，建议使用此类。
    |---- TreeMap:底层使用红黑树存储;可以按照添加的 key-value 中的key元素的指定的属性的大小
			      顺序进行遍历。需要考虑使用①自然排序 ②定制排序。
    |---- Hashtable:古老实现类;线程安全的，效率低;不可以添加null的key或value值;底层使用数组
				    +单向链表结构存储（jdk8）
        |---- Properties:其 key 和 value 都是 String 类型。常用来处理属性文件。
```

> HashSet 的底层实现是 HashMap，TreeSet 的底层实现是 TreeMap。所以接下来的 HashSet、TreeSet的特点会和前面的 Set 很相似。

HashMap中元素的特点：

- HashMap 中的所有的 `key` 彼此之间是不可重复的、无序的。所有的 key 就构成一个 `Set 集合` ---> key所在的类要重写`hashCode()`和`equals()`。
- HashMap 中的所有的 `value` 彼此之间是可重复的、无序的。所有的 value 就构成一个 `Collection 集合` ---> value所在的类要重写`equals()`。
- HashMap中的一个 `key-value`,就构成了一个 `entry`。
- HashMap中的所有的 entry 彼此之间是不可重复的、无序的。所有的 entry 就构成了一个 Set 集合。

TreeMap中元素的特点：

- TreeMap存储 key-value 对时，需要根据 key-value 对进行排序。TreeMap 可以保证所有的 key-value 对处于`有序状态`。
- TreeMap 的 `Key` 的排序
    - `自然排序`：TreeMap 的所有的 Key 必须实现 Comparable 接口，而且所有的 Key 应该是同一个类的对象，否则将会抛出 ClasssCastException
    - `定制排序`：创建 TreeMap 时，构造器传入一个 Comparator 对象，该对象负责对 TreeMap 中的所有 key 进行排序。此时不需要 Map 的 Key 实现 Comparable 接口
- TreeMap判断`两个key相等的标准`：两个key通过compareTo()方法或者compare()方法返回0。

## Collections工具类

参考操作数组的工具类 Arrays，Collections 是一个操作 Set、List 和 Map 等集合的工具类。

**常用方法**：

- 排序操作
	- `reverse(List)`：反转 List 中元素的顺序
	- `shuffle(List)`：对 List 集合元素进行随机排序
	- `sort(List)`：根据元素的自然顺序对指定 List 集合元素按升序排序。`sort(List，Comparator)`：根据指定的 Comparator 产生的顺序对 List 集合元素进行排序
	- `swap(List，int， int)`：将指定 list 集合中的 i 处元素和 j 处元素进行交换
- 查找
	- `Object max(Collection)`：根据元素的自然顺序，返回给定集合中的最大元素。可以使用 Comparator 指定顺序
	- `Object min(Collection)`：根据元素的自然顺序，返回给定集合中的最小元素。可以使用 Comparator 指定顺序
	- `int binarySearch(List list,T key)` 在List集合中查找某个元素的下标，但是 List 的元素必须是T或T的子类对象，而且必须是可比较大小的，即支持自然排序的。而且集合也事先必须是有序的，否则结果不确定。
	- `int binarySearch(List list,T key,Comparator c)`在List集合中查找某个元素的下标，但是List的元素必须是T或T的子类对象，而且集合也事先必须是按照c比较器规则进行排序过的，否则结果不确定。
	- `int frequency(Collection c，Object o)`：返回指定集合中指定元素的出现次数
- 复制、替换
	- `void copy(List dest,List src)`：将src中的内容复制到dest中
	- `boolean replaceAll(List list，Object oldVal，Object newVal)`：使用新值替换 List 对象的所有旧值
	- 提供了多个`unmodifiableXxx()`方法，该方法返回指定 Xxx的不可修改的视图。
- 添加
	- `boolean addAll(Collection  c,T... elements)`将所有指定元素添加到指定 collection 中。
- 同步
	- Collections 类中提供了多个 `synchronizedXxx()` 方法，该方法可使将指定集合包装成线程同步的集合，从而可以解决多线程并发访问集合时的线程安全问题

> [!info] 区分Collection 和 Collections
> Collection：集合框架中的用于存储一个一个元素的接口，又分为 List 和 Set 等子接口。
> Collections：用于操作集合框架的一个工具类。此时的集合框架包括：Set、List、Map

# 泛型

所谓泛型，就是允许在定义类、接口时通过一个`标识`表示类中某个`属性的类型`或者是某个方法的
`返回值或参数的类型`。这个类型参数将在使用时（例如，继承或实现这个接口、创建对象或调用方法时）确定。

`<类型>`的形式我们称为类型参数，这里的"类型"习惯上使用T表示，是Type的缩写。`<T>` 代表未知的数据类型，我们可以指定为`<String>`，`<Integer>`，`<Circle>`等。类比方法的参数的概念，把 `<T>` 称为类型形参，将 `<Circle>` 称为类型实参。

## 自定义泛型

自定义泛型类\接口

```java
class A<T> {

}

interface B<T1,T2> {
}
```

使用说明：

1. 在声明完自定义泛型类以后，可以在类的内部（比如属性、方法、构造器中）使用类的泛型。
2. 我们在创建自定义泛型类的对象时，可以指明泛型参数类型。一旦指明，内部凡是使用类的泛型参数的位置，都具体化为指定的类的泛型类型。
3. 如果在创建自定义泛型类的对象时，没有指明泛型参数类型，那么泛型将被擦除，泛型对应的类型均按照Object处理，但不等价于Object。
	- 经验：泛型要使用一路都用。要不用，一路都不要用。
4. 泛型的指定中必须使用引用数据类型。不能使用基本数据类型，此时只能使用包装类替换。
5. 除创建泛型类对象外，子类继承泛型类时、实现类实现泛型接口时，也可以确定泛型结构中的泛型参数。

自定义泛型方法

```java
权限修饰符 <T> 返回值类型 方法名(形参列表){  //通常在形参列表或返回值类型的位置会出现泛型参数T
}

public <E> E method(E e){
}
```

使用说明：

1. 声明泛型方法时，一定要添加泛型参数`<T>`
2. 泛型参数在方法调用时，指明其具体的类型
3. 泛型方法可以根据需要声明为static的
4. 泛型方法所属的类是否是一个泛型类，都可以。

## 泛型在继承上的体现

```
1. 类SuperA是类A的父类，则 G<SuperA> 与 G<A>的关系：
   G<SuperA> 和 G<A>是并列的两个类，没有任何子父类的关系。  
   比如：ArrayList<Object> 、ArrayList<String>没有关系  
​  
2. 类SuperA是类A的父类或接口，SuperA<G> 与 A<G>的关系：
   SuperA<G> 与A<G> 有继承或实现的关系。即A<G>的实例可以赋值给SuperA<G>类型的引用（或变量）
   比如：List<String> 与 ArrayList<String>
```

## 通配符的使用

- ? 的使用
    - 以集合为例：可以读取数据、不能写入数据（例外：null）
- ? extends A
    - 以集合为例：可以读取数据、不能写入数据（例外：null）
- ? super A
    - 以集合为例：可以读取数据、可以写入A类型或A类型子类的数据（例外：null）

# 数据结构与集合源码

## 数据结构

数据结构，就是一种程序设计优化的方法论，研究数据的`逻辑结构`和`物理结构`以及它们之间相互关系，并对这种结构定义相应的`运算`，目的是加快程序的执行速度、减少内存占用的空间。

数据结构的研究对象1：数据之间的逻辑关系

- 集合结构：数据结构中的元素之间除了“`同属一个集合`” 的相互关系外，别无其他关系
- 线性结构：一对一关系。结构中必须存在唯一的首元素和唯一的尾元素
- 树形结构：一对多关系
- 图形结构：多对多关系

数据结构的研究对象2：数据的存储结构（或物理结构）

- 顺序结构：使用一组连续的存储单元依次存储逻辑上相邻的各个元素
- 链式结构：不使用连续的存储空间存放结构的元素，而是为每一个元素构造一个节点。节点中除了存放数据本身以外，还需要存放指向下一个节点的指针
- 索引结构：除建立存储节点信息外，还建立附加的`索引表`来记录每个元素节点的地址。索引表由若干索引项组成。索引项的一般形式是：(关键字，地址)
- 散列结构：根据元素的关键字直接计算出该元素的存储地址，又称为Hash存储

> [!info] 开发中，更习惯上如下的方式理解存储结构
> - 线性表(一对一关系): 一维数组、单向链表、双向链表、栈、队列
> - 树(一对多关系):各种树。比如：二叉树、B+树
> - 图(多对多关系)
> - 哈希表：比如：HashMap、HashSet

数据结构的研究对象3：相关的算法操作

- 分配资源，建立结构，释放资源
- 插入和删除
- 获取和遍历
- 修改和排序

## List实现类源码分析

### ArrayList

ArrayList的特点：

- 实现了List接口，存储有序的、可以重复的数据
- 底层使用`Object[]`数组存储
- **线程不安全**的

ArrayList源码解析，jdk7版本(以jdk1.7.0_07为例)

```java
//如下代码的执行：底层会初始化数组，数组的长度为10。Object[] elementData = new Object[10];
ArrayList<String> list = new ArrayList<>();

list.add("AA"); //elementData[0] = "AA";
list.add("BB"); //elementData[1] = "BB";
```

> 当要添加第11个元素的时候，底层的elementData数组已满，则需要扩容。默认扩容为原来长度的`1.5倍`。并将原有数组中的元素复制到新的数组中。

ArrayList源码解析，jdk8版本(以jdk1.8.0_271为例)

```java
//如下代码的执行：底层会初始化数组，即：Object[] elementData = new Object[]{};
ArrayList<String> list = new ArrayList<>();

list.add("AA"); //首次添加元素时，会初始化数组elementData = new Object[10];elementData[0] = "AA";
list.add("BB"); //elementData[1] = "BB";
```

> 当要添加第11个元素的时候，底层的elementData数组已满，则需要扩容。默认扩容为原来长度的`1.5倍`。并将原有数组中的元素复制到新的数组中。

> [!info] 小结
> jdk1.7.0_07版本中：ArrayList类似于饿汉式
> jdk1.8.0_271版本中：ArrayList类似于懒汉式

### Vector

Vector的特点：

- 实现了List接口，存储有序的、可以重复的数据
- 底层使用`Object[]`数组存储
- **线程安全**的

Vector源码解析(以jdk1.8.0_271为例)

```java
Vector v = new Vector(); //底层初始化数组，长度为10.Object[] elementData = new Object[10];
v.add("AA"); //elementData[0] = "AA";
v.add("BB"); //elementData[1] = "BB";
```

> 当添加第11个元素时，需要扩容。默认扩容为原来的`2倍`。

### LinkedList

LinkedList的特点：

- 实现了List接口，存储有序的、可以重复的数据
- 底层使用**双向链表存储**
- 线程不安全的

LinkedList在jdk8中的源码解析：

```java
LinkedList<String> list = new LinkedList<>(); //底层也没做啥
list.add("AA"); //将"AA"封装到一个Node对象1中，list对象的属性first、last都指向此Node对象1。
list.add("BB"); //将"BB"封装到一个Node对象2中，对象1和对象2构成一个双向链表，同时last指向此Node对象2
```

因为LinkedList使用的是双向链表，不需要考虑扩容问题。

LinkedList内部声明：

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
}
```

> [!info] 启示与开发建议
> 1. Vector基本不使用了。
> 2. ArrayList底层使用数组结构，查找和添加（尾部添加）操作效率高，时间复杂度为O(1)。删除和插入操作效率低，时间复杂度为O(n)
>    LinkedList底层使用双向链表结构，删除和插入操作效率高，时间复杂度为O(1)。查找和添加（尾部添加）操作效率高，时间复杂度为O(n) (有可能添加操作是O(1))
> 3. 在选择了ArrayList的前提下，
> new ArrayList() : 底层创建长度为10的数组。
> new ArrayList(int capacity):底层创建指定capacity长度的数组。
> 如果开发中，大体确认数组的长度，则推荐使用ArrayList(int capacity)这个构造器，避免了底层的扩容、复制数组的操作。

## Map实现类源码分析

### HashMap

HashMap 和 Hashtable底层都是哈希表，其中维护了一个长度为**2的幂次方**的 Entry 类型的数组 table，数组的每一个索引位置被称为一个桶(bucket)，你添加的映射关系(key,value)最终都被封装为一个 Map.Entry 类型的对象，放到某个`table[index]`桶中。

![jdk8中HashMap结构](https://vip.123pan.cn/1844935313/obsidian/20260307151332753.png)

HashMap源码解析，jdk7中创建对象和添加数据过程(以JDK1.7.0_07为例说明)：

```java
//创建对象的过程中，底层会初始化数组Entry[] table = new Entry[16];
HashMap<String,Integer> map = new HashMap<>();

map.put("AA",78); //"AA"和78封装到一个Entry对象中，考虑将此对象添加到table数组中。
```

jdk7中 HashMap进行添加/修改的过程：

```txt
将(key1,value1)添加到当前的map中：
首先，需要调用key1所在类的hashCode()方法，计算key1对应的哈希值1，此哈希值1经过某种算法(hash())之后，得到哈希值2。
哈希值2再经过某种算法(indexFor())之后，就确定了(key1,value1)在数组table中的索引位置i。
	1.1 如果此索引位置i的数组上没有元素，则(key1,value1)添加成功。  ---->情况1
	1.2 如果此索引位置i的数组上有元素(key2,value2),则需要继续比较key1和key2的哈希值2  --->哈希冲突
		2.1 如果key1的哈希值2与key2的哈希值2不相同，则(key1,value1)添加成功。   ---->情况2
		2.2 如果key1的哈希值2与key2的哈希值2相同，则需要继续比较key1和key2的equals()。要调用key1所在类的equals(),将key2作为参数传递进去。
			3.1 调用equals()，返回false: 则(key1,value1)添加成功。   ---->情况3
			3.2 调用equals()，返回true: 则认为key1和key2是相同的。默认情况下，value1替换原有的value2。
```

说明：

- 情况1：将(key1,value1)存放到数组的索引i的位置
- 情况2,情况3：(key1,value1)元素与现有的(key2,value2)构成单向链表结构，(key1,value1)指向(key2,value2)，即头插法入链
- 随着不断的添加元素，在满足条件 `(size >= threshold) && (null != table[i])` 的情况下，会考虑扩容。
	- 具体来说，当元素的个数达到临界值(数组的长度 * 加载因子)时，就考虑扩容。默认的临界值 = 16 * 0.75，默认扩容为原来的2倍。

jdk8与jdk7中 HashMap 的不同之处(以jdk1.8.0_271为例)：

1. 在jdk8中，当我们创建了HashMap实例以后，底层并没有初始化table数组。当首次添加(key,value)时，进行判断，如果发现table尚未初始化，则对数组进行初始化。类似**懒汉式**
2. jdk8中添加的key,value封装到了`HashMap.Node`类的对象中。而非jdk7中的`HashMap.Entry`
3. 如果当前的(key,value)经过一系列判断之后，可以添加到当前的数组角标i中。如果此时角标i位置上有元素。在jdk7中是将新的(key,value)指向已有的旧的元素（`头插法`），而在jdk8中是`尾插法`
4. jdk7:数组+单向链表
   jdk8:数组+单向链表 + 红黑树

> [!info] 什么时候会使用单向链表变为红黑树
> 如果数组索引i位置上的元素的个数达到`8`，并且数组的长度达到`64`时，我们就将此索引i位置上的多个元素改为使用红黑树的结构进行存储。
> 为什么修改呢？红黑树进行put()/get()/remove() 操作的时间复杂度为O(logn)，比单向链表的时间复杂度O(n)的好。性能更高。

> [!info] 什么时候会使用红黑树变为单向链表
> 当使用红黑树的索引i位置上的元素的个数低于`6`的时候，就会将红黑树结构退化为单向链表。

HashMap 的属性/字段：

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // 默认的初始容量 16
static final int MAXIMUM_CAPACITY = 1 << 30; //最大容量  1 << 30
static final float DEFAULT_LOAD_FACTOR = 0.75f;  //默认加载因子
static final int TREEIFY_THRESHOLD = 8; //默认树化阈值8，当链表的长度达到这个值后，要考虑树化
static final int UNTREEIFY_THRESHOLD = 6;//默认反树化阈值6，当树中结点的个数达到此阈值后，要考虑变为链表

//当单个的链表的结点个数达到8，并且table的长度达到64，才会树化。
//当单个的链表的结点个数达到8，但是table的长度未达到64，会先扩容
static final int MIN_TREEIFY_CAPACITY = 64; //最小树化容量64

transient Node<K,V>[] table; //数组
transient int size;  //记录有效映射关系的对数，也是Entry对象的个数
int threshold; //阈值，当size达到阈值时，考虑扩容
final float loadFactor; //加载因子，影响扩容的频率
```

### LinkedHashMap

LinkedHashMap 与 HashMap 的关系:

- LinkedHashMap 是 HashMap 的子类。
- LinkedHashMap 在 HashMap 使用的数组+单向链表+红黑树的基础上，又增加了一对双向链表，记录添加的 (key, value) 的先后顺序。便于我们遍历所有的 key-value。

LinkedHashMap重写了HashMap的如下方法：

```java
Node<K,V> newNode(int hash, K key, V value, Node<K,V> e) {
    LinkedHashMap.Entry<K,V> p = new LinkedHashMap.Entry<K,V>(hash, key, value, e);
    linkNodeLast(p);
    return p;
}
```

底层结构：LinkedHashMap内部定义了一个Entry

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after; //增加的一对双向链表
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

# File类与IO流

## File类

File类及本章下的各种流，都定义在java.io包下。

- 一个File对象，代表硬盘或网络中可能存在的一个文件或者目录。（万事万物皆对象）
- File 能新建、删除、重命名文件和目录，但 File 不能访问文件内容本身。如果需要访问文件内容本身，则需要使用输入/输出流。
	- File类的对象，通常是作为io流操作的文件的端点出现的。
    - File对象可以作为参数传递给流的构造器。
- 想要在Java程序中表示一个真实存在的文件或目录，那么必须有一个File对象，但是无论该路径下是否存在文件或者目录，都不影响File对象的创建。

**内部api使用说明**：

1 构造器

- `public File(String pathname)`：以 pathname 为路径创建File对象，可以是绝对路径或者相对路径，如果pathname是相对路径，则默认的当前路径在系统属性 user.dir 中存储。
- `public File(String parent, String child)`：以 parent 为父路径，child 为子路径创建File对象。
- `public File(File parent, String child)`：根据一个父File对象和子文件路径创建File对象

2 方法

获取文件和目录基本信息
- `public String getName()`：获取名称
- `public String getPath()`：获取路径
- `public String getAbsolutePath()`：获取绝对路径
- `public File getAbsoluteFile()`：获取绝对路径表示的文件
- `public String getParent()`：获取上层文件目录路径。若无，返回null
- `public long length()`：获取文件长度（即，字节数）。不能获取目录的长度。
- public long lastModified() ：获取最后一次的修改时间，毫秒值

列出目录的下一级
- `public String[] list()` ：返回一个String数组，表示该File目录中的所有子文件或目录。
- `public File[] listFiles()` ：返回一个File数组，表示该File目录中的所有的子文件或目录。

File类的重命名功能
- `public boolean renameTo(File dest)`: 把文件重命名为指定的文件路径。

判断功能的方法
- `public boolean exists()` ：此File表示的文件或目录是否实际存在。
- `public boolean isDirectory()` ：此File表示的是否为目录。
- `public boolean isFile()` ：此File表示的是否为文件。
- public boolean canRead() ：判断是否可读
- public boolean canWrite() ：判断是否可写
- public boolean isHidden() ：判断是否隐藏

创建、删除功能
- `public boolean createNewFile()` ：创建文件。若文件存在，则不创建，返回false。
- `public boolean mkdir()` ：创建文件目录。如果此文件目录存在，就不创建了。如果此文件目录的上层目录不存在，也不创建。
- `public boolean mkdirs()` ：创建文件目录。如果上层文件目录不存在，一并创建。
- `public boolean delete()` ：删除文件或者文件夹。删除注意事项：① Java中的删除不走回收站。② 要删除一个文件目录，该文件目录内不能包含文件或者文件目录。

> 在IDEA中，如果使用单元测试方法，相对路径相对于当前的 module 来讲；如果使用main()方法，相对路径相对于当前的 project 来讲。

## IO流

Java程序中，对于数据的输入/输出操作以“`流(stream)`” 的方式进行，可以看做是一种数据的流动。java.io包下提供了各种“流”类和接口，用以获取不同种类的数据，并通过`标准的方法`输入或输出数据。

- 按数据的流向不同分为：**输入流**和**输出流**。
	- **输入流** ：把数据从`其他设备`上读取到`内存`中的流。 
	- **输出流** ：把数据从`内存` 中写出到`其他设备`上的流。
- 按操作数据单位的不同分为：**字节流**和**字符流**。
	- **字节流** ：以字节为单位，读写数据的流。
	- **字符流** ：以字符为单位，读写数据的流。
- 根据IO流的角色不同分为：**节点流**和**处理流**。
	- **节点流**：直接从数据源或目的地读写数据
	- **处理流**：不直接连接到数据源或目的地，而是“连接”在已存在的流（节点流或处理流）之上，通过对数据的处理为程序提供更为强大的读写功能。

![IO流分类|650x0](https://vip.123pan.cn/1844935313/obsidian/20260308191635034.png)

Java的IO流共涉及40多个类，它们都是从如下4个抽象基类派生的。

![](https://vip.123pan.cn/1844935313/obsidian/20260308192519585.png)

| 抽象基类         | 4个节点流 (也称为文件流)   |
| ------------ | ---------------- |
| InputStream  | FileInputStream  |
| OutputStream | FileOutputStream |
| Reader       | FileReader       |
| Writer       | FileWriter       |

**常用的节点流：** 　

- 文件流： FileInputStream、FileOutputStrean、FileReader、FileWriter
- 字节/字符数组流： ByteArrayInputStream、ByteArrayOutputStream、CharArrayReader、CharArrayWriter
    - 对数组进行处理的节点流（对应的不再是文件，而是内存中的一个数组）。

**常用处理流：**

- 缓冲流：BufferedInputStream、BufferedOutputStream、BufferedReader、BufferedWriter
    - 作用：增加缓冲功能，避免频繁读写硬盘，进而提升读写效率。
- 转换流：InputStreamReader、OutputStreamReader
    - 作用：实现字节流和字符流之间的转换。
- 对象流：ObjectInputStream、ObjectOutputStream
    - 作用：提供直接读写Java对象功能

### FileReader \ FileWriter

`java.io.FileReader`类用于读取字符文件，构造时使用系统默认的字符编码和默认字节缓冲区。

执行步骤：

```txt
第1步：创建读取或写出的File类的对象
第2步：创建输入流或输出流
第3步：具体的读入或写出的过程。
     读入：read(char[] cbuffer)
     写出：write(String str) / write(char[] cbuffer,0,len)
第4步：关闭流资源，避免内存泄漏
```

注意点：

1. 因为涉及到流资源的关闭操作，所以出现异常的话，需要使用`try-catch-finally`的方式来处理异常
2. 对于输入流来讲，要求File类的对象对应的物理磁盘上的文件必须存在。否则，会报FileNotFoundException。
3. 对于输出流来讲，File类的对象对应的物理磁盘上的文件可以不存在。
	- 如果此文件不存在，则在输出的过程中，会自动创建此文件，并写出数据到此文件中。
	- 如果此文件存在，使用 FileWriter(File file) 或 FileWriter(File file,false)：输出数据过程中，会新建同名的文件对现有的文件进行`覆盖`。FileWriter(File file,true) : 输出数据过程中，会在现有的文件的末尾`追加`写出内容。

> [!info] 关于flush（刷新）
> 因为内置缓冲区的原因，如果FileWriter不关闭输出流，无法写出字符到文件中。但是关闭的流对象，是无法继续写出数据的。如果我们既想写出数据，又想继续使用流，就需要用到`flush()` 方法。
> - `flush()` ：刷新缓冲区，流对象可以继续使用。
> - `close()` ：先刷新缓冲区，然后通知系统释放资源。流对象不可以再被使用了。

### FileInputStream \ FileOutputStream

如果我们读取或写出的数据是非文本文件，则Reader、Writer就无能为力了，必须使用字节流。`java.io.InputStream`抽象类是表示字节输入流的所有类的超类，可以读取字节信息到内存中。

执行步骤：

```txt
第1步：创建读取或写出的File类的对象
第2步：创建输入流或输出流
第3步：具体的读入或写出的过程。
     读入：read(byte[] buffer)
     写出：write(byte[] buffer,0,len)
第4步：关闭流资源，避免内存泄漏
```

在 FileReader / FIleWriter 注意点的基础之上，看其他的注意点：

- 对于字符流，只能用来操作文本文件，不能用来处理非文本文件的。
- 对于字节流，通常是用来处理非文本文件的。但是，如果涉及到文本文件的复制操作，也可以使用字节流。

### 缓冲流

为了提高数据读写的速度，Java API提供了带缓冲功能的流类：缓冲流。

缓冲流的基本原理：在创建流对象时，内部会创建一个缓冲区数组（缺省使用 8192个字节(8Kb) 的缓冲区），通过缓冲区读写，减少系统IO次数，从而提高读写的效率。

| 抽象基类         | 4个节点流 (也称为文件流)   | 4个缓冲流（处理流的一种）        |
| ------------ | ---------------- | -------------------- |
| InputStream  | FileInputStream  | BufferedInputStream  |
| OutputStream | FileOutputStream | BufferedOutputStream |
| Reader       | FileReader       | BufferedReader       |
| Writer       | FileWriter       | BufferedWriter       |

缓冲流要“套接”在相应的节点流之上，根据数据操作单位可以把缓冲流分为：

- 字节缓冲流
	- BufferedInputStream：`read(byte[] buffer)`
	- BufferedOutputStream：`write(byte[] buffer,0,len)` 、flush()
- 字符缓冲流
	- BufferedReader：`read(char[] cBuffer)` / `String readLine()` （读一行文字）
	- BufferedWriter：`write(char[] cBuffer,0,len)` / `write(String str)`  、flush()

实现的步骤：

```txt
第1步：创建File的对象、流的对象（包括文件流、缓冲流）
第2步：使用缓冲流实现 读取数据 或 写出数据的过程（重点）
    读取：int read(char[] cbuf/byte[] buffer) 每次将数据读入到cbuf/buffer数组中，并返回读入到数组中的字符的个数
    写出：void write(String str)/write(char[] cbuf) 将str或cbuf写出到文件中
         void write(byte[] buffer) 将byte[]写出到文件中
第3步：关闭资源
```

### 转换流

如果希望程序在读取文本文件时，不出现乱码，需要注意什么？ 解码时使用的字符集必须与当初编码时使用的字符集得相同。


转换流API:

- InputStreamReader: 将一个输入型的字节流转换为输入型的字符流。
- OutputStreamWriter: 将一个输出型的字符流转换为输出型的字节流。

![转换流是字节与字符间的桥梁|650x0](https://vip.123pan.cn/1844935313/obsidian/20260309141200143.png)

### 数据流、对象流

如果需要将内存中定义的变量（包括基本数据类型或引用数据类型）保存在文件中，那怎么办呢？Java提供了数据流和对象流来处理这些类型的数据。

**数据流：DataOutputStream、DataInputStream**

- DataOutputStream：将内存中的基本数据类型、String类型的变量写入具体的文件中。
- DataInputStream：将文件中保存的数据还原为内存中的基本数据类型、String类型的变量。

DataInputStream中的方法：

```txt
  byte readByte()                short readShort()  
  int readInt()                  long readLong()  
  float readFloat()              double readDouble()  
  char readChar()                boolean readBoolean()                    
  String readUTF()               void readFully(byte[] b)
```

DataOutputStream中的方法：将上述的方法的read改为相应的write即可。

数据流的弊端：只支持Java基本数据类型和字符串的读写，而不支持其它Java对象的类型。而对象流ObjectOutputStream 和 ObjectInputStream 既支持Java基本数据类型的数据读写，又支持Java对象的读写

**对象流：ObjectOutputStream、ObjectInputStream**

- ObjectOutputStream：将 Java 基本数据类型和对象写入字节输出流中。
- ObjectInputStream：ObjectInputStream 对以前使用 ObjectOutputStream 写出的基本数据类型的数据和对象进行读入操作，保存在内存中。

> [!info] 对象序列化机制
> 对象序列化机制，允许把内存中的Java对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。
> 当其它程序获取了这种二进制流，就可以恢复成原来的Java对象。
> - 序列化过程：使用ObjectOutputStream流实现。将内存中的Java对象保存在文件中或通过网络传输出去 `public final void writeObject (Object obj)`
> - 反序列化过程：使用ObjectInputSteam流实现。将文件中的数据或网络传输过来的数据还原为内存中的Java对象 `public final Object readObject()`
>
> 序列化的好处，在于可将任何实现了 Serializable 接口的对象转化为**字节数据**，使其在保存和传输时可被还原。

**如何实现序列化机制**：

- 如果需要让某个对象支持序列化机制，则必须让对象所属的类及其属性是可序列化的，
- 如果对象的某个属性也是引用数据类型，那么如果该属性也要序列化的话，也要实现`Serializable` 接口
- 如果有一个属性不需要可序列化的（比如密码），则该属性必须注明是瞬态的，使用`transient` 关键字修饰。
- `静态（static）变量`的值不会序列化。因为静态变量的值不属于某个对象。

**反序列化失败问题**：当JVM反序列化对象时，能找到class文件，但是class文件在序列化对象之后发生了修改，那么反序列化操作会失败，抛出一个`InvalidClassException`异常。发生这个异常的原因如下：

- 该类的序列版本号与从流中读取的类描述符的版本号不匹配
- 该类包含未知数据类型

解决办法：`Serializable` 接口给需要序列化的类，提供了一个序列版本号：`serialVersionUID` 。凡是实现 Serializable接口的类都应该有一个表示序列化版本标识符的静态变量。

```java
// serialVersionUID用来表明类的不同版本间的兼容性。
// 简单来说，Java的序列化机制是通过在运行时判断类的serialVersionUID来验证版本一致性的。
static final long serialVersionUID = 234242343243L; //它的值由程序员随意指定即可。
```

注意：

- 如果类没有显示定义这个静态常量，它的值是Java运行时环境根据类的内部细节`自动生成`的。若类的实例变量做了修改，serialVersionUID `可能发生变化`。因此，建议显式声明。
- 如果声明了serialVersionUID，即使在序列化完成之后修改了类导致类重新编译，则原来的数据也能正常反序列化，只是新增的字段值是默认值而已。

### 其他流的使用

**标准输入、输出流**：

- System.in 和 System.out 分别代表了系统标准的输入和输出设备
- 默认输入设备是：键盘，输出设备是：显示器
- System.in的类型是 InputStream，属于**字节流**。
- System.out的类型是 PrintStream，其是 FilterOutputStream 的子类
- 重定向：通过System类的`setIn`，`setOut`方法对默认设备进行改变。
    - `public static void setIn(InputStream in)`
    - `public static void setOut(PrintStream out)`

**打印流**：实现将基本数据类型的数据格式转化为字符串输出。

- PrintStream和PrintWriter提供了一系列重载的print()和println()方法，用于多种数据类型的输出
- PrintStream和PrintWriter的输出不会抛出IOException异常
- PrintStream和PrintWriter有自动flush功能
- PrintStream 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下，应该使用 PrintWriter 类。

# 网络编程

网络编程的目的：直接或间接地通过网络协议与其它计算机实现数据交换，进行通讯。

网络编程中有三个主要的问题：

- 问题1：如何准确地定位网络上一台或多台主机
	- **IP地址**可以唯一标识网络中的设备
- 问题2：如何定位主机上的特定的应用
	- **端口号**可以唯一标识设备中的进程（应用程序）
- 问题3：找到主机后，如何可靠、高效地进行数据传输
	- **网络通信协议**对数据的传输格式、传输速率、传输步骤、出错控制等做了统一规定

`java.net` 包中包含的类和接口，它们提供低层次的通信细节。我们可以直接使用这些类和接口，来专注于网络程序开发，而不用考虑通信的细节。

`java.net` 包中提供了两种常见的网络协议的支持：

- **UDP**：用户数据报协议(User Datagram Protocol)。
- **TCP**：传输控制协议 (Transmission Control Protocol)

## InetAddress类

InetAddress类主要表示IP地址，两个子类：Inet4Address、Inet6Address。

InetAddress 类没有提供公共的构造器，而是提供了如下几个静态方法来获取InetAddress 实例

- public static InetAddress getLocalHost()
- public static InetAddress getByName(String host)
- public static InetAddress getByAddress(byte[] addr)

InetAddress 提供了如下几个常用的方法

- public String getHostAddress() ：返回 IP 地址字符串（以文本表现形式）
- public String getHostName() ：获取此 IP 地址的主机名
- public boolean isReachable(int timeout)：测试是否可以达到该地址

## Socket

网络上具有唯一标识的IP地址和端口号组合在一起构成唯一能识别的标识符套接字（Socket）。

- 利用套接字(Socket)开发网络应用程序早已被广泛的采用，以至于成为事实上的标准。网络通信其实就是Socket间的通信。
- 通信的两端都要有Socket，是两台机器间通信的端点。
- Socket允许程序把网络连接当成一个流，数据在两个Socket间通过IO传输。
- 一般主动发起通信的应用程序属客户端，等待通信请求的为服务端。

Socket分类：

- 流套接字（stream socket）：使用TCP提供可依赖的字节流服务
	- `ServerSocket`：此类实现TCP服务器套接字。服务器套接字等待请求通过网络传入。
	- `Socket`：此类实现客户端套接字（也可以就叫“套接字”）。套接字是两台机器间通信的端点。
- 数据报套接字（datagram socket）：使用UDP提供“尽力而为”的数据报服务
	- `DatagramSocket`：此类表示用来发送和接收UDP数据报包的套接字。

## TCP网络编程

Java语言的基于套接字TCP编程分为服务端编程和客户端编程，其通信模型如图所示：

![基于TCP的Socket编程](https://vip.123pan.cn/1844935313/obsidian/20260312224656571.png)

**ServerSocket类的构造方法：**

- `ServerSocket(int port)` ：创建绑定到特定端口的服务器套接字。

**ServerSocket类的常用方法：**

- `Socket accept()`：侦听并接受到此套接字的连接。

**Socket类的常用构造方法**：

- `public Socket(InetAddress address,int port)`：创建一个流套接字并将其连接到指定 IP 地址的指定端口号。
- public Socket(String host,int port)：创建一个流套接字并将其连接到指定主机上的指定端口号。
- `public InputStream getInputStream()`：返回此套接字的输入流，可以用于接收消息
- `public OutputStream getOutputStream()`：返回此套接字的输出流，可以用于发送消息
- `public void close()`：关闭此套接字。套接字被关闭后，便不可在以后的网络连接中使用（即无法重新连接或重新绑定）。需要创建新的套接字对象。 关闭此套接字也将会关闭该套接字的 InputStream 和 OutputStream。

演示单个客户端与服务器单次通信：

```java
// 服务端代码示例
public class Server {

    public static void main(String[] args)throws Exception {
        //1、准备一个ServerSocket对象，并绑定8888端口
        ServerSocket server =  new ServerSocket(8888);
        System.out.println("等待连接....");

        //2、在8888端口监听客户端的连接，该方法是个阻塞的方法，如果没有客户端连接，将一直等待
        Socket socket = server.accept();
        InetAddress inetAddress = socket.getInetAddress();
        System.out.println(inetAddress.getHostAddress() + "客户端连接成功！！");

        //3、获取输入流，用来接收该客户端发送给服务器的数据
        InputStream input = socket.getInputStream();
        //接收数据
        byte[] data = new byte[1024];
        StringBuilder s = new StringBuilder();
        int len;
        while ((len = input.read(data)) != -1) {
            s.append(new String(data, 0, len));
        }
        System.out.println(inetAddress.getHostAddress() + "客户端发送的消息是：" + s);

        //4、获取输出流，用来发送数据给该客户端
        OutputStream out = socket.getOutputStream();
        //发送数据
        out.write("欢迎登录".getBytes());
        out.flush();

        //5、关闭socket，不再与该客户端通信
        //socket关闭，意味着InputStream和OutputStream也关闭了
        socket.close();

        //6、如果不再接收任何客户端通信，可以关闭ServerSocket
        server.close();
    }
}
```

```java
// 客户端代码示例
public class Client {

    public static void main(String[] args) throws Exception {
        // 1、准备Socket，连接服务器，需要指定服务器的IP地址和端口号
        Socket socket = new Socket("127.0.0.1", 8888);

        // 2、获取输出流，用来发送数据给服务器
        OutputStream out = socket.getOutputStream();
        // 发送数据
        out.write("lalala".getBytes());
        // 在流末尾写入一个“流的末尾”标记，对方才能读到-1，否则对方的读取方法会一致阻塞
        socket.shutdownOutput();

        //3、获取输入流，用来接收服务器发送给该客户端的数据
        InputStream input = socket.getInputStream();
        // 接收数据
        byte[] data = new byte[1024];
        StringBuilder s = new StringBuilder();
        int len;
        while ((len = input.read(data)) != -1) {
            s.append(new String(data, 0, len));
        }
        System.out.println("服务器返回的消息是：" + s);

        //4、关闭socket，不再与服务器通信，即断开与服务器的连接
        //socket关闭，意味着InputStream和OutputStream也关闭了
        socket.close();
    }
}
```

多个客户端与服务器之间的多次通信：

- 通常情况下，服务器不应该只接受一个客户端请求，而应该不断地接受来自客户端的所有请求，所以Java程序通常会通过循环，不断地调用ServerSocket的accept()方法。
- 如果服务器端要“同时”处理多个客户端的请求，因此服务器端需要为**每一个客户端单独分配一个线程**来处理，否则无法实现“同时”。

```txt
客户端连接 → 服务器接收"上线"消息 → 服务器进入while循环
    ↓
等待客户端发送消息 (readLine阻塞)
    ↓
服务器收到消息 → 转发给其他客户端 → 继续等待下一条消息
    ↓
客户端断开连接 → 服务器readLine返回null → 服务器退出循环 → 服务器发送"下线"消息
```

![聊天室模型](https://vip.123pan.cn/1844935313/obsidian/20260313085800748.png)

## UDP网络编程

类 DatagramSocket 和 DatagramPacket 实现了基于 UDP 协议网络程序。

- UDP数据报通过数据报套接字 DatagramSocket 发送和接收，系统不保证  UDP数据报一定能够安全送到目的地，也不能确定什么时候可以抵达。
- DatagramPacket 对象封装了UDP数据报，在数据报中包含了发送端的IP地址和端口号以及接收端的IP地址和端口号、将要发送的数据、其长度。

UDP协议中每个数据报都给出了完整的地址信息，因此无须建立发送方和接收方的连接。如同发快递包裹一样。

**DatagramSocket 类的常用方法：**

- public void receive(DatagramPacket p)从此套接字接收数据报包。
- public void send(DatagramPacket p)从此套接字发送数据报包。

**DatagramPacket类的常用方法：**

- public DatagramPacket(byte[] buf,int length)构造 DatagramPacket，用来接收长度为 length 的数据包。 
- public DatagramPacket(byte[] buf,int length,InetAddress address,int port)构造数据报包，用来将长度为 length 的包发送到指定主机上的指定端口号。

```java
// 发送端代码示例
DatagramSocket ds = null;

try {
    ds = new DatagramSocket();
	
    byte[] by = "hello,atguigu.com".getBytes();
    DatagramPacket dp = new DatagramPacket(by, 0, by.length,     InetAddress.getByName("127.0.0.1"), 10000);
	
    ds.send(dp);
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (ds != null)
        ds.close();
}
```

```java
// 接收端代码示例
DatagramSocket ds = null;

try {
    ds = new DatagramSocket(10000);
	
    byte[] by = new byte[1024*64];
    DatagramPacket dp = new DatagramPacket(by, by.length);
	
    ds.receive(dp);
	
    String str = new String(dp.getData(), 0, dp.getLength());
    System.out.println(str + "--" + dp.getAddress());
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (ds != null)
        ds.close();
}
```

## URL编程

URL(Uniform Resource Locator)：统一资源定位符，它表示 Internet 上某一资源的地址。

URL的基本结构由5部分组成：`<传输协议>://<主机名>:<端口号>/<文件名>#片段名?参数列表` 。

其中：

- 片段名：即锚点，例如看小说，直接定位到章节
- 参数列表格式：参数名=参数值&参数名=参数值....

**URL类的构造方法：**

- public URL (String spec)：通过一个表示URL地址的字符串可以构造一个URL对象。
- public URL(URL context, String spec)：通过基 URL 和相对 URL 构造一个 URL 对象。
- public URL(String protocol, String host, String file)
- public URL(String protocol, String host, int port, String file)

URLConnection：表示到URL所引用的远程对象的连接。

- 当与一个URL建立连接时，首先要在一个 URL 对象上通过方法 openConnection() 生成对应的 URLConnection 对象。
- 通过URLConnection对象获取的输入流和输出流，即可以与现有的CGI程序进行交互。

> CGI 是公共网关接口 Common Gateway Interface 的简称，是用户浏览器和服务器端的应用程序进行连接的接口。

```java
// 将URL代表的资源下载到本地

//1. 获取URL实例
URL url = new URL("http://127.0.0.1:8080/examples/abcd.jpg");
//2. 建立与服务器端的连接
HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

//3. 获取输入流、创建输出流
InputStream is = urlConnection.getInputStream();
File file = new File("dest.jpg");
FileOutputStream fos = new FileOutputStream(file);

//4. 读写数据
byte[] buffer = new byte[1024];
int len;
while ((len = is.read(buffer)) != -1) {
	fos.write(buffer, 0, len);
}
System.out.println("文件下载完成");

//5. 关闭连接
fos.close();
is.close();
urlConnection.disconnect();
```

# 反射机制

## 概述

Java程序中，所有的对象都有两种类型：`编译时类型`和`运行时类型`，而很多时候对象的编译时类型和运行时类型`不一致`。

如果某些变量或形参的声明类型是Object类型，但是程序却需要调用该对象运行时类型的方法，该方法不是Object中的方法，那么如何解决呢？

- 方案1：在编译和运行时都完全知道类型的具体信息，在这种情况下，我们可以直接先使用`instanceof`运算符进行判断，再利用强制类型转换符，将其转换成运行时类型的变量即可。
- 方案2：编译时根本无法预知该对象和类的真实信息，程序只能依靠`运行时信息`来发现该对象和类的真实信息，这就必须使用`反射`。

Reflection（反射）是被视为`动态语言`的关键，反射机制允许程序在`运行期间`借助于Reflection API取得任何类的内部信息，并能直接操作任意对象的内部属性及方法。

加载完类之后，在堆内存的方法区中就产生了一个Class类型的对象（一个类只有一个Class对象），这个对象就包含了完整的类的结构信息。我们可以通过这个对象看到类的结构。这个对象就像一面镜子，透过这个镜子看到类的结构，所以我们形象的称之为：反射。

![](https://vip.123pan.cn/1844935313/obsidian/20260313095425265.png)

对象照镜子后可以得到的信息：某个类的属性、方法和构造器、某个类到底实现了哪些接口。具体来说，Java反射机制提供的功能有：

- 在运行时判断任意一个对象所属的类
- 在运行时构造任意一个类的对象
- 在运行时判断任意一个类所具有的成员变量和方法
- 在运行时获取泛型信息
- 在运行时调用任意一个对象的成员变量和方法
- 在运行时处理注解
- 生成动态代理

> 使用反射，我们可以调用运行时类中任意的构造器、属性、方法。包括了私有的属性、方法、构造器。
> 不使用反射，我们需要考虑封装性。比如：出了Person类之后，就不能调用Person类中私有的结构。

```java
/*
* 使用反射之前可以执行的操作
* */
@Test
public void test1(){
	//1.创建Person类的实例
	//public Person()
	Person p1 = new Person();
	System.out.println(p1);

	//2.调用属性
	//public int age;
	p1.age = 10;
	System.out.println(p1.age);

	//3.调用方法
	//public void show()
	p1.show();
}

/*
* 使用反射完成上述的操作
* */
@Test
public void test2() throws Exception{
	Class<Person> clazz = Person.class;
	
	//1.创建Person类的实例
	//public Person()
	Person p1 = clazz.newInstance();
	System.out.println(p1);

	//2.调用属性
	//public int age;
	Field ageField = clazz.getField("age");
	ageField.set(p1,10);
	System.out.println(ageField.get(p1));

	//3.调用方法
	//public void show()
	Method showMethod = clazz.getMethod("show");
	showMethod.invoke(p1);
}
```

反射的**优点：**

- 提高了Java程序的灵活性和扩展性，`降低了耦合性`，提高`自适应`能力
- 允许程序创建和控制任何类的对象，无需提前`硬编码`目标类

反射的**缺点：**

- 反射的`性能较低`。
    - 反射机制主要应用在对灵活性和扩展性要求很高的系统框架上
- 反射会`模糊`程序内部逻辑，`可读性较差`

## Class类

Class类是Java反射的源头，针对任何你想动态加载、运行的类，唯有先获得相应的Class对象。Class 对象只能由系统建立对象，通过Class可以完整地得到一个类中的所有被加载的结构。

![|600x0](https://vip.123pan.cn/1844935313/obsidian/20260313100857397.png)

### 获取Class类的实例

针对于编写好的.java源文件进行编译(使用javac.exe)，会生成一个或多个.class字节码文件。

接着，我们使用java.exe命令对指定的.class文件进行解释运行。这个解释运行的过程中，我们需要将.class字节码文件加载(使用类的加载器)到内存中(存放在方法区)。

加载到内存中的.class文件对应的结构即为Class的一个实例。

**方式1：要求编译期间已知类型**

若已知具体的类，通过`类的class属性`获取，该方法最为安全可靠，程序性能最高。

```java
Class clazz = GetClassObject.class;
```

**方式2：获取对象的运行时类型**

已知某个类的实例，调用该`实例的getClass()方法`获取Class对象。

```java
GetClassObject obj = new GetClassObject();
Class clazz = obj.getClass();
```

**方式3：可以获取编译期间未知的类型**

已知一个类的全类名，且该类在类路径下，可通过`Class类的静态方法forName()`获取，可能抛出ClassNotFoundException。

```java
Class clazz = Class.forName("com.atguigu02._class.GetClassObject");
```

**方式4：其他方式**

前提：可以用系统类加载对象或自定义加载器对象加载指定路径下的类型。

```java
ClassLoader cl = this.getClass().getClassLoader();
Class clazz = cl.loadClass("com.atguigu02._class.GetClassObject");
```

### 类的加载

类在内存中完整的生命周期：加载-->使用-->卸载。其中加载过程又分为：`装载`、`链接`、`初始化`三个阶段。

![类的生命周期|650x0](https://vip.123pan.cn/1844935313/obsidian/20260313104718228.png)

类的加载分为三个阶段：

1. 装载（Loading）
	- 将类的class字节码文件读入内存，并为之创建一个java.lang.Class对象。此过程由**类加载器**完成
2. 链接（Linking）
	- ①验证Verify：确保加载的类信息符合JVM规范，例如：以cafebabe开头，没有安全方面的问题。
	- ②准备Prepare：正式为类变量（static）分配内存并`设置类变量默认初始值`的阶段，这些内存都将在方法区中进行分配。
	- ③解析Resolve：虚拟机常量池内的符号引用（常量名）替换为直接引用（地址）的过程。
3. 初始化（Initialization）
	- 执行`类构造器<clinit>()方法`的过程。`类构造器<clinit>()方法`是由编译器自动收集类中所有类变量的赋值动作和静态代码块中的语句合并产生的。（类构造器是构造类信息的，不是构造该类对象的构造器）。
	- 当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先触发其父类的初始化。
	- 虚拟机会保证一个`类的<clinit>()方法`在多线程环境中被正确加锁和同步。

### 类的加载器

作用：负责类的加载，并对应于一个Class的实例。

分类（分为两种）：

- `BootstrapClassLoader`:引导类加载器、启动类加载器
	- 使用C/C++语言编写的，不能通过Java代码获取其实例
	- 负责加载Java的核心库（JAVA_HOME/jre/lib/rt.jar或sun.boot.class.path路径下的内容）
- 继承于ClassLoader的类加载器
	- `ExtensionClassLoader`:扩展类加载器
		- 负责加载从java.ext.dirs系统属性所指定的目录中加载类库，或从JDK的安装目录的jre/lib/ext子目录下加载类库
	- `SystemClassLoader/ApplicationClassLoader`:系统类加载器、应用程序类加载器
		- 我们自定义的类，默认使用的类的加载器。
	- `用户自定义类的加载器`
		- 实现应用的隔离（同一个类在一个应用程序中可以加载多份）；数据的加密。

以上的类的加载器之间不存在继承关系。

```java
class ClassLoader{
    ClassLoader parent;

    public ClassLoader(ClassLoader parent){
        this.parent = parent;
    }
}

// 我们把loader0叫做loader1的父类加载器。
ClassLoader loader0 = new ClassLoader();
ClassLoader loader1 = new ClassLoader(loader0);
```

## 反射的应用

### 创建运行时类的对象

这是反射机制应用最多的地方。创建运行时类的对象有两种方式：

**方式1：调用Class对象的newInstance()方法**

1. 获取该类型的Class对象 
2. 调用Class对象的newInstance()方法创建对象

```java
Class clazz = Person.class;
Person per = (Person) clazz.newInstance();  //创建Person类的实例
```

要求：

- 类必须有一个无参数的构造器。
- 类的构造器的访问权限需要足够。

> [!info] 回忆：JavaBean中要求给当前类提供一个公共的空参的构造器。有什么用？
> 场景1：子类对象在实例化时，子类的构造器的首行默认调用父类空参的构造器。
> 场景2：在反射中，经常用来创建运行时类的对象。那么我们要求各个运行时类都提供一个空参的构造器，便于我们编写通用的创建运行时类对象的代码。

**方式2：通过获取构造器对象来进行实例化**

1. 通过Class类的`getDeclaredConstructor(Class … parameterTypes)`，取得本类的指定形参类型的构造器
	- 如果构造器的权限修饰符修饰的范围不可见，调用`setAccessible(true)`
2. 向构造器的形参中传递一个对象数组进去，里面包含了构造器中所需的各个参数。 
3. 通过Constructor实例化对象。

### 获取运行时类的完整结构

可以获取：包、修饰符、类型名、父类（包括泛型父类）、父接口（包括泛型父接口）、成员（属性、构造器、方法）、注解（类上的、方法上的、属性上的）。

```java
//1.实现的全部接口
public Class<?>[] getInterfaces()   
//确定此对象所表示的类或接口实现的接口。 

//2.所继承的父类
public Class<? Super T> getSuperclass()
//返回表示此 Class 所表示的实体（类、接口、基本类型）的父类的 Class。

//3.全部的构造器
public Constructor<T>[] getConstructors()
//返回此 Class 对象所表示的类的所有public构造方法。
public Constructor<T>[] getDeclaredConstructors()
//返回此 Class 对象表示的类声明的所有构造方法。

//Constructor类中：
//取得修饰符: 
public int getModifiers();
//取得方法名称: 
public String getName();
//取得参数的类型：
public Class<?>[] getParameterTypes();

//4.全部的方法
public Method[] getDeclaredMethods()
//返回此Class对象所表示的类或接口的全部方法
public Method[] getMethods()  
//返回此Class对象所表示的类或接口的public的方法

//Method类中：
public Class<?> getReturnType()
//取得全部的返回值
public Class<?>[] getParameterTypes()
//取得全部的参数
public int getModifiers()
//取得修饰符
public Class<?>[] getExceptionTypes()
//取得异常信息

//5.全部的Field
public Field[] getFields() 
//返回此Class对象所表示的类或接口的public的Field。
public Field[] getDeclaredFields() 
//返回此Class对象所表示的类或接口的全部Field。

//Field方法中：
public int getModifiers()
//以整数形式返回此Field的修饰符
public Class<?> getType()  
//得到Field的属性类型
public String getName()  
//返回Field的名称。

//6. Annotation相关
get Annotation(Class<T> annotationClass) 
getDeclaredAnnotations() 

//7.泛型相关
//获取父类泛型类型：
Type getGenericSuperclass()
//泛型类型：ParameterizedType
//获取实际的泛型类型参数数组：
getActualTypeArguments()

//8.类所在的包
Package getPackage() 
```

### 调用指定的属性、方法、构造器

调用指定的属性（步骤）：

1. 通过Class实例调用`getDeclaredField(String fieldName)`，获取运行时类指定名的属性
2. `setAccessible(true)`：确保此属性是可以访问的
3. 通过Filed类的实例调用`get(Object obj)` （获取的操作）或 `set(Object obj,Object value)` （设置的操作）进行操作。
	- 如果操作静态变量，那么实例对象可以省略，用null表示

> 针对于核心源码的api，内部的私有的结构在jdk17中就不可以通过反射调用了。

```java
//1、获取Student的Class对象
Class clazz = Class.forName("com.atguigu.reflect.Student");

//2、获取属性对象，例如：id属性
Field idField = clazz.getDeclaredField("id");
//3、如果id是私有的等在当前类中不可访问access的，我们需要做如下操作
idField.setAccessible(true);

//4、创建实例对象，即，创建Student对象
Object stu = clazz.newInstance();

//5、获取属性值
/*
 * 以前：int 变量= 学生对象.getId()
 * 现在：Object id属性对象.get(学生对象)
 */
Object value = idField.get(stu);

//6、设置属性值
/*
 * 以前：学生对象.setId(值)
 * 现在：id属性对象.set(学生对象,值)
 */
idField.set(stu, 2);
```

调用指定的方法（步骤）：

1. 通过Class的实例调用`getDeclaredMethod(String methodName,Class ... args)`,获取指定的方法
2. `setAccessible(true)`：确保此方法是可访问的
3. 通过Method实例调用`invoke(Object obj,Object ... objs)`,即为对Method对应的方法的调用。
	- 如果方法是静态方法，实例对象也可以省略，用null代替
	- 如果Method对应的方法的返回值类型为void，则invoke()返回值为null

调用指定的构造器（步骤）：

1. 通过Class的实例调用`getDeclaredConstructor(Class ... args)`，获取指定参数类型的构造器
2. `setAccessible(true)`：确保此构造器是可以访问的
3. 通过Constructor实例调用`newInstance(Object ... objs)`,返回一个运行时类的实例。

### 获取注解的信息

![[Java 基础-面向对象#注解]]

```java
@Table(value="t_customer")
public class Customer {
    @Column(columnName = "cust_name",columnType = "varchar(15)")
    private String name;
    @Column(columnName = "cust_age",columnType = "int")
    public int age;
	...
}
```

```java
Class clazz = Customer.class;

//获取类声明上的注解
Table annotation = (Table) clazz.getDeclaredAnnotation(Table.class);
System.out.println(annotation.value());//t_customer

//获取属性声明上的注解
Field nameField = clazz.getDeclaredField("name");
Column nameColumn = nameField.getDeclaredAnnotation(Column.class);
System.out.println(nameColumn.columnName());//cust_name
System.out.println(nameColumn.columnType()); //varchar(15)
```

