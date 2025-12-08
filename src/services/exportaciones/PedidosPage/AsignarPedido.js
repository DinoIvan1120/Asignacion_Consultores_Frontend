import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";

const basePath = "/api";

export async function AsignarPedido(token, Actualizar) {
  try {
    const response = await axios.put(
      `${API}${basePath}/exportation-detail/`,
      Actualizar,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
