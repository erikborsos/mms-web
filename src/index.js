import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const theme = localStorage.getItem("theme");
if (
    theme === "dark" ||
    (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".parallax-pin").forEach(section => {
    const inner = section.querySelector(".parallax-inner");
    const content = section.querySelector(".parallax-content");

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: inner,
        scrub: true,
    });

    gsap.to(content, {
        y: -700,
        opacity: 1,
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });
});

const fadeUps = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeUps.forEach(el => observer.observe(el));