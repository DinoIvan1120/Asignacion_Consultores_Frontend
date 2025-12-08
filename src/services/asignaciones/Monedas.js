import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

//Obtener todas las monedas
export async function FindAllNameMonedas(token) {
  try {
    const response = await axios.get(`${API}/monedas/descripcion`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}