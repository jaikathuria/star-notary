/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const Block = require('./Block');
const SHA256 = require('crypto-js/sha256');
const { db, 
        addLevelDBData,
        getLevelDBData,
        addDataToLevelDB,
        countLevelDBData
      } = require('./dbHelper.js');


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

module.exports = class Blockchain{
   constructor(){
      this.getBlockHeight()
        .then(height => {
            if(height === 0) {
              return this.addGenesisBlock()
            } 
            return true
        })
   }

   _createBlock(data,height){
      const block = new Block(data)
      return this._getPreviousHash(height)
        .then(previousHash => {
          console.log({
            previousHash
          })
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
        console.log(err)
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
        console.log({ height })
        return this._createBlock(data,height)
      })
      .then(block => db.put(block.height,JSON.stringify(block)))
   }


  // Get block height
    getBlockHeight(){
      return countLevelDBData()
    }

    // get block
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
