(function () {
	const http = require('http')
	const express = require('express')
	const Blockchain = require('./server/helper/Blockchain')
	const app = express()
	const bodyParser = require('body-parser')
	app.use(bodyParser.json())
	const server = http.createServer(app)
	const PORT = process.env.APP_PORT || process.env.PORT || 8000
	const blockchain = new Blockchain()
	blockchain.init()
		.then(chain=>{
			server.listen(PORT,()=>{
				console.log(`app listening on port ${PORT}!`) // eslint-disable-line
				require('./server/routes')(app, chain)
			})
		})
}())