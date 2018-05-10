/*

function fn () {
  this.fn = fn    //这里的this不是fn本身
  return fn
}

*/


function fn () {
  fn.fn = fn
  return fn
}

console.log(fn() === fn)
console.log(fn.fn === fn)