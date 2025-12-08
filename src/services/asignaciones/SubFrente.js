import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

//Obtener todos los subfrentes
export async function FindAllNameSubFrentes(token) {
  try {
    const response = await axios.get(`${API}/subfrentes/descripcion`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}