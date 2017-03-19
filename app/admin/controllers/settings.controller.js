exports.render = function(req, res){
	res.render('settings', {
		year: new Date().getFullYear(),
		page: 'settings'
	});
}