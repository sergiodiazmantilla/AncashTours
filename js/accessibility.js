/*
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

*/
// Teclado 
document.addEventListener('DOMContentLoaded', () => {
  const contrastToggle = document.getElementById('contrastToggle');
  const btnDecrease = document.getElementById('fontDecrease');
  const btnIncrease = document.getElementById('fontIncrease');
  let currentScale = 100;

  // 1. Restaurar y controlar Alto Contraste
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
    if (contrastToggle) contrastToggle.checked = true;
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      const activo = e.target.checked;
      document.body.classList.toggle('high-contrast', activo);
      localStorage.setItem('highContrast', activo);
      window.dispatchEvent(new Event('contrastChanged'));
    });
  }

  // 2. Tamaño de fuente (A- / A+)
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

  // 3. Habilitar pestaña "Mi ticket" SOLO si hay reserva activa
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

  // 4. PANEL UNIFICADO DE ACCESIBILIDAD MOTORA (TECLADO + VOZ + FLECHAS)
  iniciarPanelAccesibilidadMotora();
});

function iniciarPanelAccesibilidadMotora() {
  // Inyectar botón único "Teclado" junto al botón A+ de la barra superior
  const btnIncrease = document.getElementById('fontIncrease');
  if (btnIncrease && !document.getElementById('btnToggleTeclado')) {
    const btnTeclado = document.createElement('button');
    btnTeclado.id = 'btnToggleTeclado';
    btnTeclado.type = 'button';
    btnTeclado.className = 'btn btn-outline-primary btn-sm fw-semibold';
    btnTeclado.setAttribute('aria-label', 'Mostrar u ocultar teclado virtual y controles de desplazamiento');
    btnTeclado.innerHTML = '<i class="bi bi-keyboard me-1"></i> Teclado';
    btnIncrease.parentNode.insertBefore(btnTeclado, btnIncrease.nextSibling);
  }

  // Crear contenedor unificado con Teclado a la izquierda y Flechas a la derecha
  const vkWrapper = document.createElement('div');
  vkWrapper.id = 'virtualKeyboardContainer';
  vkWrapper.setAttribute('role', 'region');
  vkWrapper.setAttribute('aria-label', 'Teclado virtual y control de desplazamiento');
  vkWrapper.innerHTML = `
    <div class="vk-header">
      <span><i class="bi bi-universal-access me-1"></i> <strong>Asistente Motor</strong> — Escribe con el mouse, dicta por voz o desliza la pantalla</span>
      <div class="d-flex align-items-center gap-2">
        <button type="button" id="vkVoiceBtn" class="btn btn-sm btn-outline-primary fw-semibold py-0 px-2">
          <i class="bi bi-mic-fill me-1"></i> Dictar por voz
        </button>
        <button type="button" id="vkCloseBtn" class="btn btn-sm btn-outline-danger py-0 px-2">Cerrar ✕</button>
      </div>
    </div>

    <div class="vk-body-layout">
      <!-- Bloque Izquierdo: Teclado QWERTY -->
      <div class="vk-grid" id="vkKeysGrid"></div>

      <!-- Bloque Derecho: Cruceta Direccional Integrada -->
      <div class="vk-nav-section">
        <span class="vk-nav-label">Desplazar vista</span>
        <div class="navpad-grid">
          <div></div>
          <button type="button" class="navpad-btn" id="navUp" aria-label="Desplazar hacia arriba" title="Subir">
            <i class="bi bi-arrow-up"></i>
          </button>
          <div></div>

          <button type="button" class="navpad-btn" id="navLeft" aria-label="Desplazar hacia la izquierda" title="Izquierda">
            <i class="bi bi-arrow-left"></i>
          </button>
          <button type="button" class="navpad-btn navpad-center" id="navTop" aria-label="Volver al inicio de la página" title="Ir arriba del todo">
            Inicio
          </button>
          <button type="button" class="navpad-btn" id="navRight" aria-label="Desplazar hacia la derecha" title="Derecha">
            <i class="bi bi-arrow-right"></i>
          </button>

          <div></div>
          <button type="button" class="navpad-btn" id="navDown" aria-label="Desplazar hacia abajo" title="Bajar">
            <i class="bi bi-arrow-down"></i>
          </button>
          <div></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(vkWrapper);

  // --- LÓGICA DEL TECLADO VIRTUAL ---
  let campoActivo = null;
  let mayusculas = false;

  const filasTeclas = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Borrar'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['Mayús', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '@', '.', '-'],
    ['Espacio', 'Limpiar']
  ];

  document.addEventListener('focusin', (e) => {
    const tag = e.target.tagName.toLowerCase();
    const tiposTexto = ['text', 'email', 'password', 'tel', 'search', 'number'];
    if ((tag === 'input' && tiposTexto.includes(e.target.type)) || tag === 'textarea') {
      campoActivo = e.target;
    }
  });

  function renderizarTeclas() {
    const grid = document.getElementById('vkKeysGrid');
    grid.innerHTML = '';

    filasTeclas.forEach(fila => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'vk-row';

      fila.forEach(tecla => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vk-key';

        let etiqueta = tecla;
        if (tecla.length === 1 && /[a-zñ]/.test(tecla)) {
          etiqueta = mayusculas ? tecla.toUpperCase() : tecla.toLowerCase();
        }
        btn.textContent = etiqueta;

        if (tecla === 'Borrar' || tecla === 'Mayús' || tecla === 'Limpiar') {
          btn.classList.add('vk-key-wide');
        }
        if (tecla === 'Espacio') {
          btn.classList.add('vk-key-space');
        }
        if (tecla === 'Mayús' && mayusculas) {
          btn.classList.add('bg-primary', 'text-white');
        }

        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          procesarPulsacion(tecla, etiqueta);
        });

        rowDiv.appendChild(btn);
      });

      grid.appendChild(rowDiv);
    });
  }

  function procesarPulsacion(teclaBase, valorCaracter) {
    if (teclaBase === 'Mayús') {
      mayusculas = !mayusculas;
      renderizarTeclas();
      return;
    }

    if (!campoActivo) {
      const primerInput = document.querySelector('input[type="text"], input[type="email"], input[type="search"]');
      if (primerInput) {
        primerInput.focus();
        campoActivo = primerInput;
      } else {
        return;
      }
    }

    if (teclaBase === 'Borrar') {
      campoActivo.value = campoActivo.value.slice(0, -1);
    } else if (teclaBase === 'Limpiar') {
      campoActivo.value = '';
    } else if (teclaBase === 'Espacio') {
      campoActivo.value += ' ';
    } else {
      campoActivo.value += valorCaracter;
    }

    campoActivo.dispatchEvent(new Event('input', { bubbles: true }));
    campoActivo.focus();
  }

  renderizarTeclas();

  // --- LÓGICA DE LAS FLECHAS DIRECCIONALES INTEGRADAS ---
  const desplazar = (x, y) => {
    window.scrollBy({ left: x, top: y, behavior: 'smooth' });
    const contenedorHorizontal = document.querySelector('.table-responsive');
    if (contenedorHorizontal && x !== 0) {
      contenedorHorizontal.scrollBy({ left: x, behavior: 'smooth' });
    }
  };

  let intervaloScroll = null;
  const vincularDireccion = (idBtn, dx, dy) => {
    const btn = document.getElementById(idBtn);
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Evita quitar el foco si estaba escribiendo
      desplazar(dx, dy);
      intervaloScroll = setInterval(() => desplazar(dx, dy), 180);
    });
    btn.addEventListener('mouseup', () => clearInterval(intervaloScroll));
    btn.addEventListener('mouseleave', () => clearInterval(intervaloScroll));
  };

  vincularDireccion('navUp', 0, -260);
  vincularDireccion('navDown', 0, 260);
  vincularDireccion('navLeft', -220, 0);
  vincularDireccion('navRight', 220, 0);

  document.getElementById('navTop').addEventListener('mousedown', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });

  // --- DICTADO POR VOZ (WEB SPEECH API) ---
  const btnVoz = document.getElementById('vkVoiceBtn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    btnVoz.disabled = true;
    btnVoz.title = 'Tu navegador no soporta dictado por voz (usa Chrome o Edge)';
  } else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let escuchando = false;

    btnVoz.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (!escuchando) {
        recognition.start();
      } else {
        recognition.stop();
      }
    });

    recognition.onstart = () => {
      escuchando = true;
      btnVoz.className = 'btn btn-sm btn-danger fw-semibold py-0 px-2';
      btnVoz.innerHTML = '<i class="bi bi-record-circle me-1"></i> Escuchando...';
    };

    recognition.onresult = (event) => {
      let textoDictado = event.results[0][0].transcript.trim().replace(/\.+$/, '');

      if (!campoActivo) {
        const primerInput = document.querySelector('input[type="text"], input[type="email"], input[type="search"]');
        if (primerInput) {
          primerInput.focus();
          campoActivo = primerInput;
        } else {
          return;
        }
      }

      if (campoActivo.type === 'email') {
        textoDictado = textoDictado
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace('arroba', '@')
          .replace('punto', '.');
      } else if (campoActivo.type === 'tel') {
        textoDictado = textoDictado.replace(/\s+/g, '');
      }

      campoActivo.value = textoDictado;
      campoActivo.dispatchEvent(new Event('input', { bubbles: true }));
      campoActivo.focus();
    };

    recognition.onerror = (event) => {
      alert('No se pudo captar el audio (' + event.error + '). Verifica el permiso del micrófono.');
    };

    recognition.onend = () => {
      escuchando = false;
      btnVoz.className = 'btn btn-sm btn-outline-primary fw-semibold py-0 px-2';
      btnVoz.innerHTML = '<i class="bi bi-mic-fill me-1"></i> Dictar por voz';
    };
  }

  // --- MOSTRAR / OCULTAR PANEL UNIFICADO ---
  if (localStorage.getItem('virtualKeyboardOpen') === 'true') {
    vkWrapper.classList.add('vk-visible');
  }

  const toggleBtn = document.getElementById('btnToggleTeclado');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const visible = vkWrapper.classList.toggle('vk-visible');
      localStorage.setItem('virtualKeyboardOpen', visible);
    });
  }

  document.getElementById('vkCloseBtn').addEventListener('click', () => {
    vkWrapper.classList.remove('vk-visible');
    localStorage.setItem('virtualKeyboardOpen', 'false');
  });
}