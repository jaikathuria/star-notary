(function () {
	const level = require('level')
	const userDB = './userDB'
	const userData = level(userDB)
	module.exports = function (app, blockchain){
		// Import Route Handlers
		const requestValidation = require('../handler/request-validation')(userData)
		const validation = require('../handler/validation')(userData)
		// Routes
		app.post('/requestValidation$',requestValidation)
		app.post('/message-signature/validate$',validation)
	}
}())