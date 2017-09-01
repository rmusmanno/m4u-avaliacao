module.exports = {
	// auxiliar functions
	return_ok:function(res, obj) {
		return res.status(200).send(obj);
	},

	return_notfound:function(res) {
		return res.status(404).send({ "error": "No object found." });
	},

	return_error:function(res) {
		return res.status(500).send({ "error": "There was a problem processing the information provided." });
	}	
}
