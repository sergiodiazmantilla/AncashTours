async function inicializarBaseDatos() {
  if (!localStorage.getItem('db_operadores') || !localStorage.getItem('db_tours') || !localStorage.getItem('listaReservas')) {
    try {
      const resp = await fetch('data/base-datos.json');
      const data = await resp.json();
      localStorage.setItem('db_operadores', JSON.stringify(data.operadores));
      localStorage.setItem('db_tours', JSON.stringify(data.tours));
      localStorage.setItem('listaReservas', JSON.stringify(data.reservasIniciales));
    } catch (error) {
      console.error('Abre el proyecto con Live Server para cargar data/base-datos.json', error);
    }
  }
}
inicializarBaseDatos();

// --- GESTIÓN DE TOURS ---
function obtenerTodosLosTours() {
  return JSON.parse(localStorage.getItem('db_tours')) || [];
}

function obtenerTourPorId(id) {
  const tours = obtenerTodosLosTours();
  return tours.find(t => t.id === id) || tours[0];
}

function obtenerToursDelOperadorActivo() {
  const op = obtenerOperadorActivo();
  if (!op) return [];
  return obtenerTodosLosTours().filter(t => t.operadorId === op.id);
}

// --- AUTENTICACIÓN DE OPERADORES ---
async function iniciarSesionOperador(correo, password) {
  await inicializarBaseDatos();
  const operadores = JSON.parse(localStorage.getItem('db_operadores')) || [];
  const op = operadores.find(
    o => o.correo.toLowerCase() === correo.trim().toLowerCase() && o.password === password
  );
  if (!op) {
    return { ok: false, mensaje: 'Credenciales inválidas. Solo operadores autorizados.' };
  }
  sessionStorage.setItem('operadorActivo', JSON.stringify(op));
  return { ok: true, operador: op };
}

function obtenerOperadorActivo() {
  const data = sessionStorage.getItem('operadorActivo');
  return data ? JSON.parse(data) : null;
}

function cerrarSesionOperador() {
  sessionStorage.removeItem('operadorActivo');
  window.location.href = 'login-operador.html';
}

function protegerRutaOperador() {
  if (!obtenerOperadorActivo()) {
    window.location.href = 'login-operador.html';
  }
}

// --- RESERVAS VINCULADAS AL TOUR Y AL OPERADOR ---
function guardarReservaTurista(reserva) {
  const tour = obtenerTourPorId(reserva.tourId);
  const pasajerosNum = parseInt(reserva.pasajeros) || 1;
  const montoFinal = reserva.montoTotal ? parseFloat(reserva.montoTotal) : (tour.precio * pasajerosNum);

  const nuevaReserva = {
    id: 'ACP-' + Math.floor(Math.random() * 900 + 100),
    tourId: tour.id,
    operadorId: tour.operadorId,
    titular: reserva.titular,
    experiencia: tour.titulo,
    fecha: reserva.fecha,
    pasajeros: pasajerosNum,
    monto: montoFinal,
    metodoPago: reserva.metodoPago || 'Yape / Plin',
    puntoEncuentro: tour.puntoEncuentro,
    estado: 'Reservado'
  };

  localStorage.setItem('ultimaReserva', JSON.stringify(nuevaReserva));
  const lista = obtenerTodasLasReservas();
  lista.unshift(nuevaReserva);
  localStorage.setItem('listaReservas', JSON.stringify(lista));
}

function obtenerTodasLasReservas() {
  return JSON.parse(localStorage.getItem('listaReservas')) || [];
}

// Devuelve SOLO las reservas que pertenecen a los tours del operador logueado
function obtenerReservasDelOperadorActivo() {
  const op = obtenerOperadorActivo();
  if (!op) return [];
  return obtenerTodasLasReservas().filter(r => r.operadorId === op.id);
}

function eliminarReservaPorId(idReserva) {
  const lista = obtenerTodasLasReservas().filter(r => r.id !== idReserva);
  localStorage.setItem('listaReservas', JSON.stringify(lista));
}

// Descargar archivo base-datos.json actualizado (para reemplazarlo en VS Code si deseas)
function descargarBaseDatosJSON() {
  const estadoActual = {
    operadores: JSON.parse(localStorage.getItem('db_operadores')) || [],
    tours: obtenerTodosLosTours(),
    reservasIniciales: obtenerTodasLasReservas()
  };
  const blob = new Blob([JSON.stringify(estadoActual, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'base-datos.json';
  a.click();
}

async function restaurarDatosFabrica() {
  localStorage.removeItem('db_operadores');
  localStorage.removeItem('db_tours');
  localStorage.removeItem('listaReservas');
  localStorage.removeItem('ultimaReserva');
  await inicializarBaseDatos();
  window.location.reload();
}