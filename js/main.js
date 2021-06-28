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

    if ($desplegables !== null) {
        /* Cada Select */
        $desplegables.forEach(asociarEventosADesplegables);

        function asociarEventosADesplegables(desplegable) {
            desplegable.addEventListener('change', armala.calcularCostos);
            desplegable.addEventListener('change', armala.mostrarPorciones);
        }
    }

    /* INICIO Control de tarjeta visible en el carousel */
    const $carouselProductos = document.getElementById('armala-carousel-productos');

    if ($carouselProductos !== null) {
        $carouselProductos.addEventListener('slid.bs.carousel', armala.actualizarPaginaArmala);
    }

    /* Checkbox cono de papas! */
    const $checkboxPapas = document.getElementById('papas')

    if ($checkboxPapas !== null) {
        $checkboxPapas.addEventListener('change', armala.actualizarDetalleCono);
    }

    /* Botones de switch de Extras ! */
    const $extraCheck = document.querySelectorAll('.extras input[type=checkbox]');

    if ($extraCheck !== null) {
        $extraCheck.forEach(function(inputCheck){
            inputCheck.addEventListener('change', armala.actualizarDetalleExtras);
        });
    }

    /* Radio de envio a domicilio ! */
    const $radioEnvio = document.getElementById('envio-a-domicilio');
    const $radioEnLocal = document.getElementById('retiro-en-local');

    if ($radioEnvio !== null && $radioEnLocal !== null) {
        $radioEnvio.addEventListener('change', armala.actualizarDetalleEnvio);
        $radioEnLocal.addEventListener('change', armala.actualizarDetalleEnvio);
    }
}