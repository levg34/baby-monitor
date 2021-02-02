let messages

axios.get('/languages').then(response => {
	// Ready translated locale messages
	messages = response.data
}).catch(function (error) {
	// handle error
	console.error(error)
	messages = {}
}).then(function () {
	// Create VueI18n instance with options
	const i18n = new VueI18n({
		locale: 'fr', // set locale
		messages, // set locale messages
	})
	
	// Create a Vue instance with `i18n` option
	new Vue({
		i18n
	}).$mount('#jumbo')

	new Vue({
		i18n,
		data: {
			languages: Object.keys(messages).map(lang => Object.create({locale:lang,name:messages[lang].english_name,image:messages[lang].image}))
		},
		methods: {
			setLocale: function (locale) {
				i18n.locale = locale
			},
			loadModal(modalName) {
				mainVue.loadModal(modalName)
			},
			loadOptionsModal() {
				mainVue.loadOptionsModal()
			},
			showStatistics() {
				statisticsView.show()
			},
			toggleDelete() {
				if (mainVue.mode === 'normal') {
					this.switchMode('delete')
				} else {
					this.switchMode('normal')
				}
			},
			switchMode(mode) {
				mainVue.switchMode(mode)
			}
		}
	}).$mount('#nav')

	var mainVue = new Vue({
		i18n,
		data: {
			selectedDay: null,
			days: [],
			modalTime: '00:00',
			modalPee: true,
			modalPoo: false,
			openedModal: null,
			modalTotalVolume: 0,
			modalLeftVolume: 0,
			modalSoap: false,
			modalComments: '',
			modalDrops: 0,
			modalVitamin: false,
			options: null,
			modalDefaultVolume: 0,
			modalDefaultDrops: 0,
			modalWeight: 0,
			modalHeight: 0,
			modalPooLevel: 0,
			showLess: true,
			modalDayToAdd: 'today',
			errors: [],
			modalErrors: [],
			optionsModalErrors: [],
			mode: 'normal',
			mealtypes: Meal.mealtypes,
			modalMealType: null,
			modalMealContents: null,
			soapDay: false
		},
		mounted() {
			this.loadDays()
			this.loadOptions()
		},
		methods: {
			localeDate: function (date) {
				return TimeUtils.localeDate(date,i18n.locale)
			},
			hasDataToday() {
				return this.days.includes(TimeUtils.today())
			},
			needSoap(day) {
				let daysCycle = 2
				let nDaysAgo = TimeUtils.nDaysFrom(day,daysCycle)
				axios.get('/days/'+nDaysAgo+'/'+day).then(response => {
					let days =  response.data
					let soapOK = days.filter(day=>day.bath && day.bath.soap).length > 0
					this.soapDay = !soapOK
				}).catch(err => {
					this.errors.push(err)
				})
			},
			loadDay(day) {
				this.errors = []
				axios.get('/day/'+day).then(response => {
					if (response.data) {
						this.selectedDay = Day.fromJSON(response.data).sort()
						this.needSoap(day)
					} else if (day == TimeUtils.today()) {
						this.selectedDay = new Day()
					} else {
						this.errors.push('Day '+day+' not found in database.')
					}
				}).catch(err=>{
					this.errors.push(err)
				})
			},
			loadOptions() {
				this.errors = []
				axios.get('/options').then(response => {
					this.options = Options.fromJSON(response.data)
				}).catch(err=>{
					this.errors.push(err)
				})
			},
			loadModal(modalName) {
				this.openedModal = modalName
				this.modalTime = TimeUtils.now()
				this.modalPee = true
				this.modalPoo = false
				this.modalTotalVolume = this.options.defaults.volume
				this.modalLeftVolume = 0
				this.modalSoap = false
				this.modalComments = this.openedModal === 'comments' ? this.selectedDay.comments : ''
				this.modalDrops = this.options.defaults.drops
				this.modalVitamin = false
				this.modalWeight = 0
				this.modalHeight = 0
				this.modalPooLevel = 2
				this.modalDayToAdd = 'today'
				this.modalErrors = []
				this.modalMealType = 'other'
				this.modalMealContents = ''
				this.loadDay(TimeUtils.today())
			},
			add() {
				this.backupDay()
				switch (this.openedModal) {
					case 'change':
						let newChange = new Change(this.modalTime)
						if (this.modalPoo) {
							newChange.poo = Number.parseInt(this.modalPooLevel)
						}
						if (!this.modalPee) {
							newChange.pee = false
						}
						this.selectedDay.addChange(newChange)
						break;
					case 'drink':
						let newDrink = new Drink(this.modalTime,this.modalTotalVolume)
						if (this.modalLeftVolume) {
							newDrink.leftVolume = new Number(this.modalLeftVolume)
						}
						this.selectedDay.addDrink(newDrink)
						if (!this.modalVitamin) {
							break;
						}
					case 'vitamin':
						let newVitamin = new Vitamin(this.modalTime,this.modalDrops)
						this.selectedDay.setVitamin(newVitamin)
						break;
					case 'bath':
						let newBath = new Bath(this.modalTime,this.modalSoap)
						this.selectedDay.setBath(newBath)
						break;
					case 'vomit':
						let newVomit = new Vomit(this.modalTime)
						if (this.modalComments) {
							newVomit.comments = this.modalComments
						}
						this.selectedDay.addVomit(newVomit)
						break;
					case 'weight':
						this.selectedDay.weight = Number.parseInt(this.modalWeight)
						break
					case 'height':
						this.selectedDay.height = Number.parseInt(this.modalHeight)
						break
					case 'comments':
						this.selectedDay.comments = this.modalComments
						break
					case 'meal':
						let newMeal = new Meal(this.modalMealType,this.modalMealContents)
						if (this.modalComments) {
							newMeal.comments = this.modalComments
						}
						this.selectedDay.addMeal(newMeal)
						break
					default:
						this.errors.push('Cannot write data for '+this.openedModal)
						break;
				}
				
				this.saveDay()
			},
			saveDay() {
				this.modalErrors = []
				axios.post('/day',this.selectedDay.sort()).then(response => {
					if (this.mode === 'delete') {
						this.mode = 'normal'
					}
					// if mode === 'add'
					$('#addModal').modal('hide')
					this.openedModal = null
					this.loadDays()
				}).catch(err => {
					this.modalErrors.push(err)
					this.restoreDay()
				})
			},
			backupDay() {
				this.backupedDay = Day.fromJSON({...this.selectedDay})
			},
			restoreDay() {
				this.selectedDay = Day.fromJSON({...this.backupedDay})
			},
			deleteElement(element,index) {
				this.backupDay()
				if (element === 'day') {
					this.errors.push('Cannot remove day (yet)')
				} else if (index || index === 0) {
					this.selectedDay[element].splice(index, 1)
				} else {
					this.selectedDay[element] = null
				}
				this.saveDay()
			},
			switchMode(mode) {
				if (mode) {
					this.mode = mode
				} else {
					this.mode = null
				}
			},
			loadDays() {
				this.errors = []
				axios.get('/days').then(response => {
					let days = response.data
					if (days.length > 0) {
						this.days = days
						let lastDay = days[0]
						this.loadDay(lastDay)
					}
				}).catch(err => {
					this.errors.push(err)
				})
			},
			loadOptionsModal() {
				this.loadOptions()
				this.modalDefaultDrops = this.options.defaults.drops
				this.modalDefaultVolume = this.options.defaults.volume
			},
			saveOptions() {
				this.optionsModalErrors = []
				axios.post('/options',{defaults:{
					volume: this.modalDefaultVolume,
					drops: this.modalDefaultDrops
				}}).then(response => {
					this.loadOptions()
					$('#optionsModal').modal('hide')
				}).catch(err => {
					this.optionsModalErrors.push(err)
				})
			},
			alreadyExists(dataType,time) {
				let res = null
				switch (dataType) {
					case 'change':
						res = this.selectedDay.changes.find(change=>change.time == time)
						break
					case 'drink':
						res = this.selectedDay.drinks.find(drink=>drink.time == time)
						break
					case 'vitamin':
						res = this.selectedDay.vitamin
						break
					case 'bath':
						res = this.selectedDay.bath
						break
					case 'vomit':
						if (this.selectedDay.vomit instanceof Array) {
							res = this.selectedDay.vomit.find(vomit=>vomit.time == time)
						}
						break
					case 'weight':
						if (this.selectedDay.weight) {
							res = `${this.selectedDay.weight} g`
						}
						break
					case 'height':
						if (this.selectedDay.height) {
							res = `${this.selectedDay.height} cm`
						}
						break
					case null:
						break
					case 'comments':
						break
					case 'meal':
						res = this.selectedDay.meals.find(meal=>meal.time == time)
						break
					default:
						res = 'Cannot write data for '+dataType
						this.errors.push(res)
						break
				}

				return res
			},
			timeOverNow() {
				return this.modalTime > TimeUtils.now()
			},
			loadSelectedDay() {
				if (this.modalDayToAdd === 'yesterday' && this.selectedDay.date != TimeUtils.dayBefore()) {
					this.loadDay(TimeUtils.dayBefore())
				} else if (this.modalDayToAdd === 'today' && this.selectedDay.date != TimeUtils.today()) {
					this.loadDay(TimeUtils.today())
				}
			}
		}
	}).$mount('#main')

	let statisticsView = new Vue({
		i18n,
		data: {
			daysData: null,
			dataSpan: 'week',
			charts: [],
			visible: false
		},
		mounted() {
			Chart.scaleService.updateScaleDefaults('linear', {
				ticks: {
					min: 0
				}
			});
		},
		methods: {
			show() {
				this.visible = !this.visible
				if (this.visible) {
					this.getDaysData(this.dataSpan)
				}
			},
			getDaysData(interval) {
				let displayGraph = response => {
					this.daysData = response.data
					if (response.data) {
						this.createGraph()
					}
				}

				if (interval instanceof Object && interval.to && interval.from) {
					axios.get('/days/'+interval.from+'/'+interval.to).then(displayGraph).catch(err => {
						console.error(err)
					})
				} else if (interval === 'today') {
					this.getDaysData({
						from: TimeUtils.dayBefore(),
						to: TimeUtils.today()
					})
				} else if (interval === 'week') {
					let week = TimeUtils.oneWeekInterval()
					this.getDaysData({
						from: week[0],
						to: week[1]
					})
				} else {
					axios.get('/days/all').then(displayGraph).catch(err => {
						console.error(err)
					})
				}
			},
			clearCharts() {
				this.charts.forEach(chart => {
					chart.destroy()
				})
			},
			createGraph() {
				this.clearCharts()
				this.charts.push(new Chart(document.getElementById('drinkVolumePerDayChart').getContext('2d'), {
					// The type of chart we want to create
					type: 'line',

					// The data for our dataset
					data: {
						labels: this.daysData.map(d=>mainVue.localeDate(d.date)),
						datasets: [
							{
								label: this.$t("main.volume_drunk"),
								borderColor: 'rgb(255, 99, 132)',
								data: this.daysData.map(d=>Day.fromJSON(d).totalDrankVolume())
							},
							{
								label: this.$t("main.volume_served"),
								borderColor: 'rgb(77, 166, 255)',
								data: this.daysData.map(d=>Day.fromJSON(d).totalServedVolume())
							},
							{
								label: this.$t("main.volume_drunk")+' ('+this.$t("statistics.average")+')',
								borderColor: 'rgb(61,255,74)',
								data: this.daysData.map(d=>Day.fromJSON(d).averageDrankVolume())
							}
						]
					},

					// Configuration options go here
					options: {}
				}))

				this.charts.push(new Chart(document.getElementById('drinksPerDayChart').getContext('2d'), {
					// The type of chart we want to create
					type: 'bar',

					// The data for our dataset
					data: {
						labels: this.daysData.map(d=>mainVue.localeDate(d.date)),
						datasets: [
							{
								label: this.$t("main.drinks"),
								backgroundColor: 'rgb(255, 99, 132)',
								data: this.daysData.map(d=>d.drinks.length)
							}
						]
					},

					// Configuration options go here
					options: {}
				}))

				this.charts.push(new Chart(document.getElementById('changesPerDayChart').getContext('2d'), {
					// The type of chart we want to create
					type: 'bar',

					// The data for our dataset
					data: {
						labels: this.daysData.map(d=>mainVue.localeDate(d.date)),
						datasets: [
							{
								label: this.$t("main.changes"),
								backgroundColor: 'rgb(255, 99, 132)',
								data: this.daysData.map(d=>d.changes.length)
							},
							{
								label: this.$t("main.poo"),
								backgroundColor: 'rgb(77, 166, 255)',
								data: this.daysData.map(d=>Day.fromJSON(d).totalPoo())
							}
						]
					},

					// Configuration options go here
					options: {}
				}))
			}
		}
	}).$mount('#statistics')

	new Vue({
		i18n
	}).$mount('#footer')
})
