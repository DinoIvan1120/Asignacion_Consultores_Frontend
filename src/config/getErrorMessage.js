export function getErrorMessage(error) {
  if (!error.response) {
    if (error.message.includes("Network Error")) {
      return "Problema de CORS. Verifica que el servidor permita solicitudes de este origen";
    }
    return "No se pudo conectar con el servidor. Por favor, verifica tu conexión a Internet.";
  }

  console.error("Error del servicio: ", error);

  debugger;
  const status = error?.response?.status ?? "desconocido";
  const errorMessages = {
    400: `Revisa tus credenciales: Estado -> ${status}`,
    401: `No autenticado (Estado: ${status} Unauthorized). Se necesita iniciar sesión nuevamente.`,
    403: `Acceso denegado (Estado: ${status} Forbidden). No tienes permiso para realizar esta acción.`,
    404: `Recurso no encontrado (Estado: ${status} Not Found).`,
    500: `Error en el servidor (Estado: ${status}). Comuniquece con el administrador Backend.`,
    502: `Error de gateway (Estado: ${status} Bad Gateway). El servidor recibio una respuesta no valida.`,
    503: `Servicio no disponible (Estado: ${status}Service Unavailable). Por favor, intenta más tarde.`,
    504: `Tiempo de espera agotado (Estado: ${status} Gateway Timeout). El servidor tardo demasiado en responder`,
  };

  return (
    errorMessages[status] ||
    `Ocurrió un error (Estado: ${status}). Por favor, intenta nuevamente.`
  );
}
