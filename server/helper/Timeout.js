(function(){
	module.exports = function(userData){
		return (key) => {
			setTimeout(()=>{
				userData.del(key)
					.catch(() => null)
			},(5 * 60 * 1000))
		}
	}
}())