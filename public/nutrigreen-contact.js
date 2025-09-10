// nutrigreen-contact.js

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario
    const contactForm = document.getElementById('contactForm');
    
    // Si el formulario existe, agregar el event listener
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Función para manejar el envío del formulario
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validación básica
        if (!name || !email || !subject || !message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }
        
        // Simulación de envío (en un caso real, aquí se conectaría con un backend)
        showNotification('Enviando tu mensaje...', 'success');
        
        setTimeout(function() {
            // Redirigir a cliente de correo
            const body = `Nombre: ${name}%0D%0AEmail: ${email}%0D%0AAsunto: ${subject}%0D%0A%0D%0A${message}`;
            window.location.href = `mailto:soporte.nutrigreen@outlook.es?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Resetear formulario
            contactForm.reset();
            
            // Mostrar mensaje de confirmación
            setTimeout(function() {
                showNotification('¡Mensaje enviado! Te responderemos en menos de 24 horas.', 'success');
            }, 1000);
        }, 1500);
    }
    
    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        // Ocultar notificación después de 5 segundos
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }
});