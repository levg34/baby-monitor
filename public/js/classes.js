let DEFAULT_VOLUME = 170
let DEFAULT_DROPS = 3

class Day {
	constructor(date) {
		if (date) {
			this.date = date
		} else {
			this.date = TimeUtils.today()
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
		return this.drinks.map(d => d.drankVolume).reduce((a,b)=>a+b,0)
	}

	totalServedVolume() {
		return this.drinks.map(d => d.totalVolume).reduce((a,b)=>a+b,0)
	}

	averageDrankVolume() {
		return this.drinks.map(d => d.drankVolume).reduce((a,b)=>a+b,0) / this.drinks.length
	}
	
	didPoo() {
		return this.changes.map(c => c.poo).reduce((a,b)=>a+b,0) > 0
	}

	totalPoo() {
		return this.changes.map(c => c.poo).map(Number).filter(Boolean).length
	}
	
	totalDrinks() {
		return this.drinks.length
	}

	sort() {
		let sortByTime = (a,b) => a.time > b.time ? 1 : -1
		this.drinks.sort(sortByTime)
		this.changes.sort(sortByTime)
		if (this.vomit instanceof Array) {
			this.vomit.sort(sortByTime)
		}
		return this
	}
	
	static fromJSON(object) {
		if (object.weight) {
			object.weight = Number.parseInt(object.weight)
		}
		if (object.height) {
			object.height = Number.parseInt(object.height)
		}
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
			this.time = TimeUtils.now()
		}
		this.pee = true
		this.poo = poo || 0
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
			this.time = TimeUtils.now()
		}
		if (volume) {
			this.totalVolume = Number.parseInt(volume)
		} else {
			this.totalVolume = DEFAULT_VOLUME
		}
		this.leftVolume = 0
	}
	
	get drankVolume() {
		return this.totalVolume - this.leftVolume
	}
	
	static fromJSON(object) {
		object.totalVolume = Number.parseInt(object.totalVolume)
		object.leftVolume = Number.parseInt(object.leftVolume)
		return Object.assign(new Drink(), object)
	}
}

class Bath {
	constructor(time,soap) {
		if (time) {
			this.time = time
		} else {
			this.time = TimeUtils.now()
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
			this.time = TimeUtils.now()
		}
		this.drops = Number.parseInt(drops)
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
			this.time = TimeUtils.now()
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
