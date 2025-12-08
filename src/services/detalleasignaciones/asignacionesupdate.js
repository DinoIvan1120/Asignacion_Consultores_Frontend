// src/services/asignaciones/ActualizarAsignaciones.js
import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

/**
 * Obtener asignación completa (requerimiento + actividades)
 * @param {string} token - Token de autenticación
 * @param {number} idRequerimiento - ID del requerimiento
 * @returns {Promise} - Respuesta del servidor con requerimiento y actividades
 */
export async function GetAsignacionCompleta(token, idRequerimiento) {
  try {
    const response = await axios.get(`${API}/asignaciones/${idRequerimiento}`, {
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

/**
 * Actualizar asignación completa (requerimiento + actividades)
 * @param {string} token - Token de autenticación
 * @param {number} idRequerimiento - ID del requerimiento
 * @param {object} datosActualizacion - Datos a actualizar (requerimiento y/o actividades)
 * @returns {Promise} - Respuesta del servidor con la asignación actualizada
 */
export async function UpdateAsignacionCompleta(
  token,
  idRequerimiento,
  datosActualizacion
) {
  try {
    const response = await axios.put(
      `${API}/asignaciones/${idRequerimiento}`,
      datosActualizacion,
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
