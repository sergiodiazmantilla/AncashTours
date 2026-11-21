google.charts.load('current', { packages: ['corechart'] });

let metricasActualesOperador = null;

// Mapa de nombres cortos y claros para los ejes de los gráficos (sin puntos suspensivos)
const NOMBRES_CORTOS_TOURS = {
  'TOUR-01': 'Obs. Solar Chankillo',
  'TOUR-02': 'Complejo Sechín',
  'TOUR-03': 'Isla Blanca',
  'TOUR-04': 'Fortaleza Chanquillo',
  'TOUR-05': 'Templo Las Aldas',
  'TOUR-06': 'Caleta Colorada',
  'TOUR-07': 'Bahía El Ferrol',
  'TOUR-08': 'Bahía de Tortugas',
  'TOUR-09': 'Sechín Bajo'
};

async function iniciarDashboardsOperador() {
  await inicializarBaseDatos();

  const op = obtenerOperadorActivo();
  if (!op) return;

  const headerNombre = document.getElementById('nombreOperadorHeader');
  if (headerNombre) headerNombre.textContent = op.nombre;

  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const badgeFecha = document.getElementById('badgeFechaActual');
  if (badgeFecha) badgeFecha.textContent = fechaHoy;

  metricasActualesOperador = obtenerMetricasAnalyticsOperador();

  // Pintar los 4 KPIs consolidados superiores
  document.getElementById('kpiIngresos').textContent = `S/ ${metricasActualesOperador.ingresosTotales.toFixed(2)}`;
  document.getElementById('kpiTotalReservas').textContent = `${metricasActualesOperador.totalReservas} (${metricasActualesOperador.totalPasajeros} pax)`;
  document.getElementById('kpiTicketPromedio').textContent = `S/ ${metricasActualesOperador.ticketPromedio}`;
  document.getElementById('kpiConversionWeb').textContent = `${metricasActualesOperador.tasaConversion}%`;
  document.getElementById('kpiDetalleVistas').textContent = `${metricasActualesOperador.totalReservas} reservas de ${metricasActualesOperador.totalVistas} visitas`;

  // Pintar tarjetas de sus 3 experiencias asignadas
  const contTours = document.getElementById('misExperienciasOperador');
  if (contTours) {
    contTours.innerHTML = metricasActualesOperador.desglosePorTour.map(t => `
      <div class="col-md-4">
        <div class="border rounded-4 p-3 h-100 bg-light-subtle">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-primary-subtle text-primary">${t.destino}</span>
            <span class="small fw-bold text-success">S/ ${t.ingresos.toFixed(2)}</span>
          </div>
          <h4 class="h6 fw-bold mb-1">${t.titulo}</h4>
          <small class="text-muted d-block">
            <i class="bi bi-eye me-1"></i> ${t.vistas} vistas • 
            <i class="bi bi-people me-1"></i> ${t.pasajeros} pasajeros (${t.reservas} reservas)
          </small>
        </div>
      </div>
    `).join('');
  }

  google.charts.setOnLoadCallback(dibujarTodosLosGraficos);
  if (typeof google !== 'undefined' && google.visualization) {
    dibujarTodosLosGraficos();
  }
}

function dibujarTodosLosGraficos() {
  if (!metricasActualesOperador) return;
  dibujarGoogleChartConversion();
  dibujarDcJsParticipacionTours();
}

// =========================================================
// GRÁFICO 1: GOOGLE CHARTS (Nombres completos y legibles)
// =========================================================
function dibujarGoogleChartConversion() {
  const contenedor = document.getElementById('google_chart_conversion');
  if (!contenedor || typeof google === 'undefined' || !google.visualization) return;

  const isHighContrast = document.body.classList.contains('high-contrast');
  const textColor = isHighContrast ? '#ffff00' : '#0f172a';
  const bgColor = isHighContrast ? '#000000' : '#ffffff';
  const gridColor = isHighContrast ? '#444400' : '#e2e8f0';
  const coloresBarras = isHighContrast ? ['#00e5ff', '#ffff00'] : ['#93c5fd', '#0a587a'];

  const filas = [['Experiencia Turística', 'Visitas Web', 'Reservas']];
  metricasActualesOperador.desglosePorTour.forEach(t => {
    const etiquetaLimpia = NOMBRES_CORTOS_TOURS[t.id] || t.titulo;
    filas.push([etiquetaLimpia, t.vistas, t.reservas]);
  });

  const data = google.visualization.arrayToDataTable(filas);

  const options = {
    backgroundColor: bgColor,
    colors: coloresBarras,
    chartArea: { left: 42, right: 16, top: 38, bottom: 52, width: '100%', height: '65%' },
    legend: { position: 'top', alignment: 'center', textStyle: { color: textColor, fontSize: 12 } },
    hAxis: {
      textStyle: { color: textColor, fontSize: 11, bold: true },
      maxAlternation: 1,
      slantedText: false
    },
    vAxis: {
      minValue: 0,
      textStyle: { color: textColor, fontSize: 11 },
      gridlines: { color: gridColor }
    },
    bar: { groupWidth: '50%' },
    animation: { startup: true, duration: 500, easing: 'out' }
  };

  const chart = new google.visualization.ColumnChart(contenedor);
  chart.draw(data, options);
}

// =========================================================
// GRÁFICO 2: DC.JS + CROSSFILTER (Grafico Dona limpia + Leyenda HTML aparte)
// =========================================================
/*
function dibujarDcJsParticipacionTours() {
  const contenedor = document.getElementById('dc_chart_tours');
  if (!contenedor || typeof dc === 'undefined' || typeof crossfilter === 'undefined') return;

  contenedor.innerHTML = '';
  const isHighContrast = document.body.classList.contains('high-contrast');
  const paleta = isHighContrast ? ['#ffff00', '#00e5ff', '#ffffff'] : ['#0a587a', '#38bdf8', '#0284c7'];

  const datosTours = metricasActualesOperador.desglosePorTour.map(t => ({
    id: t.id,
    ruta: NOMBRES_CORTOS_TOURS[t.id] || t.titulo,
    pasajeros: t.pasajeros > 0 ? t.pasajeros : 1,
    pasajerosReales: t.pasajeros
  }));

  const ndx = crossfilter(datosTours);
  const rutaDim = ndx.dimension(d => d.ruta);
  const pasajerosGroup = rutaDim.group().reduceSum(d => d.pasajeros);

  // Contenedor interno exclusivo para el SVG de la dona
  const svgBox = document.createElement('div');
  svgBox.id = 'dc_pie_svg_box';
  svgBox.className = 'd-flex justify-content-center';
  contenedor.appendChild(svgBox);

  const pieChart = dc.pieChart('#dc_pie_svg_box');

  pieChart
    .width(210)
    .height(210)
    .radius(95)
    .innerRadius(48)
    .slicesCap(3)
    .dimension(rutaDim)
    .group(pasajerosGroup)
    .colors(d3.scaleOrdinal().range(paleta))
    // Dentro de la dona solo ponemos el número corto para que nunca se cruce
    .label(d => `${d.value} pax`)
    .title(d => `${d.key}: ${d.value} pasajeros`);

  pieChart.render();

  // Leyenda limpia y ordenada debajo de la dona (sin encimarse)
  const leyendaDiv = document.createElement('div');
  leyendaDiv.className = 'mt-2 w-100 d-flex flex-column gap-1 small';
  leyendaDiv.innerHTML = datosTours.map((item, idx) => `
    <div class="d-flex justify-content-between align-items-center px-2">
      <span class="d-flex align-items-center gap-2">
        <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:${paleta[idx % paleta.length]}; border: 1px solid #94a3b8;"></span>
        <span>${item.ruta}</span>
      </span>
      <strong>${item.pasajerosReales} pax</strong>
    </div>
  `).join('');
  contenedor.appendChild(leyendaDiv);
}
*/
function dibujarDcJsParticipacionTours() {
  const contenedor = document.getElementById('dc_chart_tours');
  if (!contenedor || typeof dc === 'undefined' || typeof crossfilter === 'undefined') return;

  contenedor.innerHTML = '';
  const isHighContrast = document.body.classList.contains('high-contrast');
  const paleta = isHighContrast ? ['#ffff00', '#00e5ff', '#ffffff'] : ['#0a587a', '#38bdf8', '#0284c7'];

  // Usar directamente los pasajeros reales de cada tour
  const datosTours = metricasActualesOperador.desglosePorTour.map((t, index) => ({
    id: t.id,
    ruta: NOMBRES_CORTOS_TOURS[t.id] || t.titulo,
    pasajeros: t.pasajeros,
    color: paleta[index % paleta.length]
  }));

  const ndx = crossfilter(datosTours);
  const rutaDim = ndx.dimension(d => d.ruta);
  const pasajerosGroup = rutaDim.group().reduceSum(d => d.pasajeros);

  // Mapa de color fijo por ruta para que la dona y la leyenda siempre coincidan
  const colorPorRuta = {};
  datosTours.forEach(d => { colorPorRuta[d.ruta] = d.color; });

  const svgBox = document.createElement('div');
  svgBox.id = 'dc_pie_svg_box';
  svgBox.className = 'd-flex justify-content-center';
  contenedor.appendChild(svgBox);

  const pieChart = dc.pieChart('#dc_pie_svg_box');

  pieChart
    .width(200)
    .height(200)
    .radius(90)
    .innerRadius(46)
    .slicesCap(3)
    .dimension(rutaDim)
    .group(pasajerosGroup)
    .colors(d => colorPorRuta[d] || paleta[0])
    .label(d => d.value > 0 ? `${d.value} pax` : '') // Solo etiqueta porciones mayores a 0
    .title(d => `${d.key}: ${d.value} pasajeros`);

  pieChart.render();

  // Leyenda limpia con los valores 100% reales
  const leyendaDiv = document.createElement('div');
  leyendaDiv.className = 'mt-2 w-100 d-flex flex-column gap-1 small';
  leyendaDiv.innerHTML = datosTours.map(item => `
    <div class="d-flex justify-content-between align-items-center px-2">
      <span class="d-flex align-items-center gap-2">
        <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:${item.color}; border: 1px solid #94a3b8;"></span>
        <span>${item.ruta}</span>
      </span>
      <strong>${item.pasajeros} pax</strong>
    </div>
  `).join('');
  contenedor.appendChild(leyendaDiv);
}
document.addEventListener('DOMContentLoaded', iniciarDashboardsOperador);
window.addEventListener('contrastChanged', dibujarTodosLosGraficos);
window.addEventListener('resize', dibujarTodosLosGraficos);