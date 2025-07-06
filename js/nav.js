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

    // Inicializar Swiper
    const swiper = new Swiper('.swiper', {
    loop: true,
    slidesPerView: 1,  // Mostrar solo un slide a la vez
    spaceBetween: 0,   // Sin espacio entre slides
    pagination: { /*...*/ },
    navigation: { /*...*/ },
    autoplay: { /*...*/ },
    effect: 'slide',   // Efecto deslizante
    speed: 800         // Velocidad de transición
});
});





