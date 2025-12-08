import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

//Obtener todos los tipos de actividad
export async function FindAllNameTipoActividad(token) {
  try {
    const response = await axios.get(`${API}/tipoactividad/descripcion`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}