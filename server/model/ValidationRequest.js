(function () {
	module.exports = class ValidationRequest {
		constructor(address = '') {
			this.address = address
			this.requestTimeStamp = new Date().getTime()
			this.message = `${address}:${this.requestTimeStamp}:starRegistry`
			this.requestExpiry = this.requestTimeStamp + (5 * 60 * 1000)
		}
	}
}())