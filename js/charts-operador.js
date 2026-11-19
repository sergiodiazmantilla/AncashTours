let chartVentas, chartPasajeros;

function renderizarGraficosOperador() {
  const isHighContrast = document.body.classList.contains('high-contrast');
  const textColor = isHighContrast ? '#ffff00' : '#0f172a';
  const gridColor = isHighContrast ? 'rgba(255, 255, 0, 0.25)' : 'rgba(0, 0, 0, 0.08)';
  const barPrimary = isHighContrast ? '#ffff00' : '#0a587a';
  const barSecondary = isHighContrast ? '#00e5ff' : '#93c5fd';

  if (chartVentas) chartVentas.destroy();
  if (chartPasajeros) chartPasajeros.destroy();

  // Gráfico 1: Ventas semanales (Fiel a Figma y RF-08 / HU #17)
  chartVentas = new Chart(document.getElementById('chartVentasSemanales'), {
    type: 'bar',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [{
        label: 'Reservas por día',
        data: [1, 2, 3, 2, 4, 2, 1],
        backgroundColor: [barSecondary, barSecondary, barSecondary, barSecondary, barPrimary, barSecondary, barSecondary],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } }
      }
    }
  });

  // Gráfico 2: Distribución de pasajeros por experiencia (RF-08)
  chartPasajeros = new Chart(document.getElementById('chartDistribucionPasajeros'), {
    type: 'doughnut',
    data: {
      labels: ['Chankillo (Solar)', 'Isla Blanca (Marino)', 'Sechín (Cultural)'],
      datasets: [{
        data: [8, 5, 2],
        backgroundColor: isHighContrast ? ['#ffff00', '#00e5ff', '#ffffff'] : ['#0a587a', '#38bdf8', '#94a3b8'],
        borderColor: isHighContrast ? '#000000' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
    }
  });
}

document.addEventListener('DOMContentLoaded', renderizarGraficosOperador);
window.addEventListener('contrastChanged', renderizarGraficosOperador);