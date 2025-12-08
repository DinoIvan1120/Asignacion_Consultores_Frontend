// src/services/asignaciones/ListarAsignaciones.js
import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";
/**
 * Obtener todas las asignaciones del coordinador con paginación
 * @param {string} token - Token de autenticación
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @param {string} sort - Ordenamiento (ej: "idRequerimiento,desc")
 * @returns {Promise} - Respuesta con Page<AsignacionResource>
 */
export async function FindAllAsignacionesCoordinador(
  token,
  page = 0,
  size = 10,
  sort = "idRequerimiento,desc"
) {
  try {
    const response = await axios.get(`${API}/asignaciones/page`, {
      params: {
        page,
        size,
        sort,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
