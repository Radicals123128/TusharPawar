// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Locomotive Scroll for smooth scrolling
const locoScroll = new LocomotiveScroll({
    el: document.querySelector('body'),
    smooth: true,
    multiplier: 1,
    smartphone: { smooth: true },
    tablet: { smooth: true }
});

// Update ScrollTrigger when locomotive scroll updates
locoScroll.on("scroll", ScrollTrigger.update);

// Tell ScrollTrigger to use these proxy methods
ScrollTrigger.scrollerProxy('body', {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    }
});

// Project cards animation with GSAP
document.addEventListener("DOMContentLoaded", function() {
    // Create a timeline for project cards with a slideshow effect
    const projectTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            markers: false
        }
    });
    
    // Staggered entrance for project cards with different directions
    gsap.set(".projects .card", { opacity: 0, y: 100 });
    
    // First card slides in from left
    projectTimeline.from(".projects .card:nth-child(1)", {
        x: -100,
        y: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Second card slides in from right
    projectTimeline.from(".projects .card:nth-child(2)", {
        x: 100,
        y: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
    
    // Third card slides in from left
    projectTimeline.from(".projects .card:nth-child(3)", {
        x: -100,
        y: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
    
    // Fourth card slides in from right
    projectTimeline.from(".projects .card:nth-child(4)", {
        x: 100,
        y: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
    
    // Fifth card slides in from bottom
    projectTimeline.from(".projects .card:nth-child(5)", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
    
    // Add parallax effect to project icons with rotation
    gsap.utils.toArray(".projects .icon-group i, .projects .box > i").forEach(icon => {
        gsap.to(icon, {
            y: -15,
            rotation: 10,
            scrollTrigger: {
                trigger: icon.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
    
    // Add 3D tilt effect to project cards with depth
    const cards = document.querySelectorAll('.projects .card');
    cards.forEach(card => {
        // Create a shine effect element
        const shine = document.createElement('div');
        shine.classList.add('card-shine');
        shine.style.position = 'absolute';
        shine.style.top = '0';
        shine.style.left = '0';
        shine.style.right = '0';
        shine.style.bottom = '0';
        shine.style.background = 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)';
        shine.style.opacity = '0';
        shine.style.transition = 'opacity 0.3s';
        shine.style.pointerEvents = 'none';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(shine);
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width - 0.5;
            const yPercent = y / rect.height - 0.5;
            
            // Update shine position
            shine.style.setProperty('--x', x + 'px');
            shine.style.setProperty('--y', y + 'px');
            shine.style.opacity = '1';
            
            gsap.to(this, {
                rotationY: xPercent * 10,
                rotationX: yPercent * -10,
                transformPerspective: 1000,
                z: 50, // Add depth
                boxShadow: `${xPercent * 20}px ${yPercent * 20}px 30px rgba(0,0,0,0.15)`,
                duration: 0.5,
                ease: "power1.out"
            });
            
            // Move content slightly for parallax effect
            gsap.to(this.querySelector('.box'), {
                x: xPercent * 20,
                y: yPercent * 20,
                duration: 0.5,
                ease: "power1.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Hide shine effect
            shine.style.opacity = '0';
            
            gsap.to(this, {
                rotationY: 0,
                rotationX: 0,
                z: 0,
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                duration: 0.5,
                ease: "power1.out"
            });
            
            // Reset content position
            gsap.to(this.querySelector('.box'), {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power1.out"
            });
        });
    });
    
    // Create a horizontal scroll effect for the projects section on desktop
    if (window.innerWidth > 768) {
        const projectCards = gsap.utils.toArray('.projects .card');
        
        gsap.to(projectCards, {
            xPercent: -100 * (projectCards.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".project-content",
                start: "top center",
                end: "+=2000",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                markers: false
            }
        });
    }
});

// Update ScrollTrigger when the window resizes
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();