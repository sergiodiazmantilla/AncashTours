document.addEventListener('DOMContentLoaded', () => {
  // 1. Gráfico obligatorio: Conversión de clientes
  new Chart(document.getElementById('chartConversionOperador'), {
    type: 'bar',
    data: {
      labels: ['Visitas al Tour', 'Clic en Reservar', 'Datos Completados', 'Ticket QR Pagado'],
      datasets: [{
        label: 'Turistas (Últimos 30 días)',
        data: [320, 145, 90, 78],
        backgroundColor: ['#94a3b8', '#38bdf8', '#0284c7', '#0a587a']
      }]
    },
    options: { responsive: true }
  });

  // 2. Ventas semanales (Fiel a tu prototipo de Figma)
  new Chart(document.getElementById('chartVentasSemanales'), {
    type: 'bar',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [{
        label: 'Reservas Confirmadas',
        data: [3, 4, 5, 4, 8, 11, 7],
        backgroundColor: '#0a587a'
      }]
    },
    options: { responsive: true }
  });

  // 3. Ocupación de aforo por ruta
  new Chart(document.getElementById('chartAforoRutas'), {
    type: 'line',
    data: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      datasets: [
        { label: 'Isla Blanca (%)', data: [65, 78, 85, 93], borderColor: '#0a587a', tension: 0.3 },
        { label: 'Caleta Colorada (%)', data: [40, 55, 60, 75], borderColor: '#f59e0b', tension: 0.3 }
      ]
    },
    options: { responsive: true }
  });

  // 4. Estado de Tickets QR
  new Chart(document.getElementById('chartEstadoTickets'), {
    type: 'doughnut',
    data: {
      labels: ['Canjeados en Muelle', 'Pendientes de Viaje', 'Cancelados (Fuerza Mayor)'],
      datasets: [{
        data: [68, 25, 7],
        backgroundColor: ['#10b981', '#0a587a', '#ef4444']
      }]
    },
    options: { responsive: true }
  });
});