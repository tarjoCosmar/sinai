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

   
});

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Elementos del DOM
  const form = e.target;
  const loader = document.getElementById('loader');
  const statusMessage = document.getElementById('status-message');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Configuración inicial
  submitBtn.disabled = true;
  loader.style.display = 'block';
  statusMessage.style.display = 'none';
  statusMessage.innerHTML = '';

  try {
    // Preparar datos del formulario
    const formData = new URLSearchParams();
    form.querySelectorAll('input, textarea, select').forEach(element => {
      if (element.name) {
        formData.append(element.name, element.type === 'checkbox' ? (element.checked ? 'on' : 'off') : element.value);
      }
    });

    // Enviar a tu Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbyryH8ygMDZdVqjLqpn2R6sov5vJpESZ2Vr7E1YcSoIJnTr6o_wbIi56Gf2Y1l7836Ccg/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();

    // Manejar respuesta
    if (result.result === 'success') {
      statusMessage.innerHTML = `
        <div class="alert success">
          <i class="fas fa-check-circle"></i>
          <div>
            <p><strong>¡Comunicación enviada con éxito!</strong></p>
            <p>Hemos enviado una copia a su correo electrónico.</p>
            <p>Nos pondremos en contacto pronto.</p>
          </div>
        </div>
      `;
      form.reset();
    } else {
      throw new Error(result.message || 'Error al procesar el formulario');
    }
  } catch (error) {
    statusMessage.innerHTML = `
      <div class="alert error">
        <i class="fas fa-exclamation-circle"></i>
        <div>
          <p><strong>Error en el envío</strong></p>
          <p>${error.message || 'Por favor intente nuevamente más tarde'}</p>
        </div>
      </div>
    `;
  } finally {
    loader.style.display = 'none';
    statusMessage.style.display = 'block';
    submitBtn.disabled = false;
  }
});




