var hide = true;
function toggle(){
	if (hide) {
		$('#menu').addClass("menu-slide-show");
		$('#corp').addClass("corp-show");
		hide = false;
	}else {
		$('#menu').removeClass("menu-slide-show");
		$('#corp').removeClass("corp-show");
		hide = true;
	}
};

function toggleSearch(){
    $('#search-field').fadeToggle();
};