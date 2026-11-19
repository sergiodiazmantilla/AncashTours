document.addEventListener('DOMContentLoaded', () => {
  const contrastToggle = document.getElementById('contrastToggle');
  const btnDecrease = document.getElementById('fontDecrease');
  const btnIncrease = document.getElementById('fontIncrease');
  let currentScale = 100;

  // Restaurar preferencia de contraste al cambiar de página
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
    if (contrastToggle) contrastToggle.checked = true;
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      const activo = e.target.checked;
      document.body.classList.toggle('high-contrast', activo);
      localStorage.setItem('highContrast', activo);
      // Notificar a Chart.js para actualizar colores de textos/ejes
      window.dispatchEvent(new Event('contrastChanged'));
    });
  }

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentScale > 85) {
        currentScale -= 10;
        document.documentElement.style.fontSize = `${currentScale}%`;
      }
    });
  }

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentScale < 130) {
        currentScale += 10;
        document.documentElement.style.fontSize = `${currentScale}%`;
      }
    });
  }

  // Habilitar pestaña "Mi ticket" SOLO si el turista ya realizó una reserva
  const linkMiTicket = document.getElementById('navMiTicket');
  if (linkMiTicket) {
    const tieneReserva = localStorage.getItem('ultimaReserva');
    if (!tieneReserva) {
      linkMiTicket.classList.add('disabled-ticket');
      linkMiTicket.setAttribute('aria-disabled', 'true');
      linkMiTicket.title = 'Selecciona y reserva un tour primero para habilitar tu ticket';
    } else {
      linkMiTicket.classList.remove('disabled-ticket');
      linkMiTicket.removeAttribute('aria-disabled');
    }
  }
});