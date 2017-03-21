(function(){
	$('.aside-toggle').click(function(event){
		if($('aside').data('hidden') == true) {
			$('aside').slideDown();
			$('aside').data('hidden', false);
		} else {
			$('aside').slideUp();
			$('aside').data('hidden', true);
		}
	});
})(this, document);