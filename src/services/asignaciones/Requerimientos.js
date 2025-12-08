import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

// Obtener consultores activos con paginación
export async function FindAllRequerimientosCoordinador(
  token,
  page = 0,
  size = 10
) {
  try {
    const response = await axios.get(`${API}/requerimientos/page`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page: page,
        size: size,
        sort: "idRequerimiento,desc", // Ordenar por idRequerimientos descendentes
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
