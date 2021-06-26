window.addEventListener("load", init);

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

function cargarFilaDeImagenes() {
    let imagenesSinMostrar = document.querySelectorAll(".galeria .d-none");
    imagenesSinMostrar[0].classList.remove("d-none");
    AOS.init();

    if(imagenesSinMostrar.length == 1) {
        this.classList.add("d-none");
    }
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

    /*  PRUEBA DE COSAS EN JS:
    const videoPublicitario = document.querySelector('video');

    function escucharVideo() {
        let segundosReproducidos = Math.floor(this.currentTime);
        console.log(segundosReproducidos);
    }

    videoPublicitario.addEventListener('timeupdate', escucharVideo); 
    */

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

    const $desplegables = document.querySelectorAll('.gustos select');
    let cantDesplegables;

    if ($desplegables !== null) {
        cantDesplegables = $desplegables.length;

        /* Cada Select */
        $desplegables.forEach(asociarEventos);

        function asociarEventos(desplegable) {
            desplegable.addEventListener('change', calcularCostos);
            desplegable.addEventListener('change', mostrarPorciones);
        }
    }
    
    function mostrarPorciones(event) {
        const nombreGusto = event.target.value;
        const nombreGustoPatron = nombreGusto + "Patron";
        const mostrar = nombreGusto != "Default" ? true : false;

        const IDSelect = parseInt(event.target.getAttribute('data-ipizza-gusto-num'));

        const $tarjetaSeleccionada = document.querySelector('.active .tarjeta-de-producto');
        const cantidadGustos = parseInt($tarjetaSeleccionada.getAttribute('data-ipizza-cant-gustos'));
        const cantidadPorciones = calcularCantidadPorciones(cantidadGustos);

        const ubicacionEnCanvas = canvasPizza.obtenerUbicacionEnCanvas(IDSelect, cantidadGustos);

        canvasPizza.dibujarPorciones(cantidadPorciones, canvasPizza[nombreGustoPatron], ubicacionEnCanvas, mostrar);
    }
    
    function calcularCostos(event) {
        let nombreGusto = '***';
        let precioFinalGusto = '***';
        const IDSelect = parseInt(event.target.getAttribute('data-ipizza-gusto-num')) - 1;

        const $tarjetaSeleccionada = document.querySelector('.active .tarjeta-de-producto');
        const cantidadGustos = parseInt($tarjetaSeleccionada.getAttribute('data-ipizza-cant-gustos'));
        const cantidadPorciones = calcularCantidadPorciones(cantidadGustos);

        if (event.target.value != "Default") {
            nombreGusto = event.target.value;
            const precioGusto = listaDePrecios["precioPorcion"][nombreGusto];
            
            precioFinalGusto = cantidadPorciones * precioGusto;
        }

        let $elementosDetallePorciones = document.querySelectorAll('.detalle-porciones li');

        // Muestro los li necesarios
        let liNuevo = crearElementoDeLista(cantidadPorciones, nombreGusto, precioFinalGusto);
        $elementosDetallePorciones[IDSelect].replaceWith(liNuevo);

        precioTotal();
    }
    
    /* Controlo elemento visible en el carousel */
    const $carouselProductos = document.getElementById('armala-carousel-productos');

    if ($carouselProductos !== null) {
        $carouselProductos.addEventListener('slid.bs.carousel', function () {
            const $tarjetaSeleccionada = document.querySelector('.active .tarjeta-de-producto');
            const cantidadGustos = parseInt($tarjetaSeleccionada.getAttribute('data-ipizza-cant-gustos'));
            const cantidadPorciones = calcularCantidadPorciones(cantidadGustos);
            
            let $listaDetallePorciones = document.querySelector('.detalle-porciones');
            let $elementosDetallePorciones = document.querySelectorAll('.detalle-porciones li');
    
            // Oculto todos los desplegables
            for(let i=0; i < cantDesplegables; i++) {
                $desplegables[i].classList.add('d-none');
                $desplegables[i].selectedIndex = 0;
                
                let liGenerico = crearElementoDeLista(cantidadPorciones, '***', '***', false);
                $elementosDetallePorciones[i].replaceWith(liGenerico);
            }
    
            $elementosDetallePorciones = document.querySelectorAll('.detalle-porciones li');
    
            // Muestro los desplegables necesarios
            for(let i=0; i < cantidadGustos; i++) {
                $desplegables[i].classList.remove('d-none');
    
                $elementosDetallePorciones[i].classList.toggle('d-none');
            }
            
            canvasPizza.limpiarCanvas();
            precioTotal();
        });
    }

    function calcularCantidadPorciones(cantidadGustos) {
        switch(cantidadGustos) {
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

    /* Crear Elemento de Lista */
    function crearElementoDeLista(cantPorciones, gusto, precio, visible = true) {
        const display = visible ? "" : " d-none";

        const li = document.createElement("li");
        li.setAttribute("class", "d-flex justify-content-between" + display);
        li.textContent = cantPorciones + " porciones de " + gusto;

        const divPrecio = crearDivPrecio(precio);

        li.appendChild(divPrecio);

        return li;
    }

    function crearDivPrecio(precio) {
        const divPrecio = document.createElement("div");
        divPrecio.setAttribute("class", "precio");
        divPrecio.textContent = precio;

        return divPrecio;
    }

    /* Actualizar Precio Total */
    function precioTotal() {
        const $precios = document.querySelectorAll('li:not(.d-none) div.precio');
        const cantPrecios = $precios.length;
        const $precioTotal = document.querySelector('div.precio-total');
        let precioTotal = 0;

        for (let i = 0; i < cantPrecios; i++) {
            precioTotal = precioTotal + parseInt($precios[i].textContent);
        }

        $precioTotal.textContent = precioTotal;
        if (isNaN(precioTotal)) {
            $precioTotal.textContent = "0";
        } else {
            $precioTotal.textContent = precioTotal;
        }
    }


    /* Checkbox cono de papas! */
    const $checkboxPapas = document.getElementById('papas')

    if ($checkboxPapas !== null) {
        $checkboxPapas.addEventListener('change', (event) => {
            const precio = listaDePrecios['papas'];
            const $seccionDetalleCono = document.querySelector('.detalle-cono');
            $seccionDetalleCono.classList.toggle('d-none');
            
            const divPrecio = crearDivPrecio(precio);
    
            const $divPrecio = document.querySelector('.detalle-cono .precio');
            $divPrecio.parentNode.classList.toggle('d-none');
            $divPrecio.replaceWith(divPrecio);
    
            precioTotal();
        })    
    }

   
    /* Botones de switch de Extras ! */
    const $extraCheck = document.querySelectorAll('.extras input[type=checkbox]');

    if ($extraCheck !== null) {
        $extraCheck.forEach(function(inputCheck){
            inputCheck.addEventListener('change', extrasCB);
        });
    }
    
    function extrasCB(el) {
        let IDli;
        const $seccionDetalleExtras = document.querySelector('.detalle-extras');
        const CheckID = el.target.id;
        
        switch (CheckID) {
            case 'oregano':
                IDli = 0;
                break;
            case 'aceitunas':
                IDli = 1;
                break;
            case 'doble-queso':
                IDli = 2;
                break;
            case'cheddar':
                IDli = 3;
                break;
        }
        
        const precio = listaDePrecios[CheckID];
        
        let algunoChecked = false;
        $extraCheck.forEach(function(inputCheck){
            if (inputCheck.checked) {
                algunoChecked = true;
            }
        });
        
        if (algunoChecked) {
            $seccionDetalleExtras.classList.remove('d-none');
        } else {
            $seccionDetalleExtras.classList.add('d-none');
        }
        
        const divPrecio = crearDivPrecio(precio);
        const $divsPrecio = document.querySelectorAll('.detalle-extras .precio');

        $divsPrecio[IDli].parentNode.classList.toggle('d-none');
        $divsPrecio[IDli].replaceWith(divPrecio);

        precioTotal();
    }


    /* Radio de envio a domicilio ! */
    const $radioEnvio = document.getElementById('envio-a-domicilio');
    const $radioEnLocal = document.getElementById('retiro-en-local');

    if ($radioEnvio !== null && $radioEnLocal !== null) {
        $radioEnvio.addEventListener('change', radioCB);
        $radioEnLocal.addEventListener('change', radioCB);
    }

    function radioCB(el) {
        const precio = listaDePrecios[el.target.id];
        
        const divPrecio = crearDivPrecio(precio);

        const $divPrecio = document.querySelector('.detalle-envio .precio');
        $divPrecio.replaceWith(divPrecio);

        precioTotal();   
    }
    
}
