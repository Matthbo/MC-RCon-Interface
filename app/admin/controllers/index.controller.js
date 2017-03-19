exports.render = function(req, res){
	res.render('index', {
		year: new Date().getFullYear()
	});
}