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
			}
		}
	}).$mount('#nav')

	new Vue({
		i18n,
		data: {
			selectedDay: null,
			days: [],
			modalTime: '00:00',
			modalPee: true,
			modalPoo: false
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
			loadChangeModal() {
				this.modalTime = now()
				this.modalPee = true
				this.modalPoo = false
				let today = moment().format('YYYY-MM-DD')
				if (this.hasDataToday()) {
					this.loadDay(today)
				} else {
					this.selectedDay = new Day()
				}
			},
			addChange() {
				let newChange = new Change(this.modalTime,this.modalPoo)
				if (!this.modalPee) {
					newChange.pee = false
				}
				this.selectedDay.addChange(newChange)
				this.saveDay()
			},
			saveDay() {
				$('#changeModal').modal('hide')
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
