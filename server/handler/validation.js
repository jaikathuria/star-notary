(function(){
	/* Database Imports */
	const {
		addLevelDBData,
		findLevelDBdata
	} = require('../helper/dbHelper.js')
	/* Database Imports Ends*/
	const bitcoin = require('bitcoinjs-lib')  // eslint-disable-line
	const bitcoinMessage = require('bitcoinjs-message')
	module.exports = function(userData){
		return (req,res) => {
			const requestBody = req.body
			// Handle when no request body is sent by the server
			if (!requestBody || !requestBody.address || !requestBody.signature) {
				return res.status(400).send({
					error: 'Required information not found!'
				})
			}

			const { address, signature } = requestBody
			findLevelDBdata(userData,address)
				.then(({found, request, key})=>{
					if(!found || !request.requestExpiry > new Date().getTime()){
						return res.status(401).send({
							error: `You don't have a valid Validation Request. A validation request is just valid for next 5 minutes.`  // eslint-disable-line
						})
					}
					const isVerified = bitcoinMessage.verify(request.message, request.address, signature)
					request.status.messageSignature =  isVerified ? 'valid' : 'invalid'
					request.status.starRegistrationRequest = isVerified ? 'granted' : 'denied'
					addLevelDBData(userData,key,JSON.stringify(request))
						.then(()=>{
							res.json(request)
						})
				})
		}
	}

}())