import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

/**
 * 🔍 Buscar/Filtrar requerimientos con múltiples filtros opcionales
 *
 * @param {string} token - Token de autorización (Bearer)
 * @param {object} filtros - Objeto con los filtros opcionales
 * @param {number} filtros.idEmpresa - ID de la empresa (opcional)
 * @param {string} filtros.codRequerimiento - Código del requerimiento (opcional)
 * @param {string} filtros.fechaInicio - Fecha inicio en formato yyyy-MM-dd (opcional)
 * @param {string} filtros.fechaFin - Fecha fin en formato yyyy-MM-dd (opcional)
 * @param {number} filtros.idUsuario - ID del usuario/cliente (opcional)
 * @param {number} filtros.idRequerimiento - ID del requerimiento (opcional)
 * @param {number} filtros.idEstadoRequerimiento - ID del estado (opcional)
 * @param {number} page - Número de página (default 0)
 * @param {number} size - Tamaño de página (default 10)
 * @returns {Promise<object>} Respuesta con content, totalElements, totalPages, etc.
 */
export async function FiltrarRequerimientos(
  filtros = {},
  token,
  page = 0,
  size = 10
) {
  try {
    // Construir query params
    const params = new URLSearchParams();

    // Agregar paginación
    params.append("page", page);
    params.append("size", size);

    // Agregar filtros opcionales (solo si tienen valor)
    if (filtros.idEmpresa) {
      params.append("idEmpresa", filtros.idEmpresa);
    }

    if (filtros.codRequerimiento && filtros.codRequerimiento.trim() !== "") {
      params.append("codRequerimiento", filtros.codRequerimiento.trim());
    }

    if (filtros.fechaInicio) {
      params.append("fechaInicio", filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params.append("fechaFin", filtros.fechaFin);
    }

    if (filtros.idUsuario) {
      params.append("idUsuario", filtros.idUsuario);
    }

    if (filtros.idRequerimiento) {
      params.append("idRequerimiento", filtros.idRequerimiento);
    }

    if (filtros.idEstadoRequerimiento) {
      params.append("idEstadoRequerimiento", filtros.idEstadoRequerimiento);
    }

    // DESPUÉS de idEstadoRequerimiento, AGREGAR:
    if (filtros.nombreConsultor && filtros.nombreConsultor.trim() !== "") {
      params.append("nombreConsultor", filtros.nombreConsultor.trim());
    }

    console.log("🔍 Filtros aplicados:", filtros);
    console.log("🔗 Query params:", params.toString());

    // Hacer petición al endpoint /search
    const response = await axios.get(
      `${API}/requerimientos/search?${params.toString()}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    console.log("✅ Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al filtrar requerimientos:", error);
    throw new Error(getErrorMessage(error));
  }
}
