// src/services/detalleasignaciones/filtrarasignaciones.js
import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

/**
 * Filtrar asignaciones del coordinador con múltiples criterios
 * @param {Object} filtros - Objeto con los filtros a aplicar
 * @param {Date} filtros.fechaInicio - Fecha de inicio (opcional)
 * @param {Date} filtros.fechaFin - Fecha de fin (opcional)
 * @param {number} filtros.idUsuario - ID del cliente (opcional)
 * @param {string} filtros.nombreConsultor - Nombre del consultor (opcional)
 * @param {string} token - Token de autenticación
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @returns {Promise} - Respuesta con Page<AsignacionResource>
 */
export async function FiltrarAsignaciones(filtros, token, page = 0, size = 10) {
  try {
    // Construir parámetros dinámicos
    const params = {
      page,
      size,
      sort: "idRequerimiento,desc",
    };

    // Agregar filtros solo si existen
    if (filtros.fechaInicio) {
      params.fechaInicio = filtros.fechaInicio;
    }
    if (filtros.fechaFin) {
      params.fechaFin = filtros.fechaFin;
    }
    if (filtros.idUsuario) {
      params.idUsuario = filtros.idUsuario;
    }
    if (filtros.nombreConsultor) {
      params.nombreConsultor = filtros.nombreConsultor;
    }

    if (filtros.nombrecomercial) {
      params.nombrecomercial = filtros.nombrecomercial;
    }

    console.log("📤 Filtros enviados al backend:", params);

    const response = await axios.get(`${API}/asignaciones/search`, {
      params,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Respuesta del filtrado:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al filtrar asignaciones:", error);
    throw new Error(getErrorMessage(error));
  }
}
