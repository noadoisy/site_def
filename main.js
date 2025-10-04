window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.main-content').style.display = 'block';
    }, 1200);

    // Contact form (simple validation)
    const form = document.querySelector('.form-contact');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message !');
            form.reset();
        });
    }
});

// Gestion du thème (clair/sombre) et sauvegarde en session/localStorage
function setTheme(mode) {
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    document.getElementById('theme-toggle').innerHTML = mode === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
function toggleTheme() {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}
document.addEventListener('DOMContentLoaded', () => {
    // Loader animation
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1500);
    // Thème initial
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});
