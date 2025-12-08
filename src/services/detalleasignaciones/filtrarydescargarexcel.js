// src/services/asignaciones/DownloadExcel.js
import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

/**
 * Descarga Excel con todas las asignaciones (sin filtros)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Blob>} - Archivo Excel como Blob
 */
export async function DownloadExcelCompleto(token) {
  try {
    console.log("📥 Iniciando descarga de Excel completo...");

    const response = await axios.get(`${API}/asignaciones/download/excel`, {
      headers: {
        Authorization: `${token}`,
      },
      responseType: "blob", // 🔥 IMPORTANTE: Recibir archivo binario
    });

    console.log("✅ Excel completo descargado");
    return response.data;
  } catch (error) {
    console.error("❌ Error al descargar Excel completo:", error);
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Descarga Excel con filtros aplicados
 * @param {Object} filtros - Objeto con los filtros a aplicar
 * @param {string} filtros.fechaInicio - Fecha de inicio en formato yyyy-MM-dd (opcional)
 * @param {string} filtros.fechaFin - Fecha de fin en formato yyyy-MM-dd (opcional)
 * @param {number} filtros.idUsuario - ID del cliente (opcional)
 * @param {string} filtros.nombreConsultor - Nombre del consultor (opcional)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Blob>} - Archivo Excel como Blob
 */
export async function DownloadExcelFiltrado(filtros, token) {
  try {
    // Construir parámetros dinámicos
    const params = {};

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

    console.log("📥 Iniciando descarga de Excel filtrado con params:", params);

    const response = await axios.get(
      `${API}/asignaciones/download/excel/filtered`,
      {
        params,
        headers: {
          Authorization: `${token}`,
        },
        responseType: "blob", // 🔥 IMPORTANTE: Recibir archivo binario
      }
    );

    console.log("✅ Excel filtrado descargado");
    return response.data;
  } catch (error) {
    console.error("❌ Error al descargar Excel filtrado:", error);
    throw new Error(getErrorMessage(error));
  }
}
