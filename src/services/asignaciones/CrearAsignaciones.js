import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

/**
 * Crear un nuevo requerimiento
 * @param {string} token - Token de autenticación
 * @param {object} requerimientoData - Datos del requerimiento
 * @returns {Promise} - Respuesta del servidor con el requerimiento creado
 */
export async function CreateRequerimiento(token, requerimientoData) {
  try {
    const response = await axios.post(
      `${API}/requerimientos`,
      requerimientoData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Crear una actividad para un requerimiento específico
 * @param {string} token - Token de autenticación
 * @param {number} idRequerimiento - ID del requerimiento
 * @param {object} actividadData - Datos de la actividad
 * @returns {Promise} - Respuesta del servidor con la actividad creada
 */
export async function CreateActividadRequerimiento(
  token,
  idRequerimiento,
  actividadData
) {
  try {
    const response = await axios.post(
      `${API}/requerimientos/${idRequerimiento}/actividades`,
      actividadData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}