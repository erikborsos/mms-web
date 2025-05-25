import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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


const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkToggle");
    const html = document.documentElement;

    // Theme aus localStorage anwenden
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
        html.classList.add("dark");
    } else if (storedTheme === "light") {
        html.classList.remove("dark");
    }

    toggleButton.addEventListener("click", () => {
        const isDark = html.classList.toggle("dark");

        localStorage.setItem("theme", isDark ? "dark" : "light");

        // kleine Klickanimation
        toggleButton.classList.add("scale-90");
        setTimeout(() => toggleButton.classList.remove("scale-90"), 150);
    });
});