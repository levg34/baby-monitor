// Ready translated locale messages
const messages = {
	en: {
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
			date: 'Date'
		},
		footer: {
			made_by: 'Made by'
		}
	},
	ja: {
		jumbo: {
			title: 'ベビーモニター',
			subtitle: '赤ちゃんの事をフォローアップ!'
		}
	},
	fr: {
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
			language: 'Language'
		},
		main: {
			title1: 'Les plus utilisés',
			title2: 'Selectionner un jour',
			subtitle2: 'Selectionner un jour pour le voir plus en détail.',
			today: 'Aujourd\'hui',
			yesterday: 'Hier',
			before: 'Avant',
			date: 'Date'
		},
		footer: {
			made_by: 'Auteur :'
		}
	},
	es: {
		jumbo: {
			title: 'Monitor del bebe',
			subtitle: '¡Haga un seguimiento de las necesidades de su bebé!'
		}
	},
	de: {
		jumbo: {
			title: 'Babyüberwachung',
			subtitle: 'Verfolgen Sie die Bedürfnisse Ihres Babys!'
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
		language: i18n.locale
	},
	methods: {
		setLocale: function (locale) {
			this.language = locale
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
