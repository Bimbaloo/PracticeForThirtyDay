/*
  参考了其他人的答案，找到重点：由于fn(),fn()(),fn()()()都能运行且输出不同值，所以
*/
function fn() {
  let str = 'a'
  setTimeout(function(){
    console.log(str)
  })
  return function fn(){
    str = 'b'
  }
}