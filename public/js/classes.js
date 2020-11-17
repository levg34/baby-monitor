function today() {
	return moment().format('YYYY-MM-DD')
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
		this.bath = null
		this.vitamin = null
		this.vomit = null
		this.drinks = []
		this.changes = []
	}

	addDrink(drink) {
		this.drinks.push(drink)
	}
	
	addChange(change) {
		this.changes.push(change)
	}
	
	setBath(bath) {
		this.bath = bath
	}
	
	setVitamin(vitamin) {
		this.vitamin = vitamin
	}
	
	addVomit(vomit) {
		if (! (this.vomit instanceof Array)) {
			this.vomit = []
		}
		this.vomit.push(vomit)
	}
	
	totalDrankVolume() {
		return this.drinks.map(d => d.drankVolume).reduce((a,b)=>a+b)
	}
	
	didPoo() {
		return this.changes.map(c => c.poo).reduce((a,b)=>a||b)
	}
	
	totalDrinks() {
		return this.drinks.length
	}
	
	static fromJSON(object) {
		//TODO
	}
}

class Change {
	constructor(time,poo) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		this.pee = true
		this.poo = poo || false
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

class Bath {
	constructor(time,soap) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		this.soap = (soap === true)
	}
}

class Vitamin {
	constructor(time,drops) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		this.drops = drops
	}
}

class Vomit {
	constructor(time,comments) {
		if (time) {
			this.time = time
		} else {
			this.time = now()
		}
		if (comments) {
			this.comments = comments
		}
	}
}
