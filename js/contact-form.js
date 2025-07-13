document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const statusMessage = document.getElementById('status-message');
  const loader = document.getElementById('loader');

  if (!contactForm) {
    console.error('Formulario no encontrado. Verifica el ID "contact-form".');
    return;
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyqZBPUH_cWxzH2ylZ8JH_HIJkxCgmMAgtSFTMiKXW5l7hp8JRNkI6N8_f0lf8R9f2Sg/exec';

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    console.log('Evento submit disparado');

    const privacyCheckbox = document.getElementById('privacidad');
    if (!privacyCheckbox.checked) {
      showStatusMessage('Debe aceptar la política de privacidad', 'error');
      return;
    }

    loader.style.display = 'block';
    statusMessage.style.display = 'none';

    try {
      const formData = {
        lugarFecha: document.getElementById('lugar-fecha').value,
        asunto: document.getElementById('asunto').value,
        cuerpo: document.getElementById('cuerpo').value,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        destinatario: document.getElementById('destinatario').value
      };

      console.log('Enviando solicitud POST con datos:', formData);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+593\d{9}$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor ingrese un correo electrónico válido');
      }
      if (formData.telefono && !phoneRegex.test(formData.telefono)) {
        throw new Error('Por favor ingrese un número de teléfono válido (Ej: +593981234567)');
      }

      const requiredFields = ['lugarFecha', 'asunto', 'cuerpo', 'nombre', 'email', 'destinatario'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
      if (missingFields.length > 0) {
        const fieldNames = {
          lugarFecha: 'Lugar y fecha',
          asunto: 'Asunto',
          cuerpo: 'Mensaje',
          nombre: 'Nombre completo',
          email: 'Correo electrónico',
          destinatario: 'Destinatario'
        };
        const displayMissingFields = missingFields.map(field => fieldNames[field] || field);
        throw new Error('Por favor complete todos los campos obligatorios: ' + displayMissingFields.join(', '));
      }

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Ocultar el loader y mostrar mensaje de éxito
      loader.style.display = 'none';
      showStatusMessage('Mensaje enviado al GAD Parroquial Sinaí', 'success');
      contactForm.reset();
    } catch (error) {
      loader.style.display = 'none';
      console.error('Error al enviar el formulario:', error);
      showStatusMessage('Error al enviar el formulario: ' + error.message, 'error');
    }
  });

  function showStatusMessage(message, type) {
    statusMessage.innerHTML = `<strong>${type === 'success' ? '✓' : '✗'}</strong> ${message}`;
    statusMessage.className = 'status-message';
    statusMessage.classList.add(`status-${type}`);
    statusMessage.style.display = 'block';
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 10000);
  }
});