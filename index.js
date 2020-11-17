const express = require('express')
const app = express()
const port = 8080

const fs = require('fs')

const Datastore = require('nedb')

const db = new Datastore({ filename: 'data/datafile', autoload: true })

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile('view/index.html', { root: __dirname })
})

app.get('/languages', (req, res) => {
	let i18nDir = 'i18n'
	
	fs.readdir(i18nDir, (err, files) => {
		if (err) {
			res.json({error:err})
		}
		
		let messages = {}

		files.forEach(file => {
			let data = fs.readFileSync(i18nDir+'/'+file)
			let langData = JSON.parse(data)
			let langName = file.substr(0, file.lastIndexOf('.'))
			messages[langName] = langData
		})
		
		res.json(messages)
	})
})

app.get('/day/:day', (req, res) => {
	let day = req.params.day
	db.findOne({ date: day }, function (err, doc) {
		res.json(doc)
	});
})

app.get('/days', (req, res) => {
	db.find({}, function (err, docs) {
		res.json(docs.map(d=>d.date))
	});
})

app.listen(port, () => {
	console.log(`baby-monitor app listening at http://localhost:${port}`)
})
