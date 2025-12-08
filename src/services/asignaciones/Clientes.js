import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

// Obtener clientes activos con paginación
export async function FindAllClientesActivos(token, page = 0, size = 20) {
  try {
    const response = await axios.get(`${API}/user/clientes/activos/page`, {
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
export async function SearchClientesByNombre(
  token,
  nombre,
  page = 0,
  size = 20
) {
  try {
    const response = await axios.get(`${API}/user/clientes/search`, {
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
