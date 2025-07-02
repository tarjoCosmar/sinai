document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        // Alternar clases "active"
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});