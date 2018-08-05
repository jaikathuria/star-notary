(function () {
	const level = require('level')
	const userDB = './userDB'
	const userData = level(userDB)
	module.exports = function (app, blockchain){
		// Import Route Handlers
		const requestValidation = require('../handler/request-validation')(userData)
		const validation = require('../handler/validation')(userData)
		const registration = require('../handler/registration')(userData,blockchain)
		const blockLookup = require('../handler/block-lookup')(blockchain)
		const hashLookup = require('../handler/hash-lookup')(blockchain)
		const addressLookup = require('../handler/address-lookup')(blockchain)
		// Routes
		app.get('/block/:height',blockLookup)
		app.get('/stars/hash::hash',hashLookup)
		app.get('/stars/address::address',addressLookup)
		app.post('/requestValidation$',requestValidation)
		app.post('/message-signature/validate$',validation)
		app.post('/block$',registration)

	}
}())