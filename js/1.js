function execTime(t) {
  let endTime= new Date().getTime() + t
  let nowTime = new Date()
  while (nowTime.getTime()<endTime) {
    nowTime = new Date()
  }
}
console.log(1) // 输出1
console.time('开始')
execTime(3000) // 运行3秒钟
console.timeEnd('开始')
console.log(2) // 输出2