$(document).ready(function(){
    // Loading animation
    setTimeout(function(){
        $('.loader-wrapper').addClass('fade-out');
        setTimeout(function(){
            $('.loader-wrapper').hide();
        }, 500);
    }, 1500);

    // Sticky Navigation Menu
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }

        // Scroll-up button show/hide
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // Slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });

    // Dark mode toggle
    $('.dark-mode-toggle').click(function(){
        $('body').toggleClass("dark-mode");
        // Change icon based on mode
        if($('body').hasClass("dark-mode")){
            $('.dark-mode-toggle i').removeClass("fa-moon").addClass("fa-sun");
        } else {
            $('.dark-mode-toggle i').removeClass("fa-sun").addClass("fa-moon");
        }
    });

    // Toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);

        $('html').css("scrollBehavior", "smooth");
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000, 'swing', function() {
            window.location.hash = target;
        });
    });

    // Add animation to skill bars
    function animateSkills() {
        $('.skills-content .right .bars').each(function() {
            let percentage = $(this).find('.info span:last-child').text();
            $(this).find('.line').css('width', percentage);
        });
    }

    // Trigger skill animation when skills section is in view
    let animated = false;
    $(window).scroll(function() {
        let skillsSection = $('.skills');
        if(isInViewport(skillsSection[0]) && !animated) {
            animateSkills();
            animated = true;
        }
    });

    // Helper function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Form Submission
    const contactForm = $('.contact-form');
    if (contactForm.length) {
        contactForm.on('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});
