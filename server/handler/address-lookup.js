(function(){
	const conv = require('binstring')
	module.exports = function(blockchain){
		return (req,res) => {
			const { address } = req.params
			if(!address){
				return res.status(404).send({
					error: 'Address is needed for the Lookup'
				})
			}	
			new Promise((resolve)=>{
				const blocks = []
				blockchain.blockData.createValueStream()
					.on('data', data => {
						data = JSON.parse(data)
						if(data.hash && data.body && data.body.address === address){
							data.body.star.story = conv(data.body.star.story, {in: 'hex', out: 'binary'})
							blocks.push(data)
						}
					})
					.on('close', () => {
						resolve(blocks)
					})

			})
				.then(block => {
					return res.json(block)
				})
		}
	}
}())

