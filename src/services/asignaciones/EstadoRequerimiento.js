import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

//Nombres de empresas
export async function FindAllEstateRequerimient(token) {
  try {
    const response = await axios.get(`${API}/estados-requerimiento`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
