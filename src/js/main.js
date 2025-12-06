// ========================================
// RESTAURANTE CHEFDIGITAL - JAVASCRIPT
// Archivo: main.js
// Descripción: Funcionalidades interactivas básicas
// ========================================

// ========================================
// 1. ESPERAR A QUE EL DOM ESTÉ COMPLETAMENTE CARGADO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
	console.log('✅ DOM cargado - Inicializando funcionalidades');

	// Inicializar todas las funcionalidades
	inicializarNavegacion();
	inicializarFormularioReservas();
	inicializarFormularioContacto();
	inicializarAnimaciones();
	inicializarFechaMinima();
	inicializarContadores();

	console.log('✅ Todas las funcionalidades inicializadas correctamente');
});

// ========================================
// 2. NAVEGACIÓN SUAVE (SMOOTH SCROLL)
// ========================================

/**
 * Inicializa la navegación suave entre secciones
 * Al hacer clic en un enlace del menú, se desplaza suavemente a la sección
 */
function inicializarNavegacion() {
	// Seleccionar todos los enlaces que comienzan con #
	const enlaces = document.querySelectorAll('a[href^="#"]');

	// Agregar evento click a cada enlace
	enlaces.forEach(function(enlace) {
		enlace.addEventListener('click', function(evento) {
			// Prevenir el comportamiento por defecto del enlace
			evento.preventDefault();

			// Obtener el ID de la sección destino
			const destino = this.getAttribute('href');
			const seccion = document.querySelector(destino);

			// Verificar si la sección existe
			if (seccion) {
				// Calcular la posición considerando el header fijo (80px)
				const posicion = seccion.offsetTop - 80;

				// Desplazarse suavemente a la sección
				window.scrollTo({
					top: posicion,
					behavior: 'smooth'
				});

				console.log('📍 Navegando a: ' + destino);
			}
		});
	});

	console.log('✅ Navegación suave inicializada');
}

// ========================================
// 3. FORMULARIO DE RESERVAS
// ========================================

/**
 * Inicializa el formulario de reservas con validaciones y manejo de envío
 */
function inicializarFormularioReservas() {
	// Seleccionar el formulario de reservas
	const formulario = document.getElementById('reservationForm');

	// Verificar si el formulario existe
	if (!formulario) {
		console.warn('⚠️ Formulario de reservas no encontrado');
		return;
	}

	// Agregar evento submit al formulario
	formulario.addEventListener('submit', function(evento) {
		// Prevenir el envío real del formulario
		evento.preventDefault();

		// Validar el formulario
		if (validarFormularioReservas(this)) {
			// Obtener los datos del formulario
			const datos = obtenerDatosFormulario(this);

			// Mostrar los datos en consola (simulación)
			console.log('📋 Datos de la reserva:', datos);

			// Mostrar mensaje de éxito
			mostrarMensajeExito('¡Reserva confirmada! Recibirá un email de confirmación en breve.');

			// Limpiar el formulario
			this.reset();

			// Remover clases de validación
			limpiarEstilosValidacion(this);
		} else {
			// Mostrar mensaje de error
			mostrarMensajeError('Por favor, complete todos los campos requeridos correctamente.');
		}
	});

	// Agregar validación en tiempo real a los campos
	agregarValidacionTiempoReal(formulario);

	console.log('✅ Formulario de reservas inicializado');
}

/**
 * Valida todos los campos del formulario de reservas
 * @param {HTMLFormElement} formulario - El formulario a validar
 * @returns {boolean} - true si el formulario es válido, false si no
 */
function validarFormularioReservas(formulario) {
	let esValido = true;

	// Campos requeridos del formulario
	const camposRequeridos = ['nombre', 'telefono', 'email', 'personas', 'fecha', 'hora'];

	// Validar cada campo
	camposRequeridos.forEach(function(nombreCampo) {
		const campo = formulario.querySelector('#' + nombreCampo);

		if (!campo) {
			console.warn('⚠️ Campo no encontrado: ' + nombreCampo);
			return;
		}

		// Verificar si el campo está vacío
		if (!campo.value.trim()) {
			marcarCampoInvalido(campo);
			esValido = false;
		} else {
			// Validaciones específicas por tipo de campo
			if (nombreCampo === 'email' && !validarEmail(campo.value)) {
				marcarCampoInvalido(campo);
				esValido = false;
			} else if (nombreCampo === 'fecha' && !validarFecha(campo.value)) {
				marcarCampoInvalido(campo);
				esValido = false;
			} else {
				marcarCampoValido(campo);
			}
		}
	});

	return esValido;
}

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido
 */
function validarEmail(email) {
	// Expresión regular para validar email
	const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return patron.test(email);
}

/**
 * Valida que la fecha sea posterior a hoy
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si la fecha es válida
 */
function validarFecha(fecha) {
	const fechaSeleccionada = new Date(fecha);
	const hoy = new Date();
	// Resetear horas para comparar solo fechas
	hoy.setHours(0, 0, 0, 0);

	return fechaSeleccionada > hoy;
}

/**
 * Marca un campo como inválido visualmente
 * @param {HTMLInputElement} campo - Campo a marcar
 */
function marcarCampoInvalido(campo) {
	campo.classList.add('campo-invalido');
	campo.classList.remove('campo-valido');
}

/**
 * Marca un campo como válido visualmente
 * @param {HTMLInputElement} campo - Campo a marcar
 */
function marcarCampoValido(campo) {
	campo.classList.add('campo-valido');
	campo.classList.remove('campo-invalido');
}

/**
 * Limpia los estilos de validación de todos los campos
 * @param {HTMLFormElement} formulario - Formulario a limpiar
 */
function limpiarEstilosValidacion(formulario) {
	const campos = formulario.querySelectorAll('input, select, textarea');
	campos.forEach(function(campo) {
		campo.classList.remove('campo-valido', 'campo-invalido');
	});
}

/**
 * Agrega validación en tiempo real a los campos del formulario
 * @param {HTMLFormElement} formulario - Formulario a monitorear
 */
function agregarValidacionTiempoReal(formulario) {
	const campos = formulario.querySelectorAll('input[required], select[required], textarea[required]');

	campos.forEach(function(campo) {
		// Validar al perder el foco (blur)
		campo.addEventListener('blur', function() {
			if (this.value.trim()) {
				// Validaciones específicas
				if (this.type === 'email') {
					validarEmail(this.value) ? marcarCampoValido(this) : marcarCampoInvalido(this);
				} else if (this.type === 'date') {
					validarFecha(this.value) ? marcarCampoValido(this) : marcarCampoInvalido(this);
				} else {
					marcarCampoValido(this);
				}
			}
		});

		// Limpiar estilo al escribir
		campo.addEventListener('input', function() {
			if (this.classList.contains('campo-invalido')) {
				this.classList.remove('campo-invalido');
			}
		});
	});
}

// ========================================
// 4. FORMULARIO DE CONTACTO
// ========================================

/**
 * Inicializa el formulario de contacto
 */
function inicializarFormularioContacto() {
	const formulario = document.getElementById('contactForm');

	if (!formulario) {
		console.warn('⚠️ Formulario de contacto no encontrado');
		return;
	}

	formulario.addEventListener('submit', function(evento) {
		evento.preventDefault();

		if (validarFormularioContacto(this)) {
			const datos = obtenerDatosFormulario(this);
			console.log('📧 Datos del mensaje de contacto:', datos);

			mostrarMensajeExito('¡Mensaje enviado correctamente! Le responderemos en breve.');
			this.reset();
			limpiarEstilosValidacion(this);
		} else {
			mostrarMensajeError('Por favor, complete todos los campos requeridos correctamente.');
		}
	});

	agregarValidacionTiempoReal(formulario);

	console.log('✅ Formulario de contacto inicializado');
}

/**
 * Valida el formulario de contacto
 * @param {HTMLFormElement} formulario - Formulario a validar
 * @returns {boolean} - true si es válido
 */
function validarFormularioContacto(formulario) {
	let esValido = true;
	const camposRequeridos = ['contactNombre', 'contactEmail', 'asunto', 'mensaje'];

	camposRequeridos.forEach(function(nombreCampo) {
		const campo = formulario.querySelector('#' + nombreCampo);

		if (!campo || !campo.value.trim()) {
			if (campo) marcarCampoInvalido(campo);
			esValido = false;
		} else {
			if (nombreCampo === 'contactEmail' && !validarEmail(campo.value)) {
				marcarCampoInvalido(campo);
				esValido = false;
			} else {
				marcarCampoValido(campo);
			}
		}
	});

	return esValido;
}

// ========================================
// 5. UTILIDADES DE FORMULARIOS
// ========================================

/**
 * Obtiene todos los datos de un formulario en formato de objeto
 * @param {HTMLFormElement} formulario - Formulario del cual obtener datos
 * @returns {Object} - Objeto con los datos del formulario
 */
function obtenerDatosFormulario(formulario) {
	const datos = {};
	const elementos = formulario.elements;

	// Iterar sobre todos los elementos del formulario
	for (let i = 0; i < elementos.length; i++) {
		const elemento = elementos[i];

		// Solo procesar elementos con nombre
		if (elemento.name) {
			datos[elemento.name] = elemento.value;
		}
	}

	return datos;
}

/**
 * Muestra un mensaje de éxito al usuario
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarMensajeExito(mensaje) {
	alert('✅ ' + mensaje);
	console.log('✅ ' + mensaje);
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarMensajeError(mensaje) {
	alert('❌ ' + mensaje);
	console.error('❌ ' + mensaje);
}

// ========================================
// 6. FECHA MÍNIMA PARA RESERVAS
// ========================================

/**
 * Establece la fecha mínima para el campo de fecha (mañana)
 */
function inicializarFechaMinima() {
	const campoFecha = document.getElementById('fecha');

	if (!campoFecha) {
		console.warn('⚠️ Campo de fecha no encontrado');
		return;
	}

	// Obtener la fecha de mañana
	const hoy = new Date();
	const manana = new Date(hoy);
	manana.setDate(hoy.getDate() + 1);

	// Formatear la fecha a YYYY-MM-DD
	const año = manana.getFullYear();
	const mes = String(manana.getMonth() + 1).padStart(2, '0');
	const dia = String(manana.getDate()).padStart(2, '0');
	const fechaMinima = año + '-' + mes + '-' + dia;

	// Establecer el atributo min
	campoFecha.setAttribute('min', fechaMinima);

	console.log('✅ Fecha mínima establecida: ' + fechaMinima);
}

// ========================================
// 7. ANIMACIONES AL HACER SCROLL
// ========================================

/**
 * Inicializa las animaciones que se activan al hacer scroll
 */
function inicializarAnimaciones() {
	// Seleccionar elementos a animar
	const elementos = document.querySelectorAll('.card, .menu-table, .form-container, .hours__grid');

	// Opciones para el Intersection Observer
	const opciones = {
		threshold: 0.1, // El elemento debe ser 10% visible
		rootMargin: '0px 0px -50px 0px' // Margen inferior
	};

	// Crear el observador
	const observador = new IntersectionObserver(function(entradas, observador) {
		entradas.forEach(function(entrada) {
			// Si el elemento es visible
			if (entrada.isIntersecting) {
				// Agregar clase para animar
				entrada.target.classList.add('animado');

				// Dejar de observar este elemento
				observador.unobserve(entrada.target);

				console.log('🎨 Elemento animado:', entrada.target.className);
			}
		});
	}, opciones);

	// Observar cada elemento
	elementos.forEach(function(elemento) {
		// Agregar clase inicial
		elemento.classList.add('por-animar');
		observador.observe(elemento);
	});

	console.log('✅ Animaciones de scroll inicializadas');
}

// ========================================
// 8. CONTADORES ANIMADOS
// ========================================

/**
 * Inicializa contadores animados en las estadísticas
 */
function inicializarContadores() {
	// Por ahora solo preparamos la función
	// Se puede usar para agregar estadísticas en el futuro
	console.log('✅ Sistema de contadores preparado');
}

/**
 * Anima un número desde un valor inicial hasta un valor final
 * @param {HTMLElement} elemento - Elemento donde mostrar el número
 * @param {number} inicio - Número inicial
 * @param {number} fin - Número final
 * @param {number} duracion - Duración en milisegundos
 */
function animarContador(elemento, inicio, fin, duracion) {
	let actual = inicio;
	const incremento = (fin - inicio) / (duracion / 16); // 60 FPS

	const timer = setInterval(function() {
		actual += incremento;

		if (actual >= fin) {
			elemento.textContent = fin;
			clearInterval(timer);
		} else {
			elemento.textContent = Math.floor(actual);
		}
	}, 16);
}

// ========================================
// 9. MENÚ RESPONSIVE (MÓVIL)
// ========================================

/**
 * Maneja el comportamiento del menú en dispositivos móviles
 * Esta función está preparada para cuando se agregue un botón hamburguesa
 */
function inicializarMenuMovil() {
	// Preparado para futuras mejoras
	console.log('✅ Menú móvil preparado para expansión');
}

// ========================================
// 10. DESTACAR SECCIÓN ACTIVA EN LA NAVEGACIÓN
// ========================================

/**
 * Detecta la sección visible y destaca el enlace correspondiente en el menú
 */
window.addEventListener('scroll', function() {
	// Obtener todas las secciones con ID
	const secciones = document.querySelectorAll('section[id]');
	const enlaces = document.querySelectorAll('.nav__link');

	// Posición actual del scroll
	const scrollY = window.pageYOffset;

	// Verificar qué sección está visible
	secciones.forEach(function(seccion) {
		const alturSeccion = seccion.offsetHeight;
		const topSeccion = seccion.offsetTop - 100;
		const idSeccion = seccion.getAttribute('id');

		// Si estamos en esta sección
		if (scrollY > topSeccion && scrollY <= topSeccion + alturSeccion) {
			// Remover clase activa de todos los enlaces
			enlaces.forEach(function(enlace) {
				enlace.classList.remove('nav__link--activo');
			});

			// Agregar clase activa al enlace correspondiente
			const enlaceActivo = document.querySelector('.nav__link[href="#' + idSeccion + '"]');
			if (enlaceActivo) {
				enlaceActivo.classList.add('nav__link--activo');
			}
		}
	});
});

// ========================================
// 11. MOSTRAR/OCULTAR HEADER AL HACER SCROLL
// ========================================

/**
 * Oculta el header al hacer scroll hacia abajo y lo muestra al subir
 */
(function() {
	let scrollAnterior = window.pageYOffset;
	const header = document.querySelector('.header');

	window.addEventListener('scroll', function() {
		const scrollActual = window.pageYOffset;

		// Si hacemos scroll hacia abajo
		if (scrollActual > scrollAnterior && scrollActual > 100) {
			header.style.transform = 'translateY(-100%)';
		} else {
			// Si hacemos scroll hacia arriba
			header.style.transform = 'translateY(0)';
		}

		scrollAnterior = scrollActual;
	});

	console.log('✅ Comportamiento de header al scroll inicializado');
})();

// ========================================
// 12. TOOLTIP O INFORMACIÓN ADICIONAL
// ========================================

/**
 * Muestra información adicional al pasar el mouse sobre elementos específicos
 */
function inicializarTooltips() {
	// Preparado para agregar tooltips en el futuro
	console.log('✅ Sistema de tooltips preparado');
}

// ========================================
// 13. CONFIRMACIÓN ANTES DE SALIR (SI HAY DATOS EN FORMULARIO)
// ========================================

/**
 * Advierte al usuario si intenta salir con un formulario a medio llenar
 */
function inicializarAdvertenciaSalida() {
	const formularios = document.querySelectorAll('form');
	let formularioModificado = false;

	formularios.forEach(function(formulario) {
		// Detectar cambios en el formulario
		formulario.addEventListener('input', function() {
			formularioModificado = true;
		});

		// Limpiar bandera al enviar
		formulario.addEventListener('submit', function() {
			formularioModificado = false;
		});
	});

	// Advertir antes de salir
	window.addEventListener('beforeunload', function(evento) {
		if (formularioModificado) {
			evento.preventDefault();
			evento.returnValue = '¿Está seguro que desea salir? Hay cambios sin guardar.';
			return evento.returnValue;
		}
	});

	console.log('✅ Advertencia de salida inicializada');
}

// Inicializar advertencia de salida
inicializarAdvertenciaSalida();

// ========================================
// 14. UTILIDADES GENERALES
// ========================================

/**
 * Muestra un mensaje en consola con formato
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje: 'info', 'success', 'warning', 'error'
 */
function log(mensaje, tipo) {
	tipo = tipo || 'info';

	const prefijos = {
		info: 'ℹ️',
		success: '✅',
		warning: '⚠️',
		error: '❌'
	};

	const prefijo = prefijos[tipo] || 'ℹ️';
	console.log(prefijo + ' ' + mensaje);
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
function capitalizar(texto) {
	if (!texto) return '';
	return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Formatea una fecha en español
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fecha) {
	const opciones = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	return fecha.toLocaleDateString('es-ES', opciones);
}

// ========================================
// FIN DEL ARCHIVO
// ========================================

console.log('📄 Archivo main.js cargado completamente');
console.log('🎉 Restaurante ChefDigital - JavaScript activo');
