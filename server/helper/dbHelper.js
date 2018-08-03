/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './BlockchainDB';
const db = level(chainDB);

//Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  return db.put(key, value)
}

// Get data from levelDB with key
function getLevelDBData(key){
  return db.get(key)
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

function countLevelDBData(){
   	let count = 0
    return new Promise((resolve,reject)=>{
        db.createReadStream()
        .on('data',()=>count++)
        .on('error', ()=> reject(NaN))
        .on('close', ()=> resolve(count))
      });
}

module.exports = {
	db,
	addLevelDBData,
	getLevelDBData,
	addDataToLevelDB,
	countLevelDBData
}
