let messages

axios.get('/languages').then(response => {
	// Ready translated locale messages
	messages = response.data
}).catch(function (error) {
	// handle error
	console.log(error)
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
			modalDrops: 0
		},
		mounted() {
			axios.get('/days').then(response => {
				let days = response.data
				if (days.length > 0) {
					this.days = days
					let lastDay = days[0]
					this.loadDay(lastDay)
				}
			})
		},
		methods: {
			localeDate: function (date) {
				return moment(date).locale(i18n.locale).format('L')
			},
			hasDataToday() {
				return this.days.includes(moment().format('YYYY-MM-DD'))
			},
			loadDay(day) {
				axios.get('/day/'+day).then(response => {
					this.selectedDay = Day.fromJSON(response.data)
				})
			},
			loadModal(modalName) {
				this.openedModal = modalName
				this.modalTime = now()
				this.modalPee = true
				this.modalPoo = false
				this.modalTotalVolume = DEFAULT_VOLUME
				this.modalLeftVolume = 0
				this.modalSoap = false
				this.modalComments = ''
				this.modalDrops = DEFAULT_DROPS
				let today = moment().format('YYYY-MM-DD')
				if (this.hasDataToday()) {
					this.loadDay(today)
				} else {
					this.selectedDay = new Day()
				}
			},
			add() {
				switch (this.openedModal) {
					case 'change':
						let newChange = new Change(this.modalTime,this.modalPoo)
						if (!this.modalPee) {
							newChange.pee = false
						}
						this.selectedDay.addChange(newChange)
						break;
					case 'drink':
						let newDrink = new Drink(this.modalTime,this.modalTotalVolume)
						if (this.modalLeftVolume) {
							newDrink.leftVolume = this.modalLeftVolume
						}
						this.selectedDay.addDrink(newDrink)
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
					case 'vitamin':
						let newVitamin = new Vitamin(this.modalTime,this.modalDrops)
						this.selectedDay.setVitamin(newVitamin)
						break;
					default:
						console.error('Cannot open modal for '+this.openedModal)
						break;
				}
				
				this.saveDay()
				$('#addModal').modal('hide')
				this.openedModal = null
			},
			saveDay() {
				axios.post('/day',this.selectedDay).then(response => {
					this.selectedDay = Day.fromJSON(response.data)
					this.loadDays()
				})
			},
			loadDays() {
				axios.get('/days').then(response => {
					let days = response.data
					if (days.length > 0) {
						this.days = days
					}
				})
			}
		}
	}).$mount('#main')

	new Vue({
		i18n
	}).$mount('#footer')
})
