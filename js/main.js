window.addEventListener("load", init);

/* -------- INICIO Funciones de animaciones -------- */
const tipearMensaje = (function () {
    let i = 0;
    let txt = 'Estamos preparando tu iPizza con mucho ';
    let speed = 60;
    return function () {
        if (i < txt.length) {
            document.getElementById("texto-tipeado").innerHTML += txt.charAt(i);
            i++;
            setTimeout(tipearMensaje, speed);
        } else {
            document.getElementById("texto-tipeado").innerHTML += '<i class="fas fa-heart"></i>';
        }
    };
})();

function shakeInicial(el) {
    el.classList.add("shake-on-load");
}

function removeShake() {
    this.classList.remove("shake-on-load");
}
/* -------- FIN Funciones de animaciones -------- */

/* -------- INICIO Funciones de la galeria de imagenes -------- */
function cargarFilaDeImagenes() {
    let imagenesSinMostrar = document.querySelectorAll(".galeria .d-none");
    imagenesSinMostrar[0].classList.remove("d-none");
    AOS.init();

    if(imagenesSinMostrar.length == 1) {
        this.classList.add("d-none");
    }
}
/* -------- FIN Funciones de la galeria de imagenes -------- */

const listaDePrecios = {
    precioPorcion: {
        'muzzarella': 30, 
        'jamon': 42,
        'napolitana': 45,
        'calabresa': 50
    },
    "oregano": 11,
    "aceitunas": 12,
    "doble-queso": 13,
    "cheddar": 14,
    "papas": 20,
    "retiro-en-local": 0,
    "envio-a-domicilio": 100
}

function init() {
    /* Animacion de shake inicial */
    const $btnArmalaHeader = document.getElementById('btn-armala-header');
    $btnArmalaHeader.addEventListener("animationend", removeShake, {once: true});
    shakeInicial($btnArmalaHeader);
  
    
    /* Tipeo h2 en pedidos.html */
    const pathname = location.pathname;
    const paginaActual = pathname.substr(pathname.length - 12);

    switch (paginaActual) {
        case 'pedidos.html':
            document.getElementById("texto-tipeado").innerHTML = "";
            tipearMensaje();
            break;
    }


    /* Carga de imagenes ocultas en nosotros.html */
    const $btnMostrarMasFotos = document.getElementById('btn-mostrar-mas-fotos');
    if ($btnMostrarMasFotos !== null) {
        $btnMostrarMasFotos.addEventListener("click", cargarFilaDeImagenes);
    }

    /* Logica de desplegables en armala.html */
    const $desplegables = document.querySelectorAll('.gustos select');
    let cantDesplegables;

    if ($desplegables !== null) {
        cantDesplegables = $desplegables.length;

        /* Cada Select */
        $desplegables.forEach(asociarEventosADesplegables);

        function asociarEventosADesplegables(desplegable) {
            desplegable.addEventListener('change', calcularCostos);
            desplegable.addEventListener('change', mostrarPorciones);
        }
    }
    
    function mostrarPorciones(event) { // LISTO
        const nombreGusto = event.target.value;
        const nombreGustoPatron = nombreGusto + "Patron";
        const mostrar = (nombreGusto != "Default") ? true : false;

        const IDSelect = obtenerIDdelDesplegable(event);
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();

        const ubicacionEnCanvas = canvasPizza.obtenerUbicacionEnCanvas(IDSelect, iPizzaSeleccionada.cantidadDeGustos);
        canvasPizza.dibujarPorciones(iPizzaSeleccionada.nPorcionesPorGusto, canvasPizza[nombreGustoPatron], ubicacionEnCanvas, mostrar);
    }
    
    function calcularCostos(event) { // LISTO
        let nombreGusto = '***';
        let precioFinalGusto = '***';

        const IDSelect = obtenerIDdelDesplegable(event);
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();

        if (event.target.value != "Default") {
            nombreGusto = event.target.value;
            const precioGusto = listaDePrecios["precioPorcion"][nombreGusto];
            
            precioFinalGusto = iPizzaSeleccionada.nPorcionesPorGusto * precioGusto;
        }

        let $detallePorciones = obtenerDetallePorciones();

        // Muestro los li necesarios
        let liNuevo = crearElementoDeLista(iPizzaSeleccionada.nPorcionesPorGusto, nombreGusto, precioFinalGusto);
        mostrarDetallePorciones($detallePorciones, IDSelect, liNuevo);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }
    
    /* INICIO Control de tarjeta visible en el carousel */
    const $carouselProductos = document.getElementById('armala-carousel-productos');

    if ($carouselProductos !== null) {
        $carouselProductos.addEventListener('slid.bs.carousel', actualizarPaginaArmala);
    }

    function actualizarPaginaArmala() { // LISTO
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();
        
        let $detallePorciones = obtenerDetallePorciones();

        // Oculto todos los desplegables
        for(let i=0; i < cantDesplegables; i++) {
            $desplegables[i].classList.add('d-none');
            $desplegables[i].selectedIndex = 0;
            
            // Muestro los li necesarios
            let liGenerico = crearElementoDeLista(iPizzaSeleccionada.nPorcionesPorGusto, '***', '***', false);
            mostrarDetallePorciones($detallePorciones, i, liGenerico);
        }
        
        $detallePorciones = obtenerDetallePorciones(); // Actualizo la referencia al DOM

        // Muestro los desplegables necesarios
        for(let i=0; i < iPizzaSeleccionada.cantidadDeGustos; i++) {
            $desplegables[i].classList.remove('d-none');
            $detallePorciones[i].classList.toggle('d-none');
        }
        
        canvasPizza.limpiarCanvas();

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }
    /* FIN Control de tarjeta visible en el carousel */

    function obtenerCantidadPorciones(cantidadDeGustos) { //LISTO
        switch(cantidadDeGustos) {
            case 1: {
                return 8;
            }
            case 2: {
                return 4;
            }
            case 4: {
                return 2;
            }
        }
    }

    function obtenerIDdelDesplegable(event) { //LISTO
        return parseInt(event.target.getAttribute('data-ipizza-gusto-num')) - 1;
    }

    function obtenerInfoDeiPizzaSeleccionada() { //LISTO
        const $tarjetaSeleccionada = document.querySelector('.active .tarjeta-de-producto');
        const cantidadDeGustos = parseInt($tarjetaSeleccionada.getAttribute('data-ipizza-cant-gustos'));
        const nPorcionesPorGusto = obtenerCantidadPorciones(cantidadDeGustos);

        return {
            "cantidadDeGustos" : cantidadDeGustos,
            "nPorcionesPorGusto" : nPorcionesPorGusto
        }
    }

    function obtenerDetallePorciones() { //LISTO
        return document.querySelectorAll('.detalle-porciones li');
    }

    function mostrarDetallePorciones($detallePorciones, posicion, elementoNuevo) { //LISTO
        $detallePorciones[posicion].replaceWith(elementoNuevo);
    }

    function obtenerDivPrecio(identificador) { //LISTO
        return document.querySelector(identificador);
    }

    function obtenerDivsPrecio(identificador) { //LISTO
        return document.querySelectorAll(identificador);
    }

    function verificarChecked(identificador) { //LISTO
        const $checkboxs = document.querySelectorAll(identificador);
        let algunoChecked = false;

        $checkboxs.forEach(function(inputCheck) {
            if (inputCheck.checked) {
                algunoChecked = true;
            }
        });

        return algunoChecked;
    }

    const UBICACION_EN_DETALLE_EXTRAS = [
        'oregano',
        'aceitunas',
        'doble-queso',
        'cheddar'
    ]

    function obtenerUbicacionDetalleExtras(IDCheckbox) { //LISTO
        return UBICACION_EN_DETALLE_EXTRAS.indexOf(IDCheckbox);
    }
    
    /* INICIO Creacion de Elemento de Lista */
    function crearElementoDeLista(cantPorciones, gusto, precio, visible = true) { //LISTO
        const display = visible ? "" : " d-none";

        const li = document.createElement("li");
        li.setAttribute("class", "d-flex justify-content-between" + display);
        li.textContent = cantPorciones + " porciones de " + gusto;

        const divPrecio = crearDivPrecio(precio);

        li.appendChild(divPrecio);

        return li;
    }

    function crearDivPrecio(precio) { //LISTO
        const divPrecio = document.createElement("div");
        divPrecio.setAttribute("class", "precio");
        divPrecio.textContent = precio;

        return divPrecio;
    }
    /* FIN Creacion de Elemento de Lista */

    /* INICIO Costo total */
    function calcularCostoTotal() { //LISTO
        const $precios = document.querySelectorAll('li:not(.d-none) div.precio');
        const cantPrecios = $precios.length;
        let costoTotal = 0;

        for (let i = 0; i < cantPrecios; i++) {
            costoTotal += parseInt($precios[i].textContent);
        }

        return costoTotal;
    }

    function mostrarCostoTotal(costoTotal) { //LISTO
        const $precioTotal = document.querySelector('div.precio-total');

        if (isNaN(costoTotal)) {
            $precioTotal.textContent = "0";
        } else {
            $precioTotal.textContent = costoTotal;
        }
    }
    /* FIN Costo total */


    /* Checkbox cono de papas! */
    const $checkboxPapas = document.getElementById('papas')

    if ($checkboxPapas !== null) {
        $checkboxPapas.addEventListener('change', actualizarDetalleCono);
    }

    function actualizarDetalleCono() { // Listo
        const $seccionDetalleCono = document.querySelector('.detalle-cono');
        $seccionDetalleCono.classList.toggle('d-none');
        const precio = listaDePrecios['papas'];
        
        const divPrecio = crearDivPrecio(precio);

        const $divPrecio = obtenerDivPrecio('.detalle-cono .precio');
        $divPrecio.parentNode.classList.toggle('d-none');
        $divPrecio.replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }

   
    /* Botones de switch de Extras ! */
    const $extraCheck = document.querySelectorAll('.extras input[type=checkbox]');

    if ($extraCheck !== null) {
        $extraCheck.forEach(function(inputCheck){
            inputCheck.addEventListener('change', actualizarDetalleExtras);
        });
    }
    
    function actualizarDetalleExtras(event) { // Listo
        const $seccionDetalleExtras = document.querySelector('.detalle-extras');
        const IDCheckbox = event.target.id;
        const precio = listaDePrecios[IDCheckbox];

        const ubicacion = obtenerUbicacionDetalleExtras(IDCheckbox);
        const algunoChecked = verificarChecked('.extras input[type=checkbox]');
        
        if (algunoChecked) {
            $seccionDetalleExtras.classList.remove('d-none');
        } else {
            $seccionDetalleExtras.classList.add('d-none');
        }
        
        const divPrecio = crearDivPrecio(precio);

        const $divsPrecio = obtenerDivsPrecio('.detalle-extras .precio');
        $divsPrecio[ubicacion].parentNode.classList.toggle('d-none');
        $divsPrecio[ubicacion].replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }


    /* Radio de envio a domicilio ! */
    const $radioEnvio = document.getElementById('envio-a-domicilio');
    const $radioEnLocal = document.getElementById('retiro-en-local');

    if ($radioEnvio !== null && $radioEnLocal !== null) {
        $radioEnvio.addEventListener('change', actualizarDetalleEnvio);
        $radioEnLocal.addEventListener('change', actualizarDetalleEnvio);
    }

    function actualizarDetalleEnvio(event) { // Listo
        const IDRadio = event.target.id;
        const precio = listaDePrecios[IDRadio];
        
        const divPrecio = crearDivPrecio(precio);

        const $divPrecio = obtenerDivPrecio('.detalle-envio .precio');
        $divPrecio.replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);   
    }
}