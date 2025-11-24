

// 1. EVENTO SCROLL: Cambiar estilo del menú al bajar
window.addEventListener('scroll', () => {
    const header = document.getElementById('encabezado');
    if (window.scrollY > 50) {
        header.classList.add('scroll-activo');
    } else {
        header.classList.remove('scroll-activo');
    }
});

// 2. VALIDACIÓN DE FORMULARIO (Para contacto.html)
const formulario = document.querySelector('form');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío real para demo
        
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        
        // Validación simple
        if (nombre.length < 3) {
            alert("Por favor, ingresa un nombre válido.");
            return;
        }
        if (telefono.length < 7) {
            alert("El teléfono parece incorrecto.");
            return;
        }

        alert(`¡Gracias ${nombre}! Hemos recibido tu consulta. Te llamaremos al ${telefono}.`);
        formulario.reset();
    });
}

// 3. INTERACTIVIDAD EN SERVICIOS
// Resalta la fila de la tabla al pasar el mouse
const filasTabla = document.querySelectorAll('.tabla-planes tbody tr');
filasTabla.forEach(fila => {
    fila.addEventListener('mouseenter', () => {
        fila.style.backgroundColor = "#e0f7fa"; // Color suave al pasar mouse
        fila.style.cursor = "pointer";
    });
    fila.addEventListener('mouseleave', () => {
        fila.style.backgroundColor = ""; // Restaurar color
    });
});

