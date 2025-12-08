import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";

const basePath = "/api";

export async function crearFicha(token, fichaData) {
  try {
    const response = await axios.post(
      `${API}${basePath}/exportation-detail/`,
      fichaData,
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
