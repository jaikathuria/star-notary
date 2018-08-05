(function(){
	const level = require('level')
	const chainDB = './BlockchainDB'
	const blockData = level(chainDB)
	const Block = require('./../model/Block')
	const SHA256 = require('crypto-js/sha256')
	const { addLevelDBData,
		getLevelDBData,
		countLevelDBData
	} = require('./dbHelper.js')

	module.exports = class Blockchain{

		constructor(){
			this.blockData = blockData
		}

		init(){
			return this.getBlockHeight()
				.then(height => {
					if(height === 0) {
						return this.addGenesisBlock()
							.then(() => this)
					}
					return this
				})
		}
		_createBlock(data,height){
			const block = new Block(data)
			return this._getPreviousHash(height)
				.then(previousHash => {
					block.previousBlockHash = previousHash
					block.time = new Date().getTime().toString().slice(0,-3)
					block.height = height
					block.hash = SHA256(JSON.stringify(block)).toString()
					return block
				})
		}

		_getPreviousHash(height){
			return getLevelDBData(blockData,height-1)
				.then(data => JSON.parse(data))
				.then(block => block.hash)
				.catch(() => {
					return ''
				})
		}

		addGenesisBlock(){
			return this.addBlock('First block in the chain - Genesis block')
				.then(() => true)
				.catch(() => false)
		}
		
		addBlock(data){
			return this.getBlockHeight()
				.then(height => { 
					return this._createBlock(data,height)
				})
				.then(block =>{
					return addLevelDBData(blockData,block.height,JSON.stringify(block))
						.then(() => block)
				})
		}

		getBlockHeight(){
			return countLevelDBData(blockData)
		}

		getBlock(blockHeight){
			// return object as a single string
			return getLevelDBData(blockData,blockHeight)
				.then(blockString => JSON.parse(blockString))
				.catch(() => {
					console.log(`No Block with Height value ${blockHeight}`)   // eslint-disable-line
					return undefined
				})
		}
	}
}())