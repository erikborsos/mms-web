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