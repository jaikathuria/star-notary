(function () {
	module.exports = function (app, blockchain){
		// Import Route Handlers
		const validation = require('../handler/validation')()
		// Routes
		app.post('/requestValidation$',validation)
	}
}())