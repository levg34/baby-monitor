const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')

const fs = require('fs')

const Datastore = require('nedb')

const db = new Datastore({ filename: 'data/datafile', autoload: true })

db.ensureIndex({ fieldName: 'date', unique: true }, function (err) {
	if (err) console.log(err)
})

app.use(express.static('public'))

app.use(bodyParser.json())

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
	})
})

app.post('/day', (req, res) => {
	let day = req.body
	if (day._id) {
		// update
		db.update({ _id: day._id }, day, {}, function (err, numReplaced) {
			//if (numReplaced === 1)
			res.json(day)
		});
	} else {
		// insert
		db.insert(day, function (err, newDay) {
			res.json(newDay)
		})
	}
})

app.get('/days', (req, res) => {
	db.find({}, { date: 1, _id: 0 }, function (err, docs) {
		res.json(docs.map(d=>d.date))
	})
})

app.listen(port, () => {
	console.log(`baby-monitor app listening at http://localhost:${port}`)
})
