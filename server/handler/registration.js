(function(){
	/* Database Imports */
	const {
		findLevelDBdata
	} = require('../helper/dbHelper.js')
	const conv = require('binstring')
	/* Database Imports Ends*/
	module.exports = function(userData,blockchain){
		return (req,res)=>{
			const requestBody = req.body
			// Handle when no request body is sent by the server
			if (!requestBody || !requestBody.address || !requestBody.star) {
				return res.status(400).send({
					error: 'Required information not found!'
				})
			}

			const { address, star } = requestBody

	
			if(!star.rightAscension || !star.declination || !star.story){
				return res.status(400).send({
					error: `
						Followinng Attributes are Required!
						* rightAscension
						* declination
						* story
					`
				})
			}

			findLevelDBdata(userData,address)
				.then(({found, request, key}) => {

					if(!found || !request.requestExpiry > new Date().getTime()){
						return res.status(401).send({
							error: `You don't have a valid Validation Request. A validation request is just valid for next 5 minutes.`  // eslint-disable-line
						})
					}

					if(request.status.messageSignature === 'unavailable'){
						return res.status(401).send({
							error: `You first need to verify the message signature with your blockchain address`  // eslint-disable-line
						})
					}

					if(request.status.messageSignature === 'invalid'){
						return res.status(401).send({
							error: `The message signature you provided for verification is not valid`  // eslint-disable-line
						})
					}


					const starBody = {
						rightAscension: star.rightAscension,
						declination: star.declination,
						story: conv(star.story, { in: 'binary', out: 'hex'}),
						constellation: star.constellation || null,
						magnitude: star.magnitude || null
					}

					blockchain.addBlock({ address, star: starBody })
						.then(block => {
							userData.del(key)
								.then(()=> res.json(block))
						})
				})
		}
	}
}())