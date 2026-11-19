// Inicializar datos desde data/base-datos.json si aún no están en localStorage
async function inicializarBaseDatos() {
  if (!localStorage.getItem('db_operadores') || !localStorage.getItem('listaReservas')) {
    try {
      const resp = await fetch('data/base-datos.json');
      const data = await resp.json();
      localStorage.setItem('db_operadores', JSON.stringify(data.operadores));
      localStorage.setItem('listaReservas', JSON.stringify(data.reservasIniciales));
    } catch (error) {
      // Respaldo automático si se abre sin Live Server
      const respaldoOps = [
        { id: 'OP-01', nombre: 'Sergio Díaz', correo: 'operador_sd@ancashcosta.pe', password: '123', credencial: 'MAT-CHM-0412' },
        { id: 'OP-02', nombre: 'Julio Rosario Montero', correo: 'julio.rosario@ancashcosta.pe', password: '123', credencial: 'MAT-CHM-0891' }
      ];
      localStorage.setItem('db_operadores', JSON.stringify(respaldoOps));
    }
  }
}
inicializarBaseDatos();

// Validar inicio de sesión de Operador contra el JSON cargado
async function iniciarSesionOperador(correo, password) {
  await inicializarBaseDatos();
  const operadores = JSON.parse(localStorage.getItem('db_operadores')) || [];
  const op = operadores.find(
    o => o.correo.toLowerCase() === correo.trim().toLowerCase() && o.password === password
  );

  if (!op) {
    return { ok: false, mensaje: 'Credenciales inválidas. Solo operadores autorizados por la empresa.' };
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

// Guardar reserva realizada por el turista
function guardarReservaTurista(reserva) {
  localStorage.setItem('ultimaReserva', JSON.stringify(reserva));
  const lista = obtenerTodasLasReservas();
  lista.unshift({
    id: 'ACP-' + Math.floor(Math.random() * 900 + 100),
    titular: reserva.titular,
    experiencia: reserva.tour || 'Chankillo, Solar',
    fecha: reserva.fecha,
    pasajeros: parseInt(reserva.pasajeros),
    estado: 'Reservado'
  });
  localStorage.setItem('listaReservas', JSON.stringify(lista));
}

function obtenerTodasLasReservas() {
  return JSON.parse(localStorage.getItem('listaReservas')) || [];
}

// Eliminar un registro específico de la tabla de pasajeros (por índice)
function eliminarReservaPorIndice(index) {
  const lista = obtenerTodasLasReservas();
  lista.splice(index, 1);
  localStorage.setItem('listaReservas', JSON.stringify(lista));
}

// Restaurar la base de datos al estado limpio del JSON (ideal antes de exponer)
async function restaurarDatosFabrica() {
  localStorage.removeItem('db_operadores');
  localStorage.removeItem('listaReservas');
  localStorage.removeItem('ultimaReserva');
  await inicializarBaseDatos();
  window.location.reload();
}