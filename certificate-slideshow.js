// Enhanced Certificate Slideshow JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all slides and dots
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Animation types for variety
    const animationTypes = [
        'slide-left',
        'slide-right',
        'slide-up',
        'slide-down',
        'slide-zoom-in',
        'slide-zoom-out',
        'slide-rotate',
        'slide-flip',
        'fade'
    ];

    // Initialize slideshow
    let slideIndex = 0;
    let slideInterval;
    let isAnimating = false;

    // Show the first slide
    showSlide(0);

    // Start automatic slideshow
    startSlideshow();

    // Add event listeners to navigation buttons with improved click feedback
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;

            // Add click animation
            prevBtn.classList.add('btn-clicked');
            setTimeout(() => {
                prevBtn.classList.remove('btn-clicked');
            }, 300);

            showSlide(slideIndex - 1);
            resetTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;

            // Add click animation
            nextBtn.classList.add('btn-clicked');
            setTimeout(() => {
                nextBtn.classList.remove('btn-clicked');
            }, 300);

            showSlide(slideIndex + 1);
            resetTimer();
        });
    }

    // Add event listeners to dots with improved visual feedback
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating || index === slideIndex) return;

            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('dot-ripple');
            dot.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

            showSlide(index);
            resetTimer();
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;

        if (e.key === 'ArrowLeft') {
            showSlide(slideIndex - 1);
            resetTimer();

            // Highlight prev button
            if (prevBtn) {
                prevBtn.classList.add('btn-highlight');
                setTimeout(() => {
                    prevBtn.classList.remove('btn-highlight');
                }, 300);
            }
        } else if (e.key === 'ArrowRight') {
            showSlide(slideIndex + 1);
            resetTimer();

            // Highlight next button
            if (nextBtn) {
                nextBtn.classList.add('btn-highlight');
                setTimeout(() => {
                    nextBtn.classList.remove('btn-highlight');
                }, 300);
            }
        }
    });

    // Pause slideshow on hover with improved visual feedback
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);

            // Show navigation buttons more prominently on hover
            if (prevBtn) prevBtn.classList.add('btn-visible');
            if (nextBtn) nextBtn.classList.add('btn-visible');
        });

        slideshowContainer.addEventListener('mouseleave', () => {
            startSlideshow();

            // Hide navigation buttons when not hovering
            if (prevBtn) prevBtn.classList.remove('btn-visible');
            if (nextBtn) nextBtn.classList.remove('btn-visible');
        });
    }

    // Function to show a specific slide with enhanced animations
    function showSlide(n) {
        if (isAnimating) return;
        isAnimating = true;

        // Handle index boundaries
        let newIndex;
        if (n >= slides.length) {
            newIndex = 0;
        } else if (n < 0) {
            newIndex = slides.length - 1;
        } else {
            newIndex = n;
        }

        // Get current and next slides
        const currentSlide = slides[slideIndex];
        const nextSlide = slides[newIndex];

        // Determine animation direction
        const direction = newIndex > slideIndex ?
            (newIndex === 0 && slideIndex === slides.length - 1 ? 'prev' : 'next') :
            (newIndex === slides.length - 1 && slideIndex === 0 ? 'next' : 'prev');

        // Remove any existing animation classes
        slides.forEach(slide => {
            animationTypes.forEach(type => {
                slide.classList.remove(type);
            });
        });

        // Add appropriate animation classes
        const exitAnimation = direction === 'next' ? 'slide-left' : 'slide-right';
        const enterAnimation = direction === 'next' ? 'slide-right' : 'slide-left';

        // Apply exit animation to current slide
        currentSlide.classList.add(exitAnimation);
        currentSlide.style.opacity = '0';
        currentSlide.classList.remove('active');

        // Apply enter animation to next slide
        nextSlide.classList.add(enterAnimation);
        nextSlide.style.opacity = '1';
        nextSlide.classList.add('active');

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active-dot');
            if (index === newIndex) {
                dot.classList.add('active-dot');
            }
        });

        // Update slideIndex
        slideIndex = newIndex;

        // Reset animation state after transition
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Function to start the automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(() => {
            if (!isAnimating) {
                showSlide(slideIndex + 1);
            }
        }, 5000); // Change slide every 5 seconds
    }

    // Function to reset the timer
    function resetTimer() {
        clearInterval(slideInterval);
        startSlideshow();
    }

    // Add touch swipe support for mobile devices with improved feedback
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;

            // Add visual feedback for touch start
            slideshowContainer.classList.add('touch-active');
        }, false);

        slideshowContainer.addEventListener('touchmove', (e) => {
            // Add visual feedback during swipe
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;

            // Only apply visual feedback if horizontal swipe is significant
            if (Math.abs(diff) > 20) {
                if (diff > 0) {
                    slideshowContainer.classList.add('swipe-right');
                    slideshowContainer.classList.remove('swipe-left');
                } else {
                    slideshowContainer.classList.add('swipe-left');
                    slideshowContainer.classList.remove('swipe-right');
                }
            }
        }, false);

        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            // Remove visual feedback
            slideshowContainer.classList.remove('touch-active');
            slideshowContainer.classList.remove('swipe-left');
            slideshowContainer.classList.remove('swipe-right');

            handleSwipe();
        }, false);
    }

    function handleSwipe() {
        // Calculate horizontal and vertical distance
        const horizontalDist = touchEndX - touchStartX;
        const verticalDist = touchEndY - touchStartY;

        // Only process as swipe if horizontal movement is greater than vertical
        // and exceeds minimum threshold
        if (Math.abs(horizontalDist) > Math.abs(verticalDist) && Math.abs(horizontalDist) > 50) {
            if (horizontalDist < 0) {
                // Swipe left - show next slide
                showSlide(slideIndex + 1);
                resetTimer();
            } else {
                // Swipe right - show previous slide
                showSlide(slideIndex - 1);
                resetTimer();
            }
        }
    }

    // Add parallax effect to certificates on mouse move
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mousemove', (e) => {
            const activeSlide = document.querySelector('.slide.active');
            if (!activeSlide) return;

            const slideRect = slideshowContainer.getBoundingClientRect();
            const slideX = slideRect.left + slideRect.width / 2;
            const slideY = slideRect.top + slideRect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const offsetX = (mouseX - slideX) / 30;
            const offsetY = (mouseY - slideY) / 30;

            activeSlide.querySelector('img').style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            // Add subtle shadow movement
            activeSlide.style.boxShadow = `${-offsetX/3}px ${-offsetY/3}px 20px rgba(0,0,0,0.3)`;
        });

        // Reset transform on mouse leave
        slideshowContainer.addEventListener('mouseleave', () => {
            const activeSlide = document.querySelector('.slide.active');
            if (!activeSlide) return;

            activeSlide.querySelector('img').style.transform = 'translate(0, 0)';
            activeSlide.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        });
    }

    // Initialize the shine effect for all slides
    slides.forEach(slide => {
        // Make sure shine effect exists
        if (!slide.querySelector('.shine-effect')) {
            const shineEffect = document.createElement('div');
            shineEffect.className = 'shine-effect';
            slide.appendChild(shineEffect);
        }
    });

    // Add 3D tilt effect to the active certificate
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mousemove', (e) => {
            const activeSlide = document.querySelector('.slide.active');
            if (!activeSlide) return;

            const slideRect = slideshowContainer.getBoundingClientRect();
            const slideX = slideRect.left + slideRect.width / 2;
            const slideY = slideRect.top + slideRect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const rotateY = (mouseX - slideX) / 20;
            const rotateX = (slideY - mouseY) / 20;

            activeSlide.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        // Reset transform on mouse leave
        slideshowContainer.addEventListener('mouseleave', () => {
            const activeSlide = document.querySelector('.slide.active');
            if (!activeSlide) return;

            activeSlide.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
});