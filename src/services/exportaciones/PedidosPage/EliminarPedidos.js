import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";

const basePath = "/api";

export async function EliminarPedidos(token, bulk) {
  try {
    const response = await axios.delete(
      `${API}${basePath}/exportation-detail/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        data: bulk,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
