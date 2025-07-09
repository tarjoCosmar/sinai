document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Menú hamburguesa
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
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

    // Inicializar Swiper sin botones de navegación
    const swiper = new Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        effect: 'slide',
        speed: 800
    });

   // formulario 
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const destinatario = "tu-correo@gadsinai.gob.ec";
  const asunto = `Formulario GAD: ${data.asunto}`;
  
  const cuerpo = `
  Lugar/fecha: ${data.lugarFecha}
  Mensaje: ${data.cuerpo}
  
  Remitente:
  Nombre: ${data.nombre}
  Email: ${data.email}
  Teléfono: ${data.telefono}
  `;

  MailApp.sendEmail(destinatario, asunto, cuerpo);
  return ContentService.createTextOutput("Éxito");
}


});




