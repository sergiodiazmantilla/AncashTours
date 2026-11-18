document.addEventListener('DOMContentLoaded', () => {
  // 1. Gráfico Obligatorio: Embudo de Conversión Global
  new Chart(document.getElementById('chartConversionGlobal'), {
    type: 'bar',
    data: {
      labels: ['Visitas Landing', 'Búsqueda Destino', 'Inicio Checkout', 'Pago Confirmado (QR)'],
      datasets: [{
        label: 'Usuarios Únicos (Mensual)',
        data: [2500, 1420, 680, 460],
        backgroundColor: ['#cbd5e1', '#38bdf8', '#0284c7', '#0a587a'],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true
    }
  });

  // 2. Ingresos comparativos Casma vs Chimbote
  new Chart(document.getElementById('chartIngresosDestino'), {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Chimbote (Isla Blanca / Caleta)',
          data: [4200, 5800, 5100, 6900, 7400, 9850],
          borderColor: '#0a587a',
          backgroundColor: 'rgba(10, 88, 122, 0.1)',
          fill: true,
          tension: 0.35
        },
        {
          label: 'Casma (Chankillo / Sechín)',
          data: [3800, 4600, 4900, 6100, 6800, 8600],
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: { responsive: true }
  });

  // 3. Canales de Adquisición de Marketing
  new Chart(document.getElementById('chartCanalesMarketing'), {
    type: 'doughnut',
    data: {
      labels: ['Redes Sociales (TikTok / Instagram)', 'QR en Oficinas DIRCETUR', 'Búsqueda Orgánica Google', 'Recomendación Directa'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#0a587a', '#0ea5e9', '#10b981', '#f59e0b']
      }]
    },
    options: { responsive: true }
  });

  // 4. Uso de Herramientas de Accesibilidad (WCAG 2.0)
  new Chart(document.getElementById('chartUsoAccesibilidad'), {
    type: 'bar',
    data: {
      labels: ['Alto Contraste', 'Aumento Texto (A+)', 'Navegación Teclado (Tab)', 'Lector Pantalla (ARIA)'],
      datasets: [{
        label: 'Sesiones Activas con Accesibilidad',
        data: [310, 425, 140, 85],
        backgroundColor: '#0f766e',
        borderRadius: 6
      }]
    },
    options: { responsive: true }
  });
});