// contact-form.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const loader = document.getElementById('loader');
    
    if (!contactForm) return;
    
    // URL de tu Google Apps Script
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
            
            // Manejar respuesta JSON
            const result = await response.json();
            
            if (result.status === "success") {
                showStatusMessage(result.message, 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showStatusMessage(error.message || 'Error de conexión. Por favor, intente nuevamente.', 'error');
        } finally {
            loader.style.display = 'none';
        }
    });
    
    // Función para mostrar mensajes de estado
    function showStatusMessage(message, type) {
        statusMessage.innerHTML = message;
        statusMessage.className = 'status-message'; // Resetear clases
        statusMessage.classList.add(`status-${type}`);
        statusMessage.style.display = 'block';
        
        // Desplazar la vista al mensaje
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ocultar el mensaje después de 10 segundos (solo para éxito)
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 10000);
        }
    }
});

// Función para manejar errores de la API
function handleApiError(response) {
    if (!response.ok) {
        // Error HTTP (404, 500, etc.)
        return `Error ${response.status}: ${response.statusText}`;
    }
    return null;
}

// Luego modifica el bloque de fetch:
const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});

// Verificar errores HTTP
const httpError = handleApiError(response);
if (httpError) {
    throw new Error(httpError);
}

// Procesar respuesta JSON
const result = await response.json();