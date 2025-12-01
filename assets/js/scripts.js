
(function($) {
	'use strict';
	
	jQuery(document).on('ready', function(){
	
		/*PRELOADER JS*/
		$(window).on('load', function() { 
			$('.status').fadeOut();
			$('.preloader').delay(350).fadeOut('slow'); 
		}); 
		/*END PRELOADER JS*/	
			
		/*START MENU JS*/		
		function windowScroll() {
			const navbar = document.getElementById("navbar");
			if (
				document.body.scrollTop >= 50 ||
				document.documentElement.scrollTop >= 50
			) {
				navbar.classList.add("nav-sticky");
			} else {
				navbar.classList.remove("nav-sticky");
			}
		}

		window.addEventListener('scroll', (ev) => {
			ev.preventDefault();
			windowScroll();
		})	  	
		/*END MENU JS*/

		/*START PROGRESS BAR*/
	    $('.progress-bar > span').each(function(){
			var $this = $(this);
			var width = $(this).data('percent');
			$this.css({
				'transition' : 'width 2s'
			});
			
			setTimeout(function() {
				$this.appear(function() {
						$this.css('width', width + '%');
				});
			}, 500);
		});
		/*END PROGRESS BAR*/	

		/* START COUNTDOWN JS*/
		$('.counter_feature').on('inview', function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				$(this).find('.counter-num').each(function () {
					var $this = $(this);
					$({ Counter: 0 }).animate({ Counter: $this.text() }, {
						duration: 2000,
						easing: 'swing',
						step: function () {
							$this.text(Math.ceil(this.Counter));
						}
					});
				});
				$(this).unbind('inview');
			}
		});
		/* END COUNTDOWN JS */		

		/* START JQUERY LIGHTBOX*/
		jQuery('.lightbox').venobox({
			numeratio: true,
			infinigall: true
		});	
		/* END JQUERY LIGHTBOX*/	

		/* START MIX JS */
		$('.portfolio_item').mixItUp({
		
		});		
			
	}); 		

	/* START PARALLAX JS */
	(function () {

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		 
		} else {
			$(window).stellar({
				horizontalScrolling: false,
				responsive: true
			});
		}

	}());
	/* END PARALLAX JS  */
	
	/*START WOW ANIMATION JS*/
	  new WOW().init();	
	/*END WOW ANIMATION JS*/	
			
})(jQuery);

// START AOS ANIMATION JS 
AOS.init();
// END AOS ANIMATION JS 

// portfoilo view button js

/* --- PORTFOLIO FILTERING & ANIMATION LOGIC --- */
    document.addEventListener('DOMContentLoaded', function() {
        const allItems = document.querySelectorAll('.mix');
        const filterButtons = document.querySelectorAll('.portfolio_filter ul li');
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        const viewMoreContainer = document.querySelector('.view-more-container');
        
        const itemsToShow = 6;
        let isExpanded = false;
        
   
        let activeBtn = document.querySelector('.portfolio_filter .active');
        let currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
       
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
          
                currentFilter = this.getAttribute('data-filter');
                isExpanded = false; 
                updateVisibility();
            });
        });

        
        viewMoreBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            updateVisibility();
        });

        function updateVisibility() {
            let visibleCount = 0;
            let matchingItemsCount = 0;

            allItems.forEach(item => {
                const matchesFilter = currentFilter === 'all' || item.matches(currentFilter);
                
                if (matchesFilter) {
                    matchingItemsCount++;
                    
                    const shouldShow = isExpanded || visibleCount < itemsToShow;

                    if (shouldShow) {
                        item.classList.remove('hide-item');
                        item.style.display = 'block';
                        
                        if(!item.classList.contains('show-item')) {
                            item.classList.add('show-item');
                        }
                        visibleCount++;
                    } else {
                        if (item.style.display === 'block' && !item.classList.contains('hide-item')) {
                            item.classList.remove('show-item');
                            item.classList.add('hide-item');
                            
                            setTimeout(() => {
                                if(item.classList.contains('hide-item')) {
                                    item.style.display = 'none';
                                    item.classList.remove('hide-item');
                                }
                            }, 450); 
                        } else if (item.style.display !== 'block') {
                            item.style.display = 'none';
                        }
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('show-item', 'hide-item');
                }
            });

            if (matchingItemsCount <= itemsToShow) {
                viewMoreContainer.style.display = 'none';
            } else {
                viewMoreContainer.style.display = 'block';
                viewMoreBtn.textContent = isExpanded ? "Show Less" : "View All Projects";
            }
        }

        updateVisibility();
    });


// Contact Form js start


    const form = document.getElementById('contactForm');
    const popup = document.getElementById('thankYouPopup');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

       
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        const formData = new FormData(form);

       
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            if (response.status == 200) {
               
                popup.style.display = 'block';
                form.reset(); 
            } else {
                alert("Somthing is Wrong Please Try agin latter");
            }
        })
        .catch(error => {
            console.log(error);
            alert("Somthing Is Wrong");
        })
        .finally(() => {
            
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });

   
    function closePopup() {
        popup.style.display = 'none';
    }




  

