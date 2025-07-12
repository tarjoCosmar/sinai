document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const loader = document.getElementById('loader');
    
    if (!contactForm) return;
    
    // URL de tu Google Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwleQks_f4IVFCOfjpaDFkpxxBbgeIdWiJTf9AejhAFNr3KUE-o8dX7L3HuHNu_zZdk/exec';
    
    // Asegúrate de que esta función sea ASYNC
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
            if (!phoneRegex.test(formData.telefono)) {
                throw new Error('Por favor ingrese un número de teléfono válido (Ej: +593981234567)');
            }
            
            // Validar campos obligatorios
            const requiredFields = ['lugarFecha', 'asunto', 'cuerpo', 'nombre', 'email', 'telefono'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                throw new Error('Por favor complete: ' + missingFields.join(', '));
            }
            
            // Enviar datos a Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Manejar respuesta JSON
            const result = await response.json();
            
            if (result.status === "success") {
                showStatusMessage(result.message, 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Detalles del error:', error);
                let errorMessage = error.message;
                if (error.name === 'TypeError') {
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