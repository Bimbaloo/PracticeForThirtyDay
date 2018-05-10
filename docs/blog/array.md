# 数组操作实现 --马燥

## 简单数组实现
### join

---

使用

```
var array = ['a','b','c']
array.join('-') // 结果是 'a-b-c'
```

1. array.join 实际上是 Array.prototype.join 对应的函数（array.join === Array.prototype.join）
2. array.join('-') 等价与 array.join.call(array, '-')
3. join 函数通过 this 和 arguments[0] 可以得到 array 和 '-' 两个值

所以我们可以大胆猜测 array.join 的源代码大概是这样的

```
/**
 * @private
 * @param {String||','} 指定一个字符串来分隔数组的每个元素。
 * 如果需要(separator)，将分隔符转换为字符串。
 * 如果省略()，数组元素用逗号分隔。默认为 ","。
 * 如果separator是空字符串("")，则所有元素之间都没有任何字符
 */

Array.prototype.join = function(separator){
  let result = this[0] || ''            // 返回字符创的初始值
  let length = this.length              // 处理数组的长度
  for(let i=1; i< length; i++){         // this[0]已经在前面赋值，所以从this[1]开始拼接
      result += separator + this[i]
  }
  return result
}
```

this 就是 array，因为你使用 array.join('-') 来调用 join 的（隐式指定this）

> 小技巧（奇技淫巧）如何快速生成n个m

示例：生产5个8

```
Array(6).join('8') // '88888'
```

### slice

---

slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。

```
array.slice(beginIndex, endIndex)
```

猜测源码大概大概大概是这样的。。。

```
Array.prototype.slice = function(begin, end){
    let result = []
    begin = begin || 0
    end = end || this.length
    for(let i = begin; i < end; i++) {
        result.push(this[i])
    }

    return result
}
```

因为该方法只需要`this`具有`length`属性即可，于是很多前端用 slice 来将伪数组，转化成数组(将`this`传进去)

```
array = Array.prototye.slice.call(arrayLike)
或者
array = [].slice.call(arrayLike)
```

ES6出了一个新的 API

```
array = Array.from(arrayLike)
```

P.S. 伪数组与真数组的区别就是：伪数组的原型链中没有 Array.prototype，而真数组的原型链中有 Array.prototype。因此伪数组没有 pop、join 等属性。

### sort

---

sort() 方法用[就地（ in-place ）的算法](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)对数组的元素进行排序，并返回数组。 sort 排序不一定是稳定的。默认排序顺序是根据字符串Unicode码点。

> 真正内置的 sort 方法是[就地（ in-place ）的算法](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)。这里为了代码简单我们使用选择排序

```
Array.prototype.sort = function(fn){
    fn = fn || (a,b)=> a-b
    let roundCount = this.length - 1 // 比较的轮数
    for(let i = 0; i < roundCount; i++){
        let minIndex = this[i]
        for(let k = i+1; k < this.length; k++){
            if( fn.call(null, this[k],this[i]) < 0 ){
                [ this[i], this[k] ] = [ this[k], this[i] ]
            }
        }
    }
}
```

fn.call(null, this[k], this[i]) 决定了第 k 项和第 i 项的前后（大小）关系。
</br>

## 较复杂数组实现（forEach、 map、filter 和 reduce）

### forEach

---

```
Array.prototype.forEach = function(fn){
    for(let i=0;i<this.length; i++){
        if(i in this){              // 如果数组某项为空或undefind,不执行该项
            fn.call(undefined, this[i], i, this)
        }
    }
}
```

forEach 和 for 的区别主要有两个：

1. forEach 没法 break
2. forEach 用到了函数，所以每次迭代都会有一个新的函数作用域；而 for 循环只有一个作用域（著名前端面试题就是考察了这个）

> 因为forEach里面是遍历`this`，所以可以有些小（骚）技（操）巧（作）

示例：遍历一个字符创

```
let str = 'abcdefg';
[].forEach.call(str, (el)=>{
    console.log(el)
})
// a b c d e f g
```

### map

---

由于 map 和 forEach 功能差不多，区别只有返回值而已.
想用 map 的返回值就用，不用想就放在一边。

```
Arra.prototype.filter = function(fn){
    let result = []
    let temp
    for(let i=0;i<this.length; i++){
        if(i in this) {
            if(temp = fn.call(undefined, this[i], i, this) ){
                result.push(this[i])
            }
        }
    }
    return result
}
```

### filter

---

```
Arra.prototype.filter = function(fn){
    let result = []
    let temp
    for(let i=0;i<this.length; i++){
        if(i in this) {
            if(temp = fn.call(undefined, this[i], i, this) ){  // 将返回结果赋值给`temp`;如果`temp`为`true`
                result.push(this[i])
            }
        }
    }
    return result
}
```

fn.call() 返回真值就 push 到返回值，没返回真值就不 push。

### reduce

---

方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值

```
Arra.prototype.reduce = function(fn, init){
    let result = init
    for(let i=0;i<this.length; i++){
        if(i in this) {
            result = fn.call(undefined, result, this[i], i, this)
        }
    }
    return result
}
```

### map、filter 和 reduce 的联系

---

1. map 可以用 reduce 表示

   ```
   array2 = array.map( (v) => v+1 )
   可以写成 
   array2 = array.reduce( (result, v)=> {
     result.push(v + 1)
     return result
   }, [] )
   ```

2. filter 可以用 reduce 表示

   ```
   array2 = array.filter( (v) => v % 2 === 0 )
   可以写成
   array2 = array.reduce( (result, v)=> {
     if(v % 2 === 0){ result.push(v) }
     return result
   }, [])
   ```

</br>

## Underscore 和 lodash 介绍
### Underscore && lodash

---

- [Underscore.js](http://www.bootcss.com/p/underscore/)

  > Underscore 是一个集合操作的库（当时 还是IE的天下并且JS 没有 Set，所以集合指的是数组和对象)
- [lodash.js](http://www.css88.com/doc/lodash/)

  > lodash一开始是Underscore.js库的一个fork，因为和其他(Underscore.js的)贡献者意见相左。John-David Dalton的最初目标，是提供更多“一致的跨浏览器行为……，并改善性能”。之后，该项目在现有成功的基础之上取得了更大的成果。最近lodash成为了npm包仓库中依赖最多的库。它正在摆脱屌丝身份，成为开发者的常规的选择之一。

两者的用法和类型都很类似。
主要有六类 API：

- 集合 API
- 数组 API
- 对象 API
- 函数 API
- 杂项 API
- 链式操作

### 集合 API

- each
- map
- reduce
- reduceRight 反向 reduce
- find 用函数查找第一个符合条件的
- filter 用函数查找所有符合条件的
- where 用对象查找所有符合条件的
- findWhere 用对象查找第一个符合条件的
- reject 剔除（把符合条件的都删掉，跟 filter 正好相反）
- every 是否所有项都满足条件
- some 是否有至少一项满足条件
- contains
- invoke
- pluck 拔
- max
- min
- sortBy
- groupBy
- indexBy
- countBy
- shuffle 随机顺序
- sample 取样
- toArray
- size 获取 key 的个数（不同于 length）
- partition 分区

### 数组 API

- first
- initial
- last
- rest
- compact 剔除假值
- flatten 拍扁
- without 剔除部分值
- union 求并集
- intersection 求交集
- difference 求左差集
- uniq 去重
- zip 拉拉链
- unzip
- object 多个数组变成一个对象
- indexOf
- lastIndexOf
- sortedIndex
- findIndex
- findLastIndex
- range 区间

### 函数 API

- bind
- bindAll
- partial 偏函数（柯里化）
- memoize 给函数添加记忆（以斐波那契为例）
- delay 基本等同于 setTimeout
- defer 基本等同于 setTimeout 0
- throttle 函数节流、函数限流
- debounce 函数防抖
- once 只能调用一次
- after 调用 N 次之后才真正调用原函数
- before 只能调用 N 次
- wrap
- negate 负操作
- compose 函数组合

### 链式操作

```
_.map([1, 2, 3], function(n){ return n * 2; });
可以写成
_([1, 2, 3]).map(function(n){ return n * 2; });
```
</br>

## Underscore中的uniq（数组去重）函数

### unique  (去重)

---

我们先自己实现一下去重

#### 1 ES6版本

---

在ES6版本中，引入了一个新的数据结构——set，这是一种类似数组的数据结构，它有个最大的特点就是内部的每一个元素都是独一无二的，所以我们可以利用它来对数组进行去重：

```
var uniq = function(array) {
    var set = new Set(array);
    return [...set];
}
```

#### 2 ES5版本

---

对于接受的数组，我们可以对其进行遍历，使用一个result数组存放独一无二的元素，对于传入数组的每一项，在result中进行检索，如果result中不存在，那么就推入result中，最后返回result即可：

```
var uniq = function(array) {
    var result = [];
    var length = array.length;
    var i;
    for(i = 0; i < length; i++) {
        if(result.indexOf(array[i]) < 0) {  // result内是否存在该元素
            result.push(array[i]);
        }
    }
    return result;
};

。
```

该函数已经能够比较简单的数值、字符串、布尔值等简单值了，但是如果是复杂对象的话，可能就达不到去重的目的，比如：

```
var objArr = [{name: 'a'}, {name: 'a'}];
console.log(uniq(objArr));
```

我们可能会希望返回值是[{name: 'a'}]，但是由于连个对象引用值不相等，所以比较时，不会对这两个对象进行去重，导致最后返回的结果是两个都存在，这显然不是我们所期望的。

我们需要一个指定比较规则的函数。

> 当然我们可是用一些皮一点的方式：比较的是引用值？没关注，序列化一下，最后再遍历一遍反序列化就好~~~

```
var uniq = function(array) {
    var result = [];
    var length = array.length;
    var i;
    for(i = 0; i < length; i++) {
        if(result.indexOf(JSON.stringify(array[i])) < 0) {
            result.push(JSON.stringify(array[i]));
        }
    }
    result = result.map(el=>JSON.parse(result))
    return result;
};
```

试一下

```
var objArr = [{name: 'a'}, {name: 'a'}];
console.log(uniq(objArr));
// [{name: 'a'}]
```

> 就是时间复杂度会变大很多~~

#### 3 规则定制版去重函数

---

我们无法预知用户传递的数组内元素的类型，所以我们最好能够让用户自定义比较规则，最好的办法就是让用户传递函数作为参数。

默认函数接受的参数即为数组中的某一项：

```
var uniq = function(array, func) {
    var result = [];
    var length = array.length;
    var i;
    if(!func) {
        for(i = 0; i < length; i++) {
            if(result.indexOf(array[i]) < 0) {
                result.push(array[i]);
            }
        }
    }
    else {
        var seen = [];
        for(i = 0; i < length; i++) {
            if(seen.indexOf(func(array[i])) < 0) {
                seen.push(func(array[i]));
                result.push(array[i]);
            }
        }
    }
    return result;
};
```

在func没有被传递时，直接进行比较；如果传递了func函数，那么对于array中的每一项，使用func处理后的返回值再进行比较，这样就可以达到对象比较的目的。

再次使用对象进行实验：

```
var objArr = [{id: 'a'}, {id: 'a'}, {id: 'b'}];
console.log(uniq(objArr, function(item) {
    return item.id;
}));
// [{id: 'a'}, {id: 'b'}]
```

> 这样就没有在增加时间空间复杂度的情况下完成了去重~~~ 不过皮一下还是很开心的~~

#### 4 继续提高效率

---

我们可以给uniq函数新增一个参数——isSorted，代表传递的数组是否是有序数组。

```
var uniq = function(array, isSorted, func) {
    var result = [];
    var length = array.length;
    var i;
    var seen = [];
    if(isSorted && !func) {
        for(i = 0; i< length; i++) {
            if(array[i] == seen) continue;      // `seen`提前被保存，只需要比较
            else {
                result.push(array[i]);
                seen = array[i];
            }
        }
    }
    else if(func){
        for(i = 0; i < length; i++) {
            if(seen.indexOf(func(array[i])) < 0) {
                seen.push(func(array[i]));
                result.push(array[i]);
            }
        }
    }
    else{
        for(i = 0; i < length; i++) {       
            if(result.indexOf(array[i]) < 0) {   // 先计算再比较
                result.push(array[i]);
            }
        }
    }
    return result;
};
```

这样的实现就比较完善了，其中重要的点是对于seen这个变量的运用。

### Underscore源码实现

---

以下就是Underscore的源码（附注释）：

```
// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
// Aliased as `unique`.
//数组去重函数，使得数组中的每一项都是独一无二的。
_.uniq = _.unique = function (array, isSorted, iteratee, context) {
    //如果没有传递isSorted参数（即传递值不是Boolean类型），那么默认为false，其余参数重新赋值。
    if (!_.isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
    }
    //如果传递了iteratee，那么使用cb方法包装（确保返回一个函数），然后重新赋值。
    if (iteratee != null) iteratee = cb(iteratee, context);
    //保存结果。
    var result = [];
    //用于存放array的值便于下一次比较，或者用于存储computed值。
    var seen = [];
    //遍历array数组。
    for (var i = 0, length = getLength(array); i < length; i++) {
        //value表示当前项，computed表示要比较的项（有iteratee时是iteratee的返回值，无iteratee时是value自身）。
        var value = array[i],
            computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted && !iteratee) {
            //如果数组是有序的，并且没有传递iteratee，则依次比较相邻的两项是否相等。
            //！0===true，其余皆为false。
            if (!i || seen !== computed) result.push(value);
            //seen存放当前的项，以便于下一次比较。
            seen = computed;
        } else if (iteratee) {
            //如果传递了iteratee，那么seen就用于存放computed值，便于比较。
            //之所以不直接使用result存放computed值是因为computed只用于比较，result存放的值必须是原来数组中的值。
            if (!_.contains(seen, computed)) {
                seen.push(computed);
                result.push(value);
            }
        } else if (!_.contains(result, value)) {
            //isSorted为false并且iteratee为undefined。
            //可以理解为参数数组中是乱序数字，直接比较就好了。
            result.push(value);
        }
    }
    return result;
};
```

> [参考链接](https://juejin.im/post/5ac0a1cc518825557b4ce348)

### Underscore 源代码阅读方法

1. 搜索 underscore annotated source code 
2. [带英文注释的源码](http://underscorejs.org/docs/underscore.html)

## lodash 中的forEach函数
### forEach

---

老规矩，我们先自己实现一下

```
Array.prototype.forEach = function(fn){
    for(let i=0;i<this.length; i++){
        if(i in this){              // 如果数组某项为空或undefind,不执行该项
            fn.call(undefined, this[i], i, this)
        }
    }
}
```

ES5 已经有原生的forEach,但是有一个缺点：无法中断
示例：已知数组为有序的，将数字`N`插入到数组中

[采用原生forEach的话](http://js.jirengu.com/zodug/2/edit?js,console)

```
// 采用原生forEach的话
const N = 7
let needArr = [2, 5, 8, 9, 20]
let needArrCopy = JSON.parse(JSON.stringify(needArr))

needArrCopy.forEach((el, index)=>{
    if (N < el) {
      needArr.splice(index, 0, N)
      return false
    } else if (N > needArrCopy[needArrCopy.length - 1]) {
      needArr.push(N)
      return false
    }
});

console.log(needArr ) // [2, 5, 7, 7, 7, 8, 9, 20]
```

显然结果不是想要的

[使用lodash 的forEach](http://js.jirengu.com/zodug/1/edit?js,console)

```
// 使用lodash 的forEach
const N = 7
let needArr = [2, 5, 8, 9, 20]
let needArrCopy = JSON.parse(JSON.stringify(needArr))

_.forEach(needArrCopy,(el, index)=>{
    if (N < el) {
      needArr.splice(index, 0, N)
      return false
    } else if (N > needArrCopy[needArrCopy.length - 1]) {
      needArr.push(N)
      return false
    }
});
console.log(needArr ) // [2, 5, 7, 7, 7, 8, 9, 20]
```

### 源码

---

那么它是怎么做到可以中断的呢？我们来看下源码

[arrayEach.js](https://github.com/lodash/lodash/blob/master/forEach.js)

```
import arrayEach from './.internal/arrayEach.js'
import baseEach from './.internal/baseEach.js'

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 // Iteratee函数可以通过显式返回“false”来提前退出迭代。
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `forIn`
 * or `forOwn` for object iteration.
 *
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see forEachRight, forIn, forInRight, forOwn, forOwnRight
 * @example
 *
 * forEach([1, 2], value => console.log(value))
 * // => Logs `1` then `2`.
 *
 * forEach({ 'a': 1, 'b': 2 }, (value, key) => console.log(key))
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  const func = Array.isArray(collection) ? arrayEach : baseEach   // 如果传入的是数组，那么使用`arrayEach`处理；如果不是使用`baseEach`处理
  return func(collection, iteratee)
}

export default forEach
```

[arrayEach.js](https://github.com/lodash/lodash/blob/master/.internal/arrayEach.js)

```
/**
 * A specialized version of `forEach` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  let index = -1
  const length = array == null ? 0 : array.length

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {  // Iteratee函数可以通过显式返回“false”来提前退出迭代。
      break
    }
  }
  return array
}

export default arrayEach
```
