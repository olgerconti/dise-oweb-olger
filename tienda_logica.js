/* Lógica de la Tienda: Filtros, Modal, Carrito y Clases */

const IMPUESTO_IGV = 0.18;

// --- CLASES ---
class Producto {
    constructor(id, nombre, precio, imagen, categoria, caracteristicas) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria; 
        this.caracteristicas = caracteristicas;
    }
}

class Hardware extends Producto {
    constructor(id, nombre, precio, imagen, categoria, caracteristicas, pesoKg) {
        super(id, nombre, precio, imagen, categoria, caracteristicas);
        this.pesoKg = pesoKg;
    }
    calcularEnvio() { return this.pesoKg * 5; } 
}

class Software extends Producto {
    constructor(id, nombre, precio, imagen, categoria, caracteristicas) {
        super(id, nombre, precio, imagen, categoria, caracteristicas);
    }
    calcularEnvio() { return 0; } 
}

// --- BASE DE DATOS ---
const inventario = new Map();

inventario.set(1, new Hardware(1, "Laptop HP Pavilion Gaming", 3200.00, "img/laptop_hppavilon.jpg", "computo", 
    ["Procesador Intel Core i5", "8GB RAM DDR4", "512GB SSD NVMe", "Tarjeta Gráfica GTX 1650"], 2.5));

inventario.set(2, new Hardware(2, "PC Escritorio Corporativa", 1800.00, "img/pc-escritorio.png", "computo", 
    ["Case Torre ATX", "Intel Core i3 12va Gen", "Monitor 24'' FHD", "Teclado y Mouse incluidos"], 8.0));

inventario.set(3, new Hardware(3, "Disco Sólido SSD 480GB", 150.00, "img/ssd-sata.png", "componentes", 
    ["Formato 2.5 SATA", "Velocidad 500MB/s", "Ideal para revivir PCs lentas", "Garantía 1 año"], 0.2));

inventario.set(4, new Hardware(4, "Kit Cableado Estructurado", 250.00, "img/Kit-Cableado.jpg", "componentes", 
    ["Bobina UTP Cat6 100m", "Conectores RJ45 x50", "Crimpadora profesional", "Tester de red"], 3.5));

inventario.set(5, new Hardware(5, "Smartphone Samsung A54", 1400.00, "img/sansumg-a54.png", "celulares", 
    ["Pantalla Super AMOLED", "Cámara 50MP", "Batería 5000mAh", "Resistente al agua IP67"], 0.5));

inventario.set(6, new Software(6, "Licencia Windows 11 Pro", 80.00, "img/licencia_win11pro.png", "software", 
    ["Licencia Original OEM", "Activación permanente", "Soporte de actualizaciones", "Envío digital inmediato"]));

inventario.set(7, new Software(7, "Antivirus ESET Nod32", 45.00, "img/licencia-esetnot32.png", "software", 
    ["Protección 1 año", "1 Dispositivo", "Anti-Ransomware", "Modo Gamer incluido"]));

let carrito = [];

// --- RENDERIZADO ---
const renderizarTienda = (filtro = 'todos') => {
    const contenedor = document.getElementById('contenedor-productos');
    if(!contenedor) return; 
    contenedor.innerHTML = ''; 

    inventario.forEach((producto) => {
        if (filtro !== 'todos' && producto.categoria !== filtro) return;

        const div = document.createElement('div');
        div.classList.add('card-producto');
        div.onclick = (e) => {
            if(!e.target.classList.contains('btn-comprar')) abrirModal(producto);
        };

        div.innerHTML = `
            <div class="img-container">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span class="badge-oferta">Oferta</span>
            </div>
            <div class="info-producto">
                <h3>${producto.nombre}</h3>
                <p class="categoria-tag">${producto.categoria.toUpperCase()}</p>
                <p class="precio">S/ ${producto.precio.toFixed(2)}</p>
                <button class="btn-comprar" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
};

// Función GLOBAL para filtrar desde el HTML
window.filtrarProductos = function(categoria, elementoBtn) {
    const botones = document.querySelectorAll('.btn-cat');
    botones.forEach(btn => btn.classList.remove('activo'));
    elementoBtn.classList.add('activo');
    renderizarTienda(categoria);
}

// --- MODAL ---
function abrirModal(producto) {
    const modal = document.getElementById('modal-producto');
    const lista = document.getElementById('modal-lista-detalles');
    
    document.getElementById('modal-img').src = producto.imagen;
    document.getElementById('modal-titulo').innerText = producto.nombre;
    document.getElementById('modal-precio').innerText = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-cat').innerText = producto.categoria.toUpperCase();
    
    lista.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        lista.appendChild(li);
    });

    document.getElementById('btn-modal-agregar').onclick = () => {
        agregarAlCarrito(producto.id);
        cerrarModal();
    };

    modal.classList.remove('oculto');
    modal.classList.add('activo');
}

function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    modal.classList.remove('activo');
    setTimeout(() => modal.classList.add('oculto'), 300);
}

// --- CARRITO ---
// Función GLOBAL para agregar al carrito desde el HTML
window.agregarAlCarrito = function(id) {
    if (inventario.has(id)) {
        const prod = inventario.get(id);
        carrito.push(prod);
        actualizarCarritoUI();
        // Opcional: alert(`Has agregado: ${prod.nombre}`);
    }
}

// Función GLOBAL para eliminar del carrito desde el HTML
window.eliminarDelCarrito = function(indice) {
    carrito.splice(indice, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contenedorItems = document.getElementById('carrito-items');
    const spanCount = document.getElementById('contador-carrito');
    let subtotal = 0, costoEnvioTotal = 0;

    contenedorItems.innerHTML = '';

    carrito.forEach((prod, index) => {
        subtotal += prod.precio;
        costoEnvioTotal += prod.calcularEnvio(); 

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-carrito');
        itemDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; width:100%;">
                <img src="${prod.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div style="flex:1;">
                    <strong style="font-size:0.9em; display:block;">${prod.nombre}</strong>
                    <small style="color:#666;">S/ ${prod.precio.toFixed(2)}</small>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="color:#e74c3c; background:none; border:none; cursor:pointer; font-size:1.2em;">&times;</button>
            </div>
        `;
        contenedorItems.appendChild(itemDiv);
    });

    if(carrito.length === 0) contenedorItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';

    const impuestos = subtotal * IMPUESTO_IGV;
    const total = subtotal + impuestos + costoEnvioTotal;

    document.getElementById('carrito-subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('carrito-impuestos').innerText = impuestos.toFixed(2);
    document.getElementById('carrito-envio').innerText = costoEnvioTotal.toFixed(2);
    document.getElementById('carrito-total').innerText = total.toFixed(2);
    
    if(spanCount) spanCount.textContent = carrito.length;
}

function iniciarCuentaRegresiva(segundos) {
    const display = document.getElementById('cuenta-regresiva');
    if (!display) return;
    display.textContent = segundos;
    if (segundos > 0) setTimeout(() => iniciarCuentaRegresiva(segundos - 1), 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('contenedor-productos')) {
        renderizarTienda();
        iniciarCuentaRegresiva(120); 
        
        // Asignar eventos de cierre del modal
        const btnCerrarModal = document.getElementById('cerrar-modal');
        if(btnCerrarModal) btnCerrarModal.onclick = cerrarModal;
        
        const modalProducto = document.getElementById('modal-producto');
        if(modalProducto) {
            modalProducto.onclick = (e) => { if(e.target.id === 'modal-producto') cerrarModal(); };
        }
    }

    const btnAbrir = document.getElementById('btn-abrir-carrito');
    const btnCerrar = document.getElementById('btn-cerrar-carrito');
    const carritoAside = document.getElementById('carrito-lateral');
    const overlay = document.getElementById('overlay');

    const toggleCarrito = (estado) => {
        if(estado) { 
            carritoAside.classList.add('activo'); 
            if(overlay) overlay.classList.add('activo'); 
        } else { 
            carritoAside.classList.remove('activo'); 
            if(overlay) overlay.classList.remove('activo'); 
        }
    };

    if(btnAbrir) btnAbrir.addEventListener('click', () => toggleCarrito(true));
    if(btnCerrar) btnCerrar.addEventListener('click', () => toggleCarrito(false));
    if(overlay) overlay.addEventListener('click', () => { toggleCarrito(false); cerrarModal(); });
});