;(function($, window, document, undefined) {


$(function() {
	// globals
	
	var $window = $(window),
		$document = $(document),
		docHeight = $document.innerHeight(),
		winWidth = $window.innerWidth(),
		winHeight = $window.innerHeight(),
		$header = $('header'),
		hh = $header.innerHeight(),
		imgs = document.body.getElementsByTagName('img');

	var updateOnResize = debounce(function() {
		updateValueOnResize();
		updateStyleOnResize();
		resizeEventListener();
		menuTransfer();
		breadcrumbsResponsive();
	}, 250);


updateStyleOnResize();
resizeEventListener();
menuTransfer();
breadcrumbsResponsive();
sliderColorText();

/**
* --------------------------------------------------------------------------
* RIPPLE EFFECT BTN
* --------------------------------------------------------------------------
*/
var ripple = function() {
	var target, rect, ripple;
	var top, left;

	$('.ripple-btn').mousedown(function (e) {
		target = e.target;
		rect = target.getBoundingClientRect();
		ripple = target.querySelector('.ripple');

		$(ripple).remove();
		ripple = document.createElement('span');
		ripple.className = 'ripple';
		ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
		target.appendChild(ripple);
		top = e.pageY - rect.top - ripple.offsetHeight / 2 -  document.body.scrollTop;
		left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
		ripple.style.top = top + 'px';
		ripple.style.left = left + 'px';
		return false;
	});
}();

/**
* --------------------------------------------------------------------------
* RESPONSIVE HEADER
* --------------------------------------------------------------------------
*/

function resizeEventListener () {
	if (winWidth <= 600) {
		$('header .logo').removeClass('pull-left');
		$('header .nav').addClass('nav-stick');
	}

	if(winWidth > 600) {
		$('.logo').addClass('pull-left');
	}
}


/**
* --------------------------------------------------------------------------
* MOBILE NAVIGATION
* --------------------------------------------------------------------------
*/

var navResponsive = function(){
	$('.nav-col').click(function(){
	  $(this).toggleClass('animate');
	  $('.navlist').toggleClass('open');
	  $('.menu-shadow').fadeToggle();
	  if($('.footer2').hasClass('open')) {
	  	$('.footer2').removeClass('open').slideToggle();
	  	$('.toggle-footer-btn').find('#footer-btn').toggleClass('fa-chevron-down fa-chevron-up');
	  	$(".footer-toggle-text").text(($(".footer-toggle-text").text() == 'CLOSE SITE MAP') ? 'OPEN SITE MAP' : 'CLOSE SITE MAP').fadeIn();
	  }
	});
}();

/**
* --------------------------------------------------------------------------
* FOOTER
* --------------------------------------------------------------------------
*/

var footer = function(){
	$('.toggle-footer-btn').click(function() {
		$('html, body').animate({scrollTop:$(document).height()}, 'slow');
		$(this).find('#footer-btn').toggleClass('fa-chevron-down fa-chevron-up');
		$(".footer-toggle-text").text(($(".footer-toggle-text").text() == 'CLOSE SITE MAP') ? 'OPEN SITE MAP' : 'CLOSE SITE MAP').fadeIn();
		$('.footer2').toggleClass('open').slideToggle(400);
		if($('.navlist').hasClass('open')) {
			$('.nav-col').removeClass('animate');
			$('.navlist').removeClass('open');
			$('.menu-shadow').fadeToggle();
		}
	

		return false;
	});
}();

/**
* --------------------------------------------------------------------------
* SEARCH LABAS
* --------------------------------------------------------------------------
*/

var searchBtn = function(){
	$('.search-btn').click(function(e){
		e.preventDefault();
		$(this).siblings('.form-search').fadeToggle();
		$('.menu-shadow').fadeToggle();
	});

	$('.close-search').click(function(e) {
		e.preventDefault();
		$('.form-search').fadeOut();
		$('.menu-shadow').fadeOut();
	});

	$('.form-search').on('submit', function(e) {
		e.preventDefault();
		if(!$('.search-tag-list a').length > 0) {
			var text = $(this).serializeArray()[0].value.split(' ');
			$('.search-tag-container').fadeIn();
			for (var i = 0; i < text.length; i++) {
				console.log(text[i]);
				if(text[i] != 0) {
					$('.search-tag-container .search-tag-list').append("<li><a href='#'>" + text[i] + "<i class='fa fa-times'></i></a></li>");
				}
			}

			$('.search-tag-list a').click(function(e) {
				e.preventDefault();
				console.log();
				if($('.search-tag-list li').length != 1) {
					$(this).parent('li').remove();
				} else {
					$('#search-keywords').val('');
					$(this).parent('li').remove();
					$('.search-tag-container').fadeOut();
				}
			});
		}
	});
}();


/**
* --------------------------------------------------------------------------
* ELASTIC MENU
* --------------------------------------------------------------------------
*/
var isAnimate = false;
var menuBtn = function(){
	var morphEl = document.getElementById( 'morph-shape' ),
		pathOpen = morphEl.getAttribute( 'data-morph-open' ),
		s = Snap( morphEl.querySelector( 'svg' ) ),
		path = s.select( 'path' ),
		initialPath = path.attr('d');


	$('.menu-btn').click(function() {
		if(isAnimate) { return false; }
		isAnimate = true;
		$('body').addClass('show-menu');
		path.animate( { 'path' : pathOpen }, 600, mina.easeinout, function() { isAnimate = false; });
		$('.menu-shadow').fadeIn().css('z-index', 4);
	});

	$('#close-button').click(function() {
		$('.menu-shadow').fadeOut().css('z-index', 1);
		path.attr( 'd', initialPath );
		$('body').removeClass('show-menu');
	});

	$('.menu-shadow').click(function(){
		$('.form-search').fadeOut();
		$(this).fadeOut().css('z-index', 1);
		$('body').removeClass('show-menu');
		setTimeout( function() {
			// reset path
			path.attr( 'd', initialPath );
		}, 300 );
		$('.search-tag-container').fadeOut();
		$('.search-tag-container li').remove();
		$('#search-keywords').val('');
	});
}();

/**
* --------------------------------------------------------------------------
* FIRST MENU TRANSFER TO RESPONSIVE MENU
* --------------------------------------------------------------------------
*/

function menuTransfer() {
	if(winWidth <= 600){
		$('.first-menu').children().clone().addClass('menu-transfer').prependTo('.navlist');
		$('.navlist li a').children('i').remove();
		$('.lang').appendTo('.footer3');
	} else {
		$('.navlist').find('li.menu-transfer').remove();
		$('.lang').appendTo('.submenu');
	}
}

/**
* --------------------------------------------------------------------------
* OFFSET NG BODY
* --------------------------------------------------------------------------
*/

var bodyOffset = function(){
	$('body').css('margin-top',hh);
}();

/**
* --------------------------------------------------------------------------
* HIDE HEADER ON ON SCROLL DOWN
* --------------------------------------------------------------------------
*/

var didScroll;
var lastScrollTop = 0;
var delta = 0;

setInterval(function() {
	if (didScroll) {
		hasScrolled();
		didScroll = false;
	}
});

function hasScrolled() {
	var st = $(this).scrollTop();
	if(Math.abs(lastScrollTop - st) <= delta)
		return;
	
	// If they scrolled down and are past the navbar, add class .nav-up.
	// This is necessary so you never see what is "behind" the navbar.
	if (st > lastScrollTop && st > hh){
		// Scroll Down
		$('header').removeClass('nav-down').addClass('nav-up');
		$('.nav-up').css('top', '-'+hh+'px');
	} else {
		// Scroll Up
		if(st + winHeight < docHeight) {
			$('header').removeClass('nav-up').addClass('nav-down');
			$('.nav-down').css('top', 0);
		}
	}
	lastScrollTop = st;
}

/**
* --------------------------------------------------------------------------
* SLIDER
* --------------------------------------------------------------------------
*/

$('.home-slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: true,
  asNavFor: '.home-prod-slider'
});
$('.home-prod-slider').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  asNavFor: '.home-slider',
  dots: true,
  centerMode: true,
  centerPadding: '60px',
  focusOnSelect: true,
  arrows: false,
  infinite: true
});

$('.home-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  $('.home-slider .home-slider-txt').addClass('hide');
  $('.home-slider .home-slider-txt').removeClass('animated fadeInUp');
});

$('.home-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
  $('.home-slider .home-slider-txt').removeClass('hide');
  $('.home-slider .home-slider-txt').addClass('animated fadeInUp');
});

/**
* --------------------------------------------------------------------------
* CUSTOM INPUTS
* --------------------------------------------------------------------------
*/
jQuery.fn.customInput = function(){
	return $(this).each(function(){	
		if($(this).is('[type=checkbox],[type=radio]')){
			var input = $(this);
			
			// get the associated label using the input's id
			var label = $('label[for='+input.attr('id')+']');
			
			// wrap the input + label in a div 
			input.add(label).wrapAll('<div class="custom-'+ input.attr('type') +'"></div>');
			
			// necessary for browsers that don't support the :hover pseudo class on labels
			label.hover(
				function(){ $(this).addClass('hover'); },
				function(){ $(this).removeClass('hover'); }
			);
			
			//bind custom event, trigger it, bind click,focus,blur events					
			input.bind('updateState', function(){	
				input.is(':checked') ? label.addClass('checked') : label.removeClass('checked checkedHover checkedFocus'); 
			})
			.trigger('updateState')
			.click(function(){ 
				$('input[name='+ $(this).attr('name') +']').trigger('updateState'); 
			})
			.focus(function(){ 
				label.addClass('focus'); 
				if(input.is(':checked')){  $(this).addClass('checkedFocus'); } 
			})
			.blur(function(){ label.removeClass('focus checkedFocus'); });
		}
	});
};

if ($("div,p").hasClass("input_styled")) {
    $(".input_styled input").customInput();
}


/**
* --------------------------------------------------------------------------
* RESPONSIVE BREADCRUMBS
* --------------------------------------------------------------------------
*/

function breadcrumbsResponsive() {
	if(winWidth <= 600){
		$('.breadcrumbs ul').appendTo('.responsive-breadcrumbs-list');
	} else {
		$('.responsive-breadcrumbs-list ul').appendTo('.breadcrumbs');
	}

	$('.responsive-breadcrumbs a').click(function(){
		$(this).find('span').toggleClass('fa-chevron-up fa-chevron-down');
		$('.responsive-breadcrumbs-list').stop(true,true).slideToggle();
	});
};

/**
* --------------------------------------------------------------------------
* PANG KUHA NG STROKE-DASHARRAY NA VALUE
* --------------------------------------------------------------------------
*/

$(".gitna path").each(function(i, el) {
	var total_length = el.getTotalLength();
	console.log(total_length);
});


/**
* --------------------------------------------------------------------------
* TEXT FLOATER UPON HOVER
* --------------------------------------------------------------------------
*/

var JSReplaceLetter = function() {
	var jSReplaceLetter = $('.text-floater').contents();
	var newStr = '';
	
	function replace(str) {
		for (var x = 0; x < str.length; x++) {
			newStr += '<i>' + str[x] + '</i>' ;
		}
	}
	
	var showObject = function(obj) {
		var result = "";
		for (var p in obj) {
			if( obj.hasOwnProperty(p) ) {
				result += p + "=" + '"' + obj[p] + '"' + " ";
			}
		}
		return result;
	}
	
	for (var i = 0; i < jSReplaceLetter.length; i++) {
		if (jSReplaceLetter[i].nodeType === 3) {
			var str = jSReplaceLetter[i].wholeText.toString();
			replace(str);
			
		} else if (jSReplaceLetter[i].nodeType === 1) {
			var str = jSReplaceLetter[i].innerText;
			var el = jSReplaceLetter[i].nodeName;
			
			var attributess = {};


			$.each( $(jSReplaceLetter[i])[0].attributes, function( i, attr ) {
				attributess[ attr.name ] = attr.value;
			});
			
			var attributeString = showObject(attributess);
			
			newStr += '<' + el + " " + attributeString + '>';
			replace(str);
			newStr += '</' + el + '>';
		}
	}
	
	$('.text-floater').html(newStr);

}();

/**
* --------------------------------------------------------------------------
* DYNAMIC CHANGE OF COLOR ON SLIDER
* --------------------------------------------------------------------------
*/

$('.home-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
	sliderColorText();
});


function sliderColorText(){
	var brightness = 0;
	$(".home-slider .slick-active img").each(function(){
		getImageBrightness($(this).attr('src'),function(brightness) {
            // document.getElementsByTagName('pre')[0].innerHTML = "Brightness: "+brightness;
            console.log(brightness);
            if (brightness <= 135){
				$('.home-slider-txt').css('color','#f7f7f7');
			} else {
				$('.home-slider-txt').css('color','#242424');
			}
        });
	});
}


/**
* --------------------------------------------------------------------------
* GOOGLE MAP
* --------------------------------------------------------------------------
*/

// google.maps.event.addDomListener(window, 'load', init);
// function init() {
// 	var mapOptions = {
// 		zoom: 15,
// 		center: new google.maps.LatLng(14.5839664, 121.0633393),
// 		styles: [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"-3"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#748ca3"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ff000a"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":"23"},{"lightness":"20"},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#ffdbda"},{"saturation":"0"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":"100"},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#f39247"},{"saturation":"0"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#008eff"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#ffe5e5"},{"saturation":"0"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}]
// 	};
// 	mapOptions = $.extend({
// 		scrollwheel: false,
// 		mapTypeId: google.maps.MapTypeId.ROADMAP
// 	}, mapOptions);
// 	var mapElement = document.getElementById('map');
// 	var map = new google.maps.Map(mapElement, mapOptions);
// 	var marker = new google.maps.Marker({
// 		position: new google.maps.LatLng(14.5839664, 121.0633393),
// 		map: map,
// 		title: 'Transcosmos'
// 	});
// }



/**
* --------------------------------------------------------------------------
* EVENTS
* --------------------------------------------------------------------------
*/

$(window).resize(function(){
	updateOnResize();
});

$(window).scroll(function(event){
	didScroll = true;
});

/**
* --------------------------------------------------------------------------
* FUNCTIONS
* --------------------------------------------------------------------------
*/

function updateValueOnResize() {
	winWidth = $window.innerWidth();
	winHeight = $window.innerHeight();
	hh = $header.innerHeight();
	docHeight = $document.innerHeight();
}

function updateStyleOnResize() {
	//offset of body
	$('body').css('margin-top',hh);

	//hide header on on scroll down
	$('.nav-up').css('top', '-'+hh);

	// height of slider
	$('.home-slider-wrap, .home-slider').css({
		'height': winHeight * 0.85
	});
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function getImageBrightness(imageSrc,callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

          for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*this.height));
        callback(brightness);
    }
}

});
})(jQuery, window, document);