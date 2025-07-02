document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.news-card');
    const cardWidth = cards[0].offsetWidth + 24; // Ancho + gap
    let currentPosition = 0;

    // Clonar los primeros elementos y añadirlos al final para efecto infinito
    const firstCards = Array.from(cards).slice(0, 3).map(card => card.cloneNode(true));
    firstCards.forEach(card => {
        sliderTrack.appendChild(card);
    });

    // Avanzar
    nextBtn.addEventListener('click', () => {
        currentPosition -= cardWidth;
        sliderTrack.style.transition = 'transform 0.5s ease';
        sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        
        // Reiniciar posición al llegar al final (sin animación)
        if (currentPosition <= -cardWidth * cards.length) {
            setTimeout(() => {
                sliderTrack.style.transition = 'none';
                currentPosition = 0;
                sliderTrack.style.transform = `translateX(${currentPosition}px)`;
            }, 500);
        }
    });

    // Retroceder
    prevBtn.addEventListener('click', () => {
        if (currentPosition === 0) {
            // Saltar a los clones (falso "inicio")
            sliderTrack.style.transition = 'none';
            currentPosition = -cardWidth * cards.length;
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
            setTimeout(() => {
                sliderTrack.style.transition = 'transform 0.5s ease';
                currentPosition += cardWidth;
                sliderTrack.style.transform = `translateX(${currentPosition}px)`;
            }, 20);
        } else {
            currentPosition += cardWidth;
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });

    // Auto-desplazamiento opcional (autoplay)
    let autoplay = setInterval(() => {
        nextBtn.click();
    }, 3000);

    // Pausar autoplay al interactuar
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(autoplay);
    });
    sliderTrack.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => {
            nextBtn.click();
        }, 3000);
    });
});