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
			days: []
		},
		mounted() {
			axios.get('/days').then(response => {
				let days = response.data
				if (days.length > 0) {
					this.days = days
					let lastDay = [...days].pop()
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
					this.selectedDay = response.data
				})
			}
		}
	}).$mount('#main')

	new Vue({
		i18n
	}).$mount('#footer')
})
