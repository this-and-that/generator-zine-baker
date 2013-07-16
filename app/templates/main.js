/**
 *	main.js
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 *	credit given where credit is due
 *
 */



// ------------------------------------------------------------------------
// properties
// ------------------------------------------------------------------------
/*
 *	Orientation
 */
var ios;
var device = {
	isiPad: null,
	isiPhone: null,
	isiPod: null,
	isSafari: null,
	isAndroid: null
};
var orientation;


/*
 *	Article
 */
var contentTop;

// global holders for the various parts of an article
// generic to be reused by all articles
var title = [];
var author = [];
var intro = [];
var main = [];
var interview = [];
var captions = [];
var desc = [];


/*
 *	Misc.
 */
var bRedirected = false;
var scrollPosPrev = 0;
var bScrolling = false;





// ------------------------------------------------------------------------
// loaded
// ------------------------------------------------------------------------
/*
 *	DOM is loaded
 */
$(function() {
	/*
	 *	Orientation
	 */
	angle = 0; // orienation angle
	isRotated = false;

	ios = navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)/);
	device.isiPad	= (navigator.userAgent.match(/iPad/i) != null);
	device.isiPhone  = (navigator.userAgent.match(/iPhone/i) != null);
	device.isiPod	= (navigator.userAgent.match(/iPod/i) != null);
	device.isSafari  = (navigator.userAgent.match(/Safari/i) != null);
	device.isAndroid = (navigator.userAgent.match(/Android/i) != null);

	// initial orientation check
	orientation	= 'landscape';
	orientationChange();


	/*
	 *	Check Connection status
	 */
	console.log( 'online', navigator.onLine );
	if(!(navigator.onLine) && !bRedirected ) {
		window.location = './oops.html';
		bRedirected = true;
	}	 


	// keep all links within webapp
	// crucial for testing purposes
	var a = document.getElementsByTagName('a');
	for( var i=0; i<a.length; i++ ) {
		if( !a[i].onclick && a[i].getAttribute('target') != '_blank' ) {
			a[i].onclick = function() {
				window.location = this.getAttribute('href');
				return false; 
			}
		}
	}

});




// ------------------------------------------------------------------------
// ready
// ------------------------------------------------------------------------
/*
 *	DOM is ready
 */
$(document).ready(function() {
	/*
	 *	Links
	 */
	$('a').each(function() {
		$(this).addClass(type);
	});

	// http://stackoverflow.com/questions/7901679/jquery-add-target-blank-for-outgoing-link
	$('a[href^="htt"]').each(function() {
		var link = $(this).attr('href');

		// within normal browser
		// open external links in a new window/tab
		$(this).attr('target', '_blank');
	});


	// set carousel globally
	$('.carousel').carousel({
		interval: 5000,
		pause: 'false'
	});


	/*
	 *	Misc
	 */
	// set placement of pages
	paginateHorizontal();


	/*
	 *	Events
	 */


});



// ------------------------------------------------------------------------
// methods
// ------------------------------------------------------------------------
/*
 *	Orientation
 */
//
//	TODO: tweak orientation settings to procure correct angle
//
function orientationChange() {
	/*
	 *	Orientation
	 */
	isRotated = true;

	// angle = window.orientation;

	// if(window.orientation == 90 || window.orientation == -90)	orientation	= 'landscape';
	if(window.orientation == 0 || window.orientation == 180) orientation = 'portrait';

	if (window.orientation == -90) {
		angle = 90;
	}
	if (window.orientation == 90) {
		angle = -90;
	}
	if (window.orientation == 0) {
		angle = 0;
	}


	/*
	 *	Pages
	 */
	// set placement of pages
	paginateHorizontal();


	/*
	 *	Misc.
	 */

};


// ------------------------------------------------------------------------
function paginateHorizontal() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	console.log( width + ' x ' + height );

	// count the number of page elements
	var pagesNum = $('.page').size();
	for(var i=0; i<pagesNum; i++) {
		$( '.page' ).each(function(i) {
			// adjust page(s) css
			$(this).css({
				'width': width,
				'height': height,
				'top': 0 + 'px',
				// adjust the left edge
				'left': i*width
			});
		});	
	}
	// console.log( $('.page') );

	// adjust page(s) css
	$('.pages').css({
		'width': pagesNum*width,
		'height': height
	});
	// console.log( $('.pages') );

	// adjust article css
	$('.article').css({
		'width': pagesNum*width,
		'height': height
	});
	// console.log( $('.article') );
};

// ------------------------------------------------------------------------
function scrollTo(element) {
	if( $(element).offset() != undefined ) {
		$('html, body').animate({
			scrollTop: $(element).offset().top
		 }, 450);
	}
};


// ------------------------------------------------------------------------
/*
 *	Article
 */
function loadArticle() {
	//
	// load article json
	//
	if(filename === undefined || filename === null) {
		console.log( 'filename: ' + typeof filename );
		return;
	}
	else {
		console.log( 'loadArticle() getJSON( ' + filename + ' )' );
		$.getJSON('copy/'+filename, function(data) {
			// info block
			title = data.article.info.title;
			author = data.article.info.author;
			// introduction paragraphs
			intro = data.article.intro.text;
			// content
			main = data.article.main.text;
			interview = data.article.interview.text;
			// captions
			captions = data.article.captions.text;

			jsonToHtml(title, 'title');
			jsonToHtml(author, 'author');
			jsonToHtml(intro, 'intro');
			jsonToHtml(main, 'main');
			jsonToHtml(interview, 'interview');
			jsonToHtml(captions, 'captions');
		});
	}
};

function jsonToHtml(arr, idName) {
	//
	// might be worth doing this without jquery
	// http://stackoverflow.com/questions/327047/what-is-the-most-efficient-way-to-create-html-elements-using-jquery
	//
	var i = 0;
	var id = '';
	for(i=0; i<arr.length; i++) {
		id = '#'+idName+(i).toString();

		if( idName == 'captions' ) {
			// handle captions a bit diffrently
			// they are treated like lists
			$( id ).html( '<h5><ul class="caption"><li><span>' + arr[i].title + '</span></li><li><span>' + arr[i].body + '</span></li></ul></h5>' );
		}
		else {
			// everything else
			$( id ).html( '<h4>' + arr[i] + '</h4>' );
		}
	}
};


// ------------------------------------------------------------------------
function scrollUp() {
	var h = window.innerHeight;
	$('html, body').animate({
		scrollTop: ($(window).scrollTop() - h)
	 }, 450);
};
function scrollDown() {
	var h = window.innerHeight;
	$('html, body').animate({
		scrollTop: ($(window).scrollTop() + h)
	 }, 450);
};


// ------------------------------------------------------------------------
/*
 *	Cookies
 *	http://www.quirksmode.org/js/cookies.html
 */
 function saveCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		var expires = '; expires=' + date.toGMTString();
	}
	else var expires = '';
	document.cookie = name + '=' + value + expires + '; path=/';
};

 function openCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

 function deleteCookie(name) {
	saveCookie(name, '', -1);
};


/**
 *	Local Storage
 */
function saveSession(name, value) {
	if(window.sessionStorage) {
		sessionStorage.setItem(name, String(value));
	}
	else {
		console.error('sessionStorage not supported');
	}
};

function getSession(name) {
	return sessionStorage.getItem(name);
};

function deleteSession(name) {
	sessionStorage.removeItem(name);
};




// ------------------------------------------------------------------------
// events   
// ------------------------------------------------------------------------
$(window).resize(function() {
	orientationChange();
});


// ------------------------------------------------------------------------
$(window).scroll(function() { 
	var scrollPos = $(this).scrollTop(); 
	var h = window.innerHeight-100;

	var pct = ((scrollPos-h)/h)*-1;

	//
	// scroll stop
	//
	clearTimeout($.data(this, 'scrollTimer'));
	$.data(this, 'scrollTimer', setTimeout(function() {
		bScrolling = false;
		scrollPosPrev = $(this).scrollTop();

		// alert('Haven't scrolled in 250ms! ' + scrollPosPrev);
	}, 250));

	if( scrollPos > (scrollPosPrev+h*2) ) {
		// alert( 'you're past the next page' );
		$(this).scrollTop( 0 ); //scrollPosPrev + h );
	}

	// console.log( scrollPos );
	bScrolling = true;
}); 
