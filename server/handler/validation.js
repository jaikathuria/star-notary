(function(){
	/* Database Imports */
	const level = require('level')
	const userDB = './userDB'
	const userData = level(userDB)
	const { blockData,
        addLevelDBData,
        getLevelDBData,
        countLevelDBData,
        addDataToLevelDB,
        findLevelDBdata
      } = require('../helper/dbHelper.js')
	/* Database Imports Ends*/
	const ValidationRequest = require('./../model/ValidationRequest')
	module.exports = function(){
		return (req,res) => {
			const requestBody = req.body;
		    // Handle when no request body is sent by the server
		    console.log({requestBody})
		    if (!requestBody || !requestBody.address) {
		        res.status(400).send({
		            error: `body information not found!`
		        });
		    }
		    console.log(0)
		    const address = requestBody.address
		    findLevelDBdata(userData,address)
		    	.then(({found, request}) => {
		    		console.log(1)
		    		if(found && request.requestExpiry > new Date().getTime()){
		    			console.log(2)
		    			return res.json(request)
		    		}
		    		request = JSON.stringify(new ValidationRequest(address))
		    		addDataToLevelDB(userData,request)
		    			.then(()=>{
		    				console.log(4)
		    				return res.json(JSON.parse(request))
		    			})

		    	})
		}
	}

}())