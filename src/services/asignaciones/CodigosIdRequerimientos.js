import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

// Obtener consultores activos con paginación
export async function FindAllCodigosIdActivosCoordinador(
  token,
  page = 0,
  size = 10
) {
  try {
    const response = await axios.get(`${API}/requerimientos/codigoId/page`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page: page,
        size: size,
        sort: "idRequerimiento,desc", // Ordenar por nombres ascendente
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
