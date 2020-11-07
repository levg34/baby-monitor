axios.get('/languages').then(response => {
	// Ready translated locale messages
	const messages = response.data

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
		i18n
	}).$mount('#main')

	new Vue({
		i18n
	}).$mount('#footer')
}).catch(function (error) {
	// handle error
	console.log(error)
})
