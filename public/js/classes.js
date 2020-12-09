function today() {
	return moment().format('YYYY-MM-DD')
}

function now() {
	return moment().format('HH:mm')
}

let DEFAULT_VOLUME = 170
let DEFAULT_DROPS = 3

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

	totalServedVolume() {
		return this.drinks.map(d => d.totalVolume).reduce((a,b)=>1*a+1*b)
	}

	averageDrankVolume() {
		return this.drinks.map(d => d.drankVolume).reduce((a,b)=>a+b) / this.drinks.length
	}
	
	didPoo() {
		return this.changes.map(c => c.poo).reduce((a,b)=>a||b)
	}

	totalPoo() {
		return this.changes.map(c => c.poo).filter(Boolean).length
	}
	
	totalDrinks() {
		return this.drinks.length
	}
	
	static fromJSON(object) {
		if (object.bath) {
			object.bath = Bath.fromJSON(object.bath)
		}
		if (object.vitamin) {
			object.vitamin = Vitamin.fromJSON(object.vitamin)
		}
		if (object.vomit) {
			object.vomit = object.vomit.map(v=>Vomit.fromJSON(v))
		}
		object.drinks = object.drinks.map(d=>Drink.fromJSON(d))
		object.changes = object.changes.map(c=>Change.fromJSON(c))
		return Object.assign(new Day(), object)
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
	
	static fromJSON(object) {
		return Object.assign(new Change(), object)
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
		this.leftVolume = 0
	}
	
	get drankVolume() {
		return this.totalVolume - this.leftVolume
	}
	
	static fromJSON(object) {
		return Object.assign(new Drink(), object)
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
	
	static fromJSON(object) {
		return new Bath(object.time,object.soap)
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
	
	static fromJSON(object) {
		return new Vitamin(object.time,object.drops)
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
	
	static fromJSON(object) {
		return new Vomit(object.time,object.comments)
	}
}

class Options {
	constructor(defaults) {
		this.defaults = {
			volume: DEFAULT_VOLUME,
			drops: DEFAULT_DROPS
		}
		if (defaults) {
			Object.assign(this.defaults, defaults)
		}
	}

	static fromJSON(object) {
		if (!object) {
			return new Options()
		} else if (object.defaults) {
			return new Options(object.defaults)
		} else {
			return new Options()
		}
	}
}
