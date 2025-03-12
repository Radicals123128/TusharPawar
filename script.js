$(document).ready(function(){
    // Enhanced Loading Animation
    const preloader = $('.preloader');
    const progress = $('.preloader-progress');
    const counter = $('.preloader-counter');

    let loadingProgress = 0;
    const totalAssets = $('img').length + 5; // Images + CSS + JS files
    let loadedAssets = 0;

    // Function to update progress
    function updateProgress() {
        loadedAssets++;
        const newProgress = Math.min(Math.floor((loadedAssets / totalAssets) * 100), 100);

        // Animate progress from current to new value
        const interval = setInterval(() => {
            if (loadingProgress < newProgress) {
                loadingProgress++;
                progress.css('width', loadingProgress + '%');
                counter.text(loadingProgress + '%');
            } else {
                clearInterval(interval);
            }

            // When loading reaches 100%, hide preloader
            if (loadingProgress >= 100) {
                setTimeout(() => {
                    preloader.addClass('fade-out');
                    $('body').css('overflow', 'visible');
                }, 500);
            }
        }, 20);
    }

    // Track image loading
    $('img').each(function() {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress; // Count errors as loaded to avoid hanging
        img.src = this.src;
    });

    // Simulate loading of CSS and JS files
    for (let i = 0; i < 5; i++) {
        setTimeout(updateProgress, 500 * i);
    }

    // Ensure preloader hides even if assets don't load properly
    setTimeout(() => {
        loadingProgress = 100;
        progress.css('width', '100%');
        counter.text('100%');

        setTimeout(() => {
            preloader.addClass('fade-out');
            $('body').css('overflow', 'visible');
        }, 500);
    }, 5000);

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
    const contactForm = $('#contact-form');
    if (contactForm.length) {
        contactForm.on('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            const alert = $(this).find('.alert');
            alert.addClass('success').text('Thank you for your message! I will get back to you soon.').show();
            setTimeout(() => {
                alert.fadeOut();
            }, 5000);
            this.reset();
        });
    }

    // 3D Project Card Effects
    $('.projects .card').each(function() {
        $(this).on('mousemove', function(e) {
            const card = $(this);
            const cardRect = card[0].getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            // Calculate mouse position relative to card center
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calculate rotation (max 10 degrees)
            const rotateY = mouseX * 0.01;
            const rotateX = -mouseY * 0.01;

            // Apply transform
            card.css('transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);

            // Add shine effect
            const shine = card.find('.box');
            if (shine.length) {
                const percentX = (e.clientX - cardRect.left) / cardRect.width * 100;
                const percentY = (e.clientY - cardRect.top) / cardRect.height * 100;
                shine.css('background', `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`);
            }

            // Animate tech badges
            card.find('.tech-badge').each(function(index) {
                $(this).css({
                    'transition-delay': (index * 0.05) + 's',
                    'transform': 'translateY(-5px)'
                });
            });
        });

        $(this).on('mouseleave', function() {
            const card = $(this);
            // Reset transform
            card.css('transform', 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');

            // Reset shine
            const shine = card.find('.box');
            if (shine.length) {
                shine.css('background', '');
            }

            // Reset tech badges
            card.find('.tech-badge').each(function() {
                $(this).css({
                    'transition-delay': '0s',
                    'transform': 'translateY(0)'
                });
            });
        });
    });

    // Global cursor tracking for all sections
    const cursor = document.getElementById('cursor');

    if (cursor) {
        // Global mousemove event that works across all sections
        window.addEventListener('mousemove', function(e) {
            // Update cursor position
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Make sure cursor is visible when scrolling between sections
        window.addEventListener('scroll', function() {
            // Keep cursor visible during scrolling
            cursor.style.display = 'block';
        });
    }

    // Initialize particles.js if element exists
    if ($('#particles-js').length) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // Floating Navigation Menu
    const floatingNav = $('.floating-nav');
    if (floatingNav.length) {
        const floatingNavToggle = $('.floating-nav-toggle');
        const navLinks = $('.floating-nav-menu li a');

        // Show floating nav after scrolling down
        $(window).scroll(function() {
            if ($(window).scrollY > 300) {
                floatingNav.addClass('active');
            } else {
                floatingNav.removeClass('active');
            }
        });

        // Toggle floating nav menu
        floatingNavToggle.click(function() {
            floatingNav.toggleClass('expanded');
        });

        // Smooth scroll for nav links
        navLinks.click(function(e) {
            e.preventDefault();
            const targetId = $(this).attr('href');
            const targetSection = $(targetId);
            if (targetSection.length) {
                $('html, body').animate({
                    scrollTop: targetSection.offset().top
                }, 800);
            }
        });

        // Highlight active section in floating nav
        $(window).scroll(function() {
            let current = '';
            const sections = $('section');

            sections.each(function() {
                const sectionTop = $(this).offset().top;
                const sectionHeight = $(this).height();
                if ($(window).scrollTop() >= (sectionTop - 300)) {
                    current = $(this).attr('id');
                }
            });

            navLinks.removeClass('active');
            navLinks.filter(`[href="#${current}"]`).addClass('active');
        });
    }
});
