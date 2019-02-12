$(document).click(function (e) {
   if ($(e.target).hasClass('mn-navbar__dropdown__trigger')) {
     var _this = e.target;
     $(_this).toggleClass('active');
     $(_this).parent().find('.mn-navbar__dropdown').stop().slideToggle(250);
   } else {
     $('.mn-navbar__dropdown__trigger').removeClass('active');
     $('.mn-navbar__dropdown').slideUp();
   }
   if ($(e.target).hasClass('mn-overlay')) {
       $('.mn-navbar').stop().animate({left: "-400px"}, 300);
       $('.mn-navbar').addClass("closed");
       $('.mn-overlay').stop().fadeOut(300);
       $('.menu-toggle').removeClass('active');
   }
});
$(document).ready(function () {
    $('.menu-toggle').on('click',function(){
        var menuToggle = $('.menu-toggle');
        var navBar = $('.mn-navbar');
        menuToggle.toggleClass('active');
        if (menuToggle.hasClass('active')) {
            $(navBar).stop().animate({left: "0"}, 400);
            $(navBar).removeClass("closed");
            $('.mn-overlay').stop().fadeIn(400);
        } else {
            $(navBar).stop().animate({left: "-400px"}, 300);
            $(navBar).addClass("closed");
            $('.mn-overlay').stop().fadeOut(300);
        }
    });
});

