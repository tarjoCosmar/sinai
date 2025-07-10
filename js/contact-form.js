// contact-form.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const loader = document.getElementById('loader');
    
    // Si no hay formulario en esta página, salimos
    if (!contactForm) return;
    
    // URL de tu Google Apps Script (REEMPLAZA ESTO)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhZgIWdYAQLiJrk8HC9hAWoGaV1XJbnu-J_V7kTbEa6ERsTWrhSubHoVkNtaP--_ly/exec';
    
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
            // Recolectar datos del formulario
            const formData = {
                lugarFecha: document.getElementById('lugar-fecha').value,
                asunto: document.getElementById('asunto').value,
                destinatario: document.getElementById('destinatario').value,
                cuerpo: document.getElementById('cuerpo').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value
            };
            
            // Validar campos obligatorios
            if (!formData.lugarFecha || !formData.asunto || !formData.cuerpo || 
                !formData.nombre || !formData.email) {
                throw new Error('Por favor complete todos los campos obligatorios');
            }
            
            // Enviar datos a Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.text();
            
            // Manejar respuesta
            if (result === 'Éxito') {
                showStatusMessage('¡Mensaje enviado con éxito! Te responderemos a la brevedad.', 'success');
                contactForm.reset();
            } else {
                throw new Error(result);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showStatusMessage('Error: ' + error.message, 'error');
        } finally {
            loader.style.display = 'none';
        }
    });
    
    // Función para mostrar mensajes de estado
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message'; // Resetear clases
        statusMessage.classList.add(`status-${type}`);
        statusMessage.style.display = 'block';
        
        // Desplazar la vista al mensaje
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});