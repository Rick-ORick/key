/*========== RELOAD PAGE AT TOP (scrollspy) ==========*/
window.onbeforeunload = function () { //when page is closed/refreshed
  window.scrollTo(0, 0); //scroll to top (X axis, Y axis)
} //fix for scrollspy refreshing on wrong nav link

/*========== COLLAPSE MOBILE MENU ON CLICK & SMOOTH SCROLL TO LINK ==========*/
$(document).on('click', 'a[href^="#"]', function (event) { //when link with "#" clicked
  event.preventDefault(); //prevent default click event
  $('.navbar-toggler').addClass('collapsed'); //add collapsed class to toggler
  $('#navbarResponsive').removeClass('show'); //remove class show from navbar

  setTimeout(function () { //delay execution of the following    
    $('.navbar').removeClass('solid-toggle'); //remove class solid-toggle from navbar     
  }, 300); //delay 300ms

  $('html, body').animate({ //animate window scrolling (on click of "#" link)
      scrollTop: $($.attr(this, 'href')).offset().top //when scrolling to link destination
  }, 1000); //at animated window speed of 1000ms
});


/*========== CLOSE MOBILE NAV ON CLICK ==========*/

$(document).ready(function () { //when document loads completely.
  $(document).click(function (event) { //click anywhere
      var clickover = $(event.target); //get the target element where you clicked
      var _opened = $(".navbar-collapse").hasClass("show"); //check if element with 'navbar-collapse' class has a class called show. Returns true and false.
      if (_opened === true && !clickover.hasClass("navbar-toggler")) { // if _opened is true and clickover(element we clicked) doesn't have 'navbar-toggler' class
          $(".navbar-toggler").click(); //toggle the navbar; close the navbar menu in mobile.
      }
  });
});


/*========== LIGHTBOX GALLERY SETTINGS
https://lokeshdhakar.com/projects/lightbox2/ ==========*/

$(document).ready(function(){ 
  lightbox.option({
    'resizeDuration': 700,
    'wrapAround': false,
    'imageFadeDuration': 600
  })
});