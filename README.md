# 前端面试三十天

1. 写一个函数 `execTime`, 参数： 时间毫秒数; 作用：什么都不做，但函数执行会消失参数传递的毫秒数
    > [第一天练习答案](https://coding.net/u/mzfs/p/PracticeForThirtyDay/git/blob/master/js/1.js?public=true)

    ```javaScript
    function execTime(t) {
      // 补全代码
    }
    console.log(1) // 输出1
    execTime(3000) // 运行3秒钟
    console.log(1) // 输出2

    ```


2. 写一个函数`execTime`， 参数`t`：时间毫秒数，参数`callback`：回调函数

    > [第二天练习答案](https://coding.net/u/mzfs/p/PracticeForThirtyDay/git/blob/master/js/2.js?public=true)
    ```javaScript
    function execTime(t) {
      // 补全代码
    }
    console.log(1) // 输出1
    execTime(3000,function(){
      console.log(3)
    }) // 3秒后输出
    console.log(1) // 输出2
    ```

3. 写一个JS对象obj,使得obj.obj.obj.obj.obj === obj,也就是说，不管出现多少次obj，都得到obj。

    ```javaScript
    let obj = {}
    obj.obj = obj
    ```
   > 考察内存引用，但是一下子画不出内存图

> 漏了两天没完成任务~~
4. 写一个函数fn，要求fn满足一下条件：
  1. fn() === fn
  2. fn.fn === fn