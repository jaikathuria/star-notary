(function(){
	const conv = require('binstring')
	module.exports = function(blockchain){
		return (req,res) => {
			const { height } = req.params
			if(!height){
				return res.status(404).send({
					error: 'Block number is needed for the Lookup'
				})
			}
			blockchain.getBlock(height)
				.then(block => {
					if(!block) {
						return res.status(404).send({ error: `Block number ${height} not found!` })
					}
					block.body.star.story = conv(block.body.star.story, {in: 'hex', out: 'binary'})
					return res.json(block)
				})
		}
	}
}())