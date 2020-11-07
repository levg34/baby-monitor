// Ready translated locale messages
const messages = {
	en: {
		english_name: 'english',
		image: 'english.png',
		jumbo: {
			title: 'Baby monitor',
			subtitle: 'Follow up your baby needs!'
		},
		nav: {
			add: 'Add...',
			add_drink: 'Add drink',
			add_change: 'Add change',
			weight: 'Weight',
			height: 'Height',
			bath: 'Bath',
			vitamin: 'Vitamin',
			vomit: 'Vomit',
			export: 'Export',
			print: 'Print',
			language: 'Language'
		},
		main: {
			title1: 'Most used features',
			title2: 'Select day',
			subtitle2: 'Select the day you want to view',
			today: 'Today',
			yesterday: 'Yesterday',
			before: 'Before',
			date: 'Date',
			drinks: 'Drinks',
			time: 'Time',
			volume_served: 'Volume served',
			volume_drunk: 'Volume drunk',
			changes: 'Changes',
			pee: 'Pee',
			poo: 'Poo'
		},
		footer: {
			made_by: 'Made by'
		}
	},
	ja: {
		english_name: 'japanese',
		image: 'japanese.png',
		jumbo: {
			title: 'ベビーモニター',
			subtitle: '赤ちゃんの事をフォローアップ!'
		},
		nav: {
			language: '言語'
		}
	},
	fr: {
		english_name: 'french',
		image: 'french.png',
		jumbo: {
			title: 'Statistiques de bébé',
			subtitle: 'Suivez les besoins de votre bébé au jour le jour !'
		},
		nav: {
			add: 'Ajouter...',
			add_drink: 'Ajouter tétée',
			add_change: 'Ajouter change',
			weight: 'Poids',
			height: 'Taille',
			bath: 'Bain',
			vitamin: 'Vitamine',
			vomit: 'Vomi',
			export: 'Exporter',
			print: 'Imprimer',
			language: 'Langue'
		},
		main: {
			title1: 'Les plus utilisés',
			title2: 'Selectionner un jour',
			subtitle2: 'Selectionner un jour pour le voir plus en détail.',
			today: 'Aujourd\'hui',
			yesterday: 'Hier',
			before: 'Avant',
			date: 'Date',
			drinks: 'Tétées',
			time: 'Heure',
			volume_served: 'Volume préparé',
			volume_drunk: 'Volume bu',
			changes: 'Changes',
			pee: 'Pipi',
			poo: 'Caca'
		},
		footer: {
			made_by: 'Auteur :'
		}
	},
	es: {
		english_name: 'spanish',
		image: 'spanish.png',
		jumbo: {
			title: 'Monitor del bebe',
			subtitle: '¡Haga un seguimiento de las necesidades de su bebé!'
		},
		nav: {
			language: 'Idioma'
		}
	},
	de: {
		english_name: 'german',
		image: 'german.png',
		jumbo: {
			title: 'Babyüberwachung',
			subtitle: 'Verfolgen Sie die Bedürfnisse Ihres Babys!'
		},
		nav: {
			language: 'Sprache'
		}
	}
}

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
