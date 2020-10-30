let testDay = new Day()
let testDrink = new Drink()
testDrink.leftVolume = 0
let testDrink2 = new Drink('20:34',150)
testDrink2.leftVolume = 100
let testChange = new Change()
testDay.addDrink(testDrink)
testDay.addDrink(testDrink2)
testDay.addChange(testChange)

console.log(testDay)
console.log(testDrink.drankVolume)
console.log(testDrink2.drankVolume)
console.log(testDay.totalDrankVolume())

console.log(testDay.didPoo())
let testChange2 = new Change(null,true)
testDay.addChange(testChange2)
console.log(testDay)
console.log(testDay.didPoo())

let testVomit1 = new Vomit('02:56')
let testVomit2 = new Vomit('15:33','blue colour')
testDay.addVomit(testVomit1)
testDay.addVomit(testVomit2)

let testBath = new Bath('23:56')
testDay.setBath(testBath)
let testVitamin = new Vitamin('08:55',3)
testDay.setVitamin(testVitamin)

console.log(testDay)
