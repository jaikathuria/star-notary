(function(){
	const conv = require('binstring')
	module.exports = function(blockchain){
		return (req,res) => {
			const { hash } = req.params
			if(!hash){
				return res.status(404).send({
					error: 'Hash is needed for the Lookup'
				})
			}

			new Promise((resolve)=>{
				blockchain.blockData.createValueStream()
					.on('data', data => {
						data = JSON.parse(data)
						if(data.hash && data.hash === hash){
							data.body.star.story = conv(data.body.star.story, {in: 'hex', out: 'binary'})
							resolve(data)
						}
					})

					.on('close', () => {
						resolve(undefined)
					})
			})
				.then(block => {
					if(!block){
						return res.status(404).send({ error: `No block found find hash: ${hash}` }) // eslint-disable-line
					}
					return res.json(block)
				})

		}
	}
}())

