(function(){
	/* Database Imports */
	const {
		addDataToLevelDB,
		findLevelDBdata
	} = require('../helper/dbHelper.js')
	/* Database Imports Ends*/
	module.exports = function(userData){
		const timeout = require('./../helper/Timeout.js')(userData)
		const ValidationRequest = require('./../model/ValidationRequest')
		return (req,res) => {
			const requestBody = req.body
			// Handle when no request body is sent by the server
			if (!requestBody || !requestBody.address) {
				return res.status(400).send({
					error: 'Required information not found!'
				})
			}
			const { address } = requestBody
			findLevelDBdata(userData,address)
				.then(({found, request}) => {
					if(found && request.requestExpiry > new Date().getTime()){
						return res.json(request)
					}
					request = JSON.stringify(new ValidationRequest(address))
					addDataToLevelDB(userData,request)
						.then(key=>{
							timeout(key)
							return res.json(JSON.parse(request))
						})
						.catch(() => res.status(503).send({
							error: 'Unable to create a Validation Request'
						}))
				})
		}
	}

}())