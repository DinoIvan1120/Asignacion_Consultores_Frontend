import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

// Obtener consultores activos con paginación
export async function FindAllConsultoresActivos(token, page = 0, size = 20) {
  try {
    const response = await axios.get(`${API}/user/consultores/activos/page`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page: page,
        size: size,
        sort: "nombres,asc", // Ordenar por nombres ascendente
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// 🔥 NUEVO: Buscar clientes por nombre
export async function SearchConsultoresByNombre(
  token,
  nombre,
  page = 0,
  size = 20
) {
  try {
    const response = await axios.get(`${API}/user/consultores/search`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        nombre: nombre,
        page: page,
        size: size,
        sort: "nombres,asc",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
