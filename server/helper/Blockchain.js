const Block = require('./../../model/Block');
const SHA256 = require('crypto-js/sha256');
const { db, 
        addLevelDBData,
        getLevelDBData,
        addDataToLevelDB,
        countLevelDBData
      } = require('./dbHelper.js');


class Blockchain{
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
     return getLevelDBData(height-1)
       .then(data => JSON.parse(data))
       .then(block => block.hash)
       .catch(err => {
        return ""
       })
   }

   addGenesisBlock(){
      return this.addBlock("First block in the chain - Genesis block")
        .then(() => true)
        .catch(() => false)
   }
   
   addBlock(data){
    return this.getBlockHeight()
      .then(height => { 
        return this._createBlock(data,height)
      })
      .then(block => db.put(block.height,JSON.stringify(block)))
   }

    getBlockHeight(){
      return countLevelDBData()
    }

    getBlock(blockHeight){
      // return object as a single string
      return db.get(blockHeight)
          .then(blockString => JSON.parse(blockString))
          .catch(err => {
            console.log(`No Block with Height value ${blockHeight}`,err)
            return undefined
          })
    }

}

module.exports = Blockchain