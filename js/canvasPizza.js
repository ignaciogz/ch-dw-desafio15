const canvasPizza = (function () {
    const CX = 90;
    const CY = 90;
    const CANTIDAD_PORCIONES = 8;
    const PIZZA_RADIO = 80;
    const MAX_RADIO = Math.PI * 2;
    const PATRON_SIZE = 38;

    const BORDER_COLOR = '#D6934D';
    const MUZZARELLA_COLOR = '#FCC61A';
    const PEPPERONI_COLOR = '#BF1304';
    const JAMON_COLOR = '#C87778';
    const TOMATE_COLOR = '#FF6347';
    const SALSA_COLOR = '#7A0B00';
    const VACIO_COLOR = '#212121';

    const CANVAS = document.getElementById('canvas');
    const contexto = CANVAS.getContext('2d');

    const UBICACION_EN_CANVAS = {
        i1 : [8],
        i2 : [8, 4],
        i4 : [8, 6, 4, 2]
    }
    
    function crearPatronDeGusto(color= MUZZARELLA_COLOR, dibujo = false) {
        // Creo una capa para el patron
        let canvas = document.createElement('canvas');
            canvas.width = PATRON_SIZE;
            canvas.height = PATRON_SIZE;
    
        // Le pongo color de fondo a la capa
        let contexto = canvas.getContext('2d');
            contexto.fillStyle = MUZZARELLA_COLOR;
            contexto.fillRect(0, 0, PATRON_SIZE, PATRON_SIZE);
        
        // Coordenadas de la capa donde se va a dibujar
        const CORDS = [
            [0, 0], [canvas.width, 0],
            [canvas.width / 2, canvas.height / 2],
            [0, canvas.height], [canvas.width, canvas.height]
        ];
        
        // Dibujo en cada coordenada
        if (dibujo) {
            for (let index = 0, cantidad = CORDS.length; index < cantidad; index++) {
                let x = CORDS[index][0];
                let y = CORDS[index][1];
                contexto.moveTo(x, y);
                
                dibujo(contexto, x, y, color);
            }
        }
        
        return contexto.createPattern(canvas, "repeat");
    }

    /* ---------- INICIO DIBUJOS ---------- */
    function dibujoCalabresa(contexto, x, y, color) {
        contexto.fillStyle = color;

        contexto.arc(x, y, 7, 0, MAX_RADIO, 0);
        contexto.fill();
    }

    function dibujoJamon(contexto, x, y, color) {
        contexto.fillStyle = color;

        contexto.fillRect(x, y, 18, 10);
        contexto.fill();
    }

    function dibujoNapolitana(contexto, x, y, color) {
        contexto.strokeStyle = color;
        contexto.lineWidth = 4;

        contexto.arc(x, y, 7, 0, MAX_RADIO, 0);
        contexto.stroke();
    }
    /* ---------- FIN DIBUJOS ---------- */

    const muzzarellaPatron = crearPatronDeGusto();
    const calabresaPatron = crearPatronDeGusto(PEPPERONI_COLOR, dibujoCalabresa);
    const jamonPatron = crearPatronDeGusto(JAMON_COLOR, dibujoJamon);
    const napolitanaPatron = crearPatronDeGusto(TOMATE_COLOR, dibujoNapolitana);

    function dibujarPorcion(x, y, r, inicio, fin, color) {
        contexto.beginPath();
        contexto.fillStyle = color;
        contexto.moveTo(x, y);
        contexto.arc(x, y, r, inicio, fin, 0);
        contexto.fill();
    }

    function dibujarPorciones(cantidadPorciones, gusto, indexInicial, dibujar = true) {
        let i = 0;
        let radianInicial, radianFinal, radianIntermedio, cx, cy;
        const porcionSize = MAX_RADIO / CANTIDAD_PORCIONES;
    
        while (i < cantidadPorciones) {
            radianInicial = MAX_RADIO * (indexInicial / CANTIDAD_PORCIONES);
            radianFinal = radianInicial + porcionSize;
            radianIntermedio = radianInicial + (porcionSize / 2);
            
            cx = 3 * Math.cos(radianIntermedio) + CX;
            cy = 3 * Math.sin(radianIntermedio) + CY;
            
            if(dibujar) {
                dibujarPorcion(cx, cy, PIZZA_RADIO, radianInicial, radianFinal, BORDER_COLOR);
                dibujarPorcion(cx, cy, PIZZA_RADIO * 0.93, radianInicial, radianFinal, SALSA_COLOR);
                dibujarPorcion(cx, cy, PIZZA_RADIO * 0.9, radianInicial, radianFinal, gusto);
            } else {
                dibujarPorcion(cx, cy, PIZZA_RADIO, radianInicial, radianFinal, BORDER_COLOR);
                dibujarPorcion(cx, cy, PIZZA_RADIO, radianInicial, radianFinal, VACIO_COLOR);
            }
            
            indexInicial--;
            i++;
        }
    }

    function limpiarCanvas(){
        contexto.clearRect(0, 0, CANVAS.width, CANVAS.height);
        dibujarPorciones(8, muzzarellaPatron, 8, false);
    }

    function obtenerUbicacionEnCanvas(IDSelect, cantidadGustos) {
        switch (cantidadGustos) {
            case 1:
                return UBICACION_EN_CANVAS.i1[IDSelect];
            case 2:
                return UBICACION_EN_CANVAS.i2[IDSelect];
            case 4:
                return UBICACION_EN_CANVAS.i4[IDSelect];
        }
    }
    
    return {
        "muzzarellaPatron" : muzzarellaPatron,
        "calabresaPatron" : calabresaPatron,
        "jamonPatron" : jamonPatron,
        "napolitanaPatron" : napolitanaPatron,
        "dibujarPorciones": dibujarPorciones,
        "limpiarCanvas" : limpiarCanvas,
        "obtenerUbicacionEnCanvas" : obtenerUbicacionEnCanvas
    }
})();


canvasPizza.limpiarCanvas();