window.addEventListener('load', app);

let michiTabla = ['', '', '', '', '', '', '', '', ''];
let turno = 0; // Keeps track if X or O player's turn
let jugador = false;
let contadorPuntaje = false
let sumPuntajeX = 0;
let sumPuntajeO = 0;
let winJugadojson = {}
var now = new Date();
var timeup = now.setSeconds(now.getSeconds() + 4500);
// CREAR CONSTANTE PARA LA INFO DE LOS NOMBRES
const jugadoresNombre = (name) => {
    name = name;
    return { name };
};

let jugadorX = jugadoresNombre("");
let jugadorY = jugadoresNombre("");

// FUNCION CONTENEDOR DE LA FUNCION PRINCIPAL
function app() {
    //mensaje principal
    swal("Tiempo Limitado", "El juego se terminara si pasa de los 15 minutos", "info")
    const agregarJugadores = document.getElementById('jugador-form');
    agregarJugadores.addEventListener('submit', jugadoresMichi);
    //cvaribla q almeta la funcion de tiempo
    let counter = setInterval(timer, 1000);
    let replayBoton = document.querySelector('.repetir-btn');
    let replayInicio = document.querySelector('.boton-inicio');

    replayBoton.addEventListener('click', resetearTabla);
    replayInicio.addEventListener('click', volverInicio); //
}
// FUNCION QUE VALIDA LOS NOMBRE DE LOS JUGADORES
function jugadoresMichi(event) {
    event.preventDefault();

    if (this.player1.value === '' || this.player2.value === '' || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ])+$/i.test(this.player2.value) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ])+$/i.test(this.player1.value)) {
        swal("Campo Nombre", "No se puede ingresar caracteres , numeros o vacios", "warning");
        return;
    }

    const contenedorJugador = document.querySelector('.enter-Jugador');
    const michiTabla = document.querySelector('.tabla__michi');
    contenedorJugador.classList.add('ocultar-contenido');
    michiTabla.classList.remove('ocultar-contenido');

    jugadorX.name = this.player1.value;
    jugadorY.name = this.player2.value;
    construirTabla();
}

// FUNCION QUE RECOGE LA ELECCION DEL JUGADOR
function eleccionJugador() {
    return turno % 2 === 0 ? 'X' : 'O';
}

// RENDERIZADO DE LA VENTANA DE WINDOWS
window.addEventListener("resize", celdasTablaMichi);

// FUNCION QUE SELECCIONA LOS ELEMENTOS DE MI HTML Y RECORRE LA CELDAS 
function celdasTablaMichi() {
    let celdasTotales = document.querySelectorAll('.tabla__celda');
    let alturaCeldas = celdasTotales[0].offsetWidth;

    celdasTotales.forEach(cell => {
        cell.style.height = `${alturaCeldas}px`;
    });
}

// FUNCION QUE CONSTRUYE LA TABLA DEL JUEGO MICHI
function construirTabla() {
    let resetContainer = document.querySelector('.reset');
    resetContainer.classList.remove('ocultar--tabla');

    celdasTablaMichi();
    addCellClickListener();
    turnoJugador();
}
//FUNCION QUE POSICIONA LOS MOVIMIENTOS DE LOS JUGADORES

function jugadorMovimiento(event) {

    let celdasMovimiento = parseInt(event.currentTarget.firstElementChild.dataset.id);
    let celdaElegida = document.querySelector(`[data-id='${celdasMovimiento}']`);

    if (celdaElegida.innerHTML !== '') {
        return;
    } else {
        if (eleccionJugador() === 'X') {
            celdaElegida.textContent = eleccionJugador();
            michiTabla[celdasMovimiento] = 'X';
        } else {
            celdaElegida.textContent = eleccionJugador();
            michiTabla[celdasMovimiento] = 'O';
        }
    }

    // jugada ganadora
    ganadorJuego();
    // Actualice el conteo de turnos para que el próximo jugador pueda elegir
    turno++;

    // CAMBIAR INFORMACIÓN DE ENCABEZADO DEL TABLERO
    turnoJugador();
}
//FUNCION QUE RETORNA UN MENSAJE  CUANDO LOS JUGADORES LOGRAN EMPATAR
function jugadaEmpate() {


    if (turno > 7) {
        swal(" Empate !", "Vuelva a jugar o reiniciar la partida", "info");

    }
}
//FUNCION QUE TRAE CONSIGO LA JUGADA GANADORA
function ganadorJuego() {
    const matrizGanadora = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ];

    let verificarEmpate = false;

    matrizGanadora.forEach(iterador => {
        let cell1 = iterador[0];
        let cell2 = iterador[1];
        let cell3 = iterador[2];
        if (
            michiTabla[cell1] === eleccionJugador() &&
            michiTabla[cell2] === eleccionJugador() &&
            michiTabla[cell3] === eleccionJugador()
        ) {


            const celdasMichi = document.querySelectorAll('.tabla__celda');
            celdasMichi.forEach(cell => {
                let cellId = cell.firstElementChild.dataset.id;

                if (cellId == cell1 || cellId == cell2 || cellId == cell3) {
                    cell.classList.add('tabla__jugador-turno');
                }
            });
            if (eleccionJugador() === 'X') {
                swal(`El ganador es ${jugadorX.name} `, "¡ Felicitaciones !", "success");
                contadorPuntaje = true;
                verificarEmpate = true;
                sumPuntajeX++;
                contadorPuntos(contadorPuntaje, sumPuntajeX)
                removerClikListener();
                return true;
            } else {
                swal(`El ganador es ${jugadorY.name} `, "¡ Felicitaciones !", "success");
                contadorPuntaje = false;
                verificarEmpate = true;
                sumPuntajeO++;
                contadorPuntos(contadorPuntaje, sumPuntajeO);
                removerClikListener();
                return true;
            }
        }
    });

    if (!verificarEmpate) {
        jugadaEmpate();
    }

    return false;
}

function contadorPuntos(boolean, sumPuntaje) {
    let puntooX = document.querySelector('#score_1');
    let puntosO = document.querySelector('#score_2');

    if (boolean) {
        puntooX.innerHTML = `
        <span class="name--style">${sumPuntaje}</span>`;
    } else {
        puntosO.innerHTML = `
        <span class="name--style">${sumPuntaje}</span>`;
    }
}

//SE EVALUA LOS TURNOS A DISPUTAR EN LA PARTIDA
function turnoJugador() {
    if (!jugador) {
        let imprimirTurnoX = document.querySelector('.section__div-jugador');
        let imprimirTurnoy = document.querySelector('.section__div-jugadorY');
        let imprimirTurno = document.querySelector('.tabla_celdas--michi');
        let jugadaBoolean = 'true'
        imprimirTurnoX.innerHTML = `
        <span class="name--style">Nombre : ${jugadorX.name}</span>,
      `;
        imprimirTurnoy.innerHTML = `
      <span class="name--style">Nombre: ${jugadorY.name}</span>,
    `;

        if (eleccionJugador() === 'X') {

            imprimirTurno.innerHTML = `
            <span class="name--style">${jugadorX.name}</span>, Es tu turno!      `;
            turnoImg(jugadaBoolean)
        } else {
            imprimirTurno.innerHTML = `
        <span class="name--style">${jugadorY.name}</span>, Es tu turno!      `
            jugadaBoolean = 'false'
            turnoImg(jugadaBoolean)
        }

    }

}

// FUNCION QUE RESETEA LA TABLA
function resetearTabla() {

    michiTabla = ['', '', '', '', '', '', '', '', ''];

    let cellToAddToken = document.querySelectorAll('.tablas_celdas');
    cellToAddToken.forEach(square => {
        square.textContent = '';
        square.parentElement.classList.remove('tabla__jugador-turno');
    });

    turno = 0;
    jugador = false;

    let currentPlayerText = document.querySelector('.tabla_celdas--michi');
    currentPlayerText.innerHTML = `
    <span class="name--style">${jugadorX.name}</span>!
    <div class="u-r-winner"></div>
  `

    addCellClickListener();
}

function volverInicio() {
    return location.reload(true)
}
//LISTENER Y REMOVE PARA EL MOVIMIENTO DE LOS JUGADORES POR LAS CELDAS

function addCellClickListener() {
    const cells = document.querySelectorAll('.tabla__celda');
    cells.forEach(cell => {
        cell.addEventListener('click', jugadorMovimiento);
    });
}

function removerClikListener() {
    let allCells = document.querySelectorAll('.tabla__celda');
    allCells.forEach(cell => {
        cell.removeEventListener('click', jugadorMovimiento);
    });
}

//FUNCION QUE CAMBIA DE IMAGEN SEGUN EL TURNO DE CADA JUGADOR
function turnoImg(player1) {

    if (player1 === 'true') {
        const img_player1 = document.getElementById("img_player1");
        img_player1.src = "./recursos/icon.png";
        img_player1.style.width = '90%';

        const img_player2 = document.getElementById("img_player2");
        img_player2.src = "./recursos/icon1.1.png";
        img_player2.style.width = '80%';

    } else {
        const img_player1 = document.getElementById("img_player1");
        img_player1.src = "./recursos/icon2.png";
        img_player1.style.width = '80%';

        const img_player2 = document.getElementById("img_player2");
        img_player2.src = "./recursos/icon1.2.png";
        img_player2.style.width = '90%';
    }
}
//FUNCION QUE CONSIGUE LA HORA DE SESION
function timer() {
    now = new Date();
    count = Math.round((timeup - now) / 1000);
    if (now > timeup) {
        location.reload(true)
        clearInterval(counter);
        return;
    }
    let seconds = Math.floor((count % 60));
    let minutes = Math.floor((count / 60) % 60);
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
}