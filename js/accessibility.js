document.addEventListener('DOMContentLoaded', () => {
  const contrastToggle = document.getElementById('contrastToggle');
  const btnDecrease = document.getElementById('fontDecrease');
  const btnIncrease = document.getElementById('fontIncrease');
  let currentScale = 100; // porcentaje

  // Alternar Alto Contraste
  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.target.checked);
    });
  }

  // Reducir fuente
  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentScale > 85) {
        currentScale -= 10;
        document.documentElement.style.fontSize = `${currentScale}%`;
      }
    });
  }

  // Aumentar fuente
  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentScale < 130) {
        currentScale += 10;
        document.documentElement.style.fontSize = `${currentScale}%`;
      }
    });
  }
});