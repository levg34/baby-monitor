const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')

const fs = require('fs')

const Datastore = require('nedb')

const db = {}
db.data = new Datastore({ filename: 'data/datafile', autoload: true })
db.options = new Datastore({ filename: 'data/options', autoload: true })

db.data.ensureIndex({ fieldName: 'date', unique: true }, function (err) {
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
	db.data.findOne({ date: day }, function (err, doc) {
		res.json(doc)
	})
})

app.post('/day', (req, res) => {
	let day = req.body
	if (day._id) {
		// update
		db.data.update({ _id: day._id }, day, {}, function (err, numReplaced) {
			//if (numReplaced === 1)
			res.json(day)
		});
	} else {
		// insert
		db.data.insert(day, function (err, newDay) {
			res.json(newDay)
		})
	}
})

app.get('/days', (req, res) => {
	db.data.find({}, { date: 1, _id: 0 }).sort({date: -1}).exec(function (err, docs) {
		res.json(docs.map(d=>d.date))
	})
})

app.get('/days/all', (req, res) => {
	db.data.find({}, { _id: 0 }).sort({date: 1}).exec(function (err, docs) {
		res.json(docs)
	})
})

app.get('/days/:from/:to', (req, res) => {
	let from = req.params.from
	let to = req.params.to
	db.data.find({$and:[{"date": { $gte: from }}, {"date": { $lte: to }}]}, { _id: 0 }).sort({date: 1}).exec(function (err, docs) {
		res.json(docs)
	})
})

app.get('/options', (req, res) => {
	db.options.findOne({}, {_id: 0}, function (err, doc) {
		res.json(doc)
	})
})

app.post('/options', (req, res) => {
	let options = req.body
	db.options.findOne({}, function (err, doc) {
		if (doc && doc._id) {
			// update
			db.options.update({ _id: doc._id }, options, {}, function (err, numReplaced) {
				res.json(options)
			});
		} else {
			// insert
			db.options.insert(options, function (err, newOptions) {
				res.json(newOptions)
			})
		}
	})
})

app.listen(port, () => {
	console.log(`baby-monitor app listening at http://localhost:${port}`)
})
