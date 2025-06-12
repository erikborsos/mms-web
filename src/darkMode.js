document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkToggle"); // Reference to the toggle button
    const html = document.documentElement; // Reference to the <html> root element

    // Apply theme stored in localStorage (if available)
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
        html.classList.add("dark"); // Enable dark mode
    } else if (storedTheme === "light") {
        html.classList.remove("dark"); // Enable light mode
    }

    // Add click event to toggle dark/light mode manually
    toggleButton.addEventListener("click", () => {
        const isDark = html.classList.toggle("dark"); // Toggle class on <html>

        // Save user preference in localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Small click animation (scale down briefly)
        toggleButton.classList.add("scale-90");
        setTimeout(() => toggleButton.classList.remove("scale-90"), 150);
    });
});