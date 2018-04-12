var didScroll;
var transparent = true;

demo = {
  verticalDots: function(){
  
    var contentSections = $('.cd-section'),
        navigationItems = $('#scroll-nav a.toscroll'),
        scrollLinkItems = $('.box-link');

    	updateNavigation();
    	$(window).on('scroll', function(){
    		updateNavigation();
    	});
        //smooth scroll to top
        $('.navbar-header a').on('click', function(event){
            event.preventDefault();
            smoothScroll($(this.hash));
        });
    	//smooth scroll to the section
    	navigationItems.on('click', function(event){
            event.preventDefault();
            smoothScroll($(this.hash));
        });
        //smooth scroll links to the section
    	scrollLinkItems.on('click', function(event){
            event.preventDefault();
            smoothScroll($(this.hash));
        });
        //smooth scroll to second section
        $('.cd-scroll-down').on('click', function(event){
            event.preventDefault();
            smoothScroll($(this.hash));
        });

        //open-close navigation on touch devices
        $('.touch .cd-nav-trigger').on('click', function(){
        	$('.touch #cd-vertical-nav').toggleClass('open');

        });
        //close navigation on touch devices when selectin an elemnt from the list
        $('.touch #cd-vertical-nav a').on('click', function(){
        	$('.touch #cd-vertical-nav').removeClass('open');
        });

    	function updateNavigation() {
    		contentSections.each(function(){
    			$this = $(this);
    			var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
    			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
    				navigationItems.eq(activeSection).addClass('is-selected');
    			}else {
    				navigationItems.eq(activeSection).removeClass('is-selected');
    			}
    		});
    	}

    	function smoothScroll(target) {
            $('body,html').animate(
            	{'scrollTop':target.offset().top},
            	600
            );
    	}
    }
}

pk = {
  misc:{
      navbar_menu_visible: 0
  },
  checkScrollForTransparentNavbar: debounce(function() {
      //console.log($(document).scrollTop());
        if($(document).scrollTop() > 395 ) {
              if(transparent) {
                  transparent = false;
                  $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
              }
          } else {
              if( !transparent ) {
                  transparent = true;
                  $('.navbar[color-on-scroll]').addClass('navbar-transparent');
              }
          }
          if($(document).scrollTop() > 1610 && $(document).scrollTop() < 4100 ) {
              $('.navbar-two').addClass('nav-down-two');
          } else {
              $('.navbar-two').removeClass('nav-down-two');
          }
  }, 17),

  checkScrollForMovingNavbar: function(){

      // Hide Header on on scroll down
      navbarHeight = $('.navbar').outerHeight();

      $(window).scroll(function(event){
          didScroll = true;
      });

      //setInterval(function() {
          if (didScroll) {
              hasScrolled();
              didScroll = false;
          }
      //}, 250);


  },

  checkScrollForPresentationPage: debounce(function(){
      oVal = ($(window).scrollTop() / 3);
      big_image.css({
          'transform':'translate3d(0,' + oVal +'px,0)',
          '-webkit-transform':'translate3d(0,' + oVal +'px,0)',
          '-ms-transform':'translate3d(0,' + oVal +'px,0)',
          '-o-transform':'translate3d(0,' + oVal +'px,0)'
      });
  }, 4),

  initVideoBackground: function(){
      $('[data-toggle="video"]').click(function(){
          id_video = $(this).data('video');
          video = $('#' + id_video).get(0);

          parent = $(this).parent('div').parent('div');

          if(video.paused){
              video.play();
              $(this).html('<i class="fa fa-pause"></i> Pause Video');
              parent.addClass('state-play');
          } else {
              video.pause();
              $(this).html('<i class="fa fa-play"></i> Play Video');
              parent.removeClass('state-play');
          }
      });
  },

  initPopovers: function(){
      if($('[data-toggle="popover"]').length != 0){
          $('body').append('<div class="popover-filter"></div>');

          //    Activate Popovers
          $('[data-toggle="popover"]').popover().on('show.bs.popover', function () {
              $('.popover-filter').click(function(){
                  $(this).removeClass('in');
                  $('[data-toggle="popover"]').popover('hide');
              });
              $('.popover-filter').addClass('in');
          }).on('hide.bs.popover', function(){
              $('.popover-filter').removeClass('in');
          });

      }
  },

  initSliders: function(){
      // Sliders for demo purpose in refine cards section
      if($('#sliderRegular').length != 0 ){
          var rangeSlider = document.getElementById('sliderRegular');
          noUiSlider.create(rangeSlider, {
            start: [ 5000 ],
            range: {
              'min': [  2000 ],
              'max': [ 10000 ]
            }
          });
      }
      if($('#sliderDouble').length != 0){
          var slider = document.getElementById('sliderDouble');
          noUiSlider.create(slider, {
            start: [20, 80],
            connect: true,
            range: {
              'min': 0,
              'max': 100
            }
          });
      }

  },
}

function updateNavigation() {
  contentSections.each(function(){
    $this = $(this);
    var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
    if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
      navigationItems.eq(activeSection).addClass('is-selected');
    }else {
      navigationItems.eq(activeSection).removeClass('is-selected');
    }
  });
}

function smoothScroll(target) {
    $('body,html').animate(
        {'scrollTop':target.offset().top},
        600
    );
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};

function hasScrolled() {
    var st = $(this).scrollTop();
    // Make sure they scroll more than delta
    //if(Math.abs(lastScrollTop - st) <= delta)
        //return;
        console.log(st);
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st >= 385 ){ //st > lastScrollTop && st < navbarHeight
        // Scroll Down
        //$('.navbar.nav-down').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.navbar.nav-up').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
};

$(document).ready(function(){
  window_width = $(window).width();

  demo.verticalDots();

  // Change the collor of navbar collapse
  $('#navbarToggler').on('show.bs.collapse', function () {
    if( $('nav').hasClass('navbar-transparent') && $(document).scrollTop() < 50 ){
        $('.navbar').addClass('no-transition');
        $('nav').removeClass('navbar-transparent');
    }
    }).on('hidden.bs.collapse', function (){
        if($(document).scrollTop() < 50 ){
            $('.navbar').removeClass('no-transition');
            $('nav:first-of-type').addClass('navbar-transparent');
    }
  });

  // Navbar color change on scroll
  if($('.navbar[color-on-scroll]').length != 0){
    $(window).on('scroll', pk.checkScrollForTransparentNavbar)
  }

  // Activate Navbar
  if($('.nav-down').length != 0){
    pk.checkScrollForMovingNavbar();
  };

})