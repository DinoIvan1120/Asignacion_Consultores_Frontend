import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";

const basePath = "/api";

export async function listarPedidos(token) {
  try {
    const response = await axios.get(`${API}${basePath}/exportation-detail/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
