/**
 * Funciones helper para parsear el título del requerimiento
 * Formato esperado: "NOMBRE (DD/MM/YYYY - DD/MM/YYYY)"
 */

/**
 * Extrae el nombre del consultor del título
 * Ejemplo: "ANDRE ISRAEL ALZAMORA DEZA (25/11/2025 - 24/12/2025)" → "ANDRE ISRAEL ALZAMORA DEZA"
 */
export const extraerNombreConsultor = (titulo) => {
  if (!titulo) return "-";

  // Buscar el índice del paréntesis de apertura
  const indexParentesis = titulo.indexOf("(");

  if (indexParentesis === -1) {
    // Si no hay paréntesis, devolver el título completo
    return titulo.trim();
  }

  // Extraer todo antes del paréntesis
  return titulo.substring(0, indexParentesis).trim();
};

/**
 * Extrae la fecha de inicio del título
 * Ejemplo: "ANDRE ISRAEL ALZAMORA DEZA (25/11/2025 - 24/12/2025)" → "25/11/2025"
 */
export const extraerFechaInicio = (titulo) => {
  if (!titulo) return "-";

  // Buscar el contenido entre paréntesis
  const match = titulo.match(/\(([^)]+)\)/);

  if (!match) return "-";

  // El contenido dentro de los paréntesis
  const contenido = match[1];

  // Separar por " - "
  const fechas = contenido.split(" - ");

  if (fechas.length < 1) return "-";

  // Primera fecha es la fecha de inicio
  return fechas[0].trim();
};

/**
 * Extrae la fecha final del título
 * Ejemplo: "ANDRE ISRAEL ALZAMORA DEZA (25/11/2025 - 24/12/2025)" → "24/12/2025"
 */
export const extraerFechaFinal = (titulo) => {
  if (!titulo) return "-";

  // Buscar el contenido entre paréntesis
  const match = titulo.match(/\(([^)]+)\)/);

  if (!match) return "-";

  // El contenido dentro de los paréntesis
  const contenido = match[1];

  // Separar por " - "
  const fechas = contenido.split(" - ");

  if (fechas.length < 2) return "-";

  // Segunda fecha es la fecha final
  return fechas[1].trim();
};

/**
 * Parsea el título completo y devuelve un objeto con toda la información
 * Ejemplo: "ANDRE ISRAEL ALZAMORA DEZA (25/11/2025 - 24/12/2025)"
 * Retorna: { nombre: "ANDRE ISRAEL ALZAMORA DEZA", fechaInicio: "25/11/2025", fechaFinal: "24/12/2025" }
 */
export const parsearTitulo = (titulo) => {
  return {
    nombre: extraerNombreConsultor(titulo),
    fechaInicio: extraerFechaInicio(titulo),
    fechaFinal: extraerFechaFinal(titulo),
  };
};

/**
 * Ejemplos de uso:
 *
 * const titulo = "ANDRE ISRAEL ALZAMORA DEZA (25/11/2025 - 24/12/2025)";
 *
 * // Opción 1: Funciones individuales
 * const nombre = extraerNombreConsultor(titulo);  // "ANDRE ISRAEL ALZAMORA DEZA"
 * const inicio = extraerFechaInicio(titulo);      // "25/11/2025"
 * const final = extraerFechaFinal(titulo);        // "24/12/2025"
 *
 * // Opción 2: Parsear todo de una vez
 * const info = parsearTitulo(titulo);
 * console.log(info.nombre);       // "ANDRE ISRAEL ALZAMORA DEZA"
 * console.log(info.fechaInicio);  // "25/11/2025"
 * console.log(info.fechaFinal);   // "24/12/2025"
 */
