document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted!");
});

// Toggle dark mode
document.getElementById('toggle-checkbox').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});
