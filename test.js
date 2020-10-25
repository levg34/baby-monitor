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
