const express = require('express')
const app = express()
const port = 8080

const fs = require('fs')

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
			/*fs.readFile(i18nDir+'/'+file, (err, data) => {
				if (err) res.json({error:err})
				let langData = JSON.parse(data)
				let langName = file.split(file.substr(0, file.lastIndexOf('.')))
				messages[langName] = langData
			})*/
			let data = fs.readFileSync(i18nDir+'/'+file)
			let langData = JSON.parse(data)
			let langName = file.substr(0, file.lastIndexOf('.'))
			messages[langName] = langData
		})
		
		res.json(messages)
	})
})

app.listen(port, () => {
	console.log(`baby-monitor app listening at http://localhost:${port}`)
})
