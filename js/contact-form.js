document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const loader = document.getElementById('loader');

    if (!contactForm) return;

    // URL de tu Google Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKi7Dd20BcOS9AXari2tpIXMMtf-oVeeh86KOEN8jarq6CIoj4kCTOKuAdx502CHoHRQ/exec';

    // ¡CAMBIO AQUÍ! Añadir 'async' a la función de submit
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar el checkbox de privacidad
        const privacyCheckbox = document.getElementById('privacidad');
        if (!privacyCheckbox.checked) {
            showStatusMessage('Debe aceptar la política de privacidad', 'error');
            return;
        }

        // Mostrar loader y ocultar mensajes
        loader.style.display = 'block';
        statusMessage.style.display = 'none';

        try {
            // Recolectar los datos del formulario
            const formData = {
                lugarFecha: document.getElementById('lugar-fecha').value,
                asunto: document.getElementById('asunto').value,
                destinatario: document.getElementById('destinatario').value,
                cuerpo: document.getElementById('cuerpo').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value
            };

            // Validar formato de correo y teléfono
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+593\d{9}$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Por favor ingrese un correo electrónico válido');
            }
            // Pequeña corrección en la validación del teléfono para ser más flexible si fuera necesario
            // El regex actual /^\+593\d{9}$/ es bastante estricto y excelente para Ecuador.
            // Si necesitas flexibilidad (ej. 09... o 02...), ajusta el regex.
            if (!phoneRegex.test(formData.telefono)) {
                throw new Error('Por favor ingrese un número de teléfono válido (Ej: +593981234567)');
            }

            // Validar campos obligatorios
            const requiredFields = ['lugarFecha', 'asunto', 'cuerpo', 'nombre', 'email', 'telefono'];
            const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === ''); // Agregada validación de trim()
            
            if (missingFields.length > 0) {
                // Formatear el mensaje para ser más legible
                const fieldNames = {
                    lugarFecha: 'Lugar y fecha',
                    asunto: 'Asunto',
                    cuerpo: 'Mensaje',
                    nombre: 'Nombre completo',
                    email: 'Correo electrónico',
                    telefono: 'Teléfono de contacto'
                };
                const displayMissingFields = missingFields.map(field => fieldNames[field] || field);
                throw new Error('Por favor complete todos los campos obligatorios: ' + displayMissingFields.join(', '));
            }

            /****************************************************
             * FETCH POR ASYNC/AWAIT (RECOMENDADO) *
             ****************************************************/
            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors', // Crucial para CORS
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Lee el texto para depuración
                    console.error('Respuesta de error completa:', errorText); // Log para depuración
                    throw new Error(`Error de red o servidor (${response.status} ${response.statusText}).`);
                }

                const result = await response.json();

                if (result.status === "success") {
                    showStatusMessage(result.message, 'success');
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Error desconocido del servidor');
                }

            } catch (fetchError) { // Cambiado el nombre de la variable para evitar conflicto
                loader.style.display = 'none';
                console.error('Error al enviar el formulario (fetch):', fetchError);
                showStatusMessage('Error al enviar el formulario: ' + fetchError.message, 'error');
            }

        } catch (validationError) { // Cambiado el nombre de la variable para errores de validación iniciales
            loader.style.display = 'none';
            console.error('Detalles del error de validación:', validationError);
            let errorMessage = validationError.message;
            
            // Esta parte podría ser redundante si todos los errores son 'Error'
            // pero se mantiene por si acaso hay un TypeError específico no capturado
            if (validationError.name === 'TypeError') {
                errorMessage = 'Error de conexión con el servidor. Verifica la URL: ' + SCRIPT_URL;
            }
            
            showStatusMessage(errorMessage, 'error');
        }
    });

    // Función para mostrar mensajes de estado
    function showStatusMessage(message, type) {
        statusMessage.innerHTML = `<strong>${type === 'success' ? '✓' : '✗'}</strong> ${message}`;
        statusMessage.className = 'status-message';
        statusMessage.classList.add(`status-${type}`);
        statusMessage.style.display = 'block';

        // Desplazar la vista al mensaje
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Ocultar el mensaje después de 10 segundos
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 10000);
    }
});