
//Add data to levelDB with key/value pair
function addLevelDBData(db,key,value){
  return db.put(key, value)
}

// Get data from levelDB with key
function getLevelDBData(db,key){
  return db.get(key)
}

// Add data to levelDB with value
function addDataToLevelDB(db,value) {
    let i = 0;
    return new Promise((resolve,reject)=>{
      db.createReadStream().on('data', function(data) {
            i++;
          }).on('error', function(err) {
              reject()
          }).on('close', function() {
            addLevelDBData(db,i, value)
              .then(()=>resolve())
          });
      })
}


function countLevelDBData(db){
   	let count = 0
    return new Promise((resolve,reject)=>{
        db.createReadStream()
        .on('data',()=>count++)
        .on('error', ()=> reject(NaN))
        .on('close', ()=> resolve(count))
      });
}


function findLevelDBdata(db,address){
    return new Promise((resolve,reject)=>{
        db.createValueStream()
          .on('data', data => {
              console.log(data)
              request = JSON.parse(data)
              if (request.address && request.address === address){
                  resolve({found: true, request})
              }
          })
          .on('close', ()=> resolve({found: false}))
          .on('error', err => reject(err))
    })
}

module.exports = {
	addLevelDBData,
	getLevelDBData,
	addDataToLevelDB,
	countLevelDBData,
  findLevelDBdata
}
