var moment = require('./libs/moment');

function today() {
	return moment().format('DD/MM/YYYY')
}

function now() {
	return moment().format('HH:mm')
}

let DEFAULT_VOLUME = 170

class Day {
	constructor(date) {
		if (date) {
			this.date = date
		} else {
			this.date = today()
		}
		this.weight = null
		this.height = null
		this.drinks = []
		this.changes = []
	}

	addDrink(drink) {
		this.drinks.push(drink)
	}
	
	addChange(change) {
		this.changes.push(change)
	}
}

class Change {
	constructor(time) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		this.pee = true
		this.poo = false
	}
}

class Drink {
	constructor(time,volume) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		if (volume) {
			this.totalVolume = volume
		} else {
			this.totalVolume = DEFAULT_VOLUME
		}
		this.leftVolume = this.totalVolume
	}
	
	get drankVolume() {
		return this.totalVolume - this.leftVolume
	}
}
