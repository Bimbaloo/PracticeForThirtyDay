function execTime(t,fn) {
  setTimeout(fn,t)
}
var endTime,startTime;
console.log(1) // 输出1
startTime = new Date().getTime()

execTime(3000,function() {
 console.log(3)
 endTime = new Date().getTime()
 console.log(endTime - startTime)
}) // 运行3秒钟

console.log(2) // 输出2