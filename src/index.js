// Import GSAP animation library and ScrollTrigger plugin
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

var moveContent = -700;

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Set up scroll-triggered parallax pinning and animation for each section
gsap.utils.toArray(".parallax-pin").forEach(section => {
    const inner = section.querySelector(".parallax-inner"); // Get inner content to pin
    const content = section.querySelector(".parallax-content"); // Get content to animate

    // Pin section during scroll
    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: inner,
        scrub: true, // Smooth scroll sync
    });

    // Animate the content while scrolling
    gsap.to(content, {
        y: moveContent, // Move up
        opacity: 1, // Ensure visibility
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true, // Animate in sync with scroll
        }
    });
});

// Fade-in effect for elements with .fade-up class
const fadeUps = document.querySelectorAll('.fade-up');

// Create intersection observer to detect when elements enter the viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Trigger fade-in by adding class
        }
    });
}, { threshold: 0.1 }); // Element must be at least 10% visible

// Observe all fade-up elements
fadeUps.forEach(el => observer.observe(el));