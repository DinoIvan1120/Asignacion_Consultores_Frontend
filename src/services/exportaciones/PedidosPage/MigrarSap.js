import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";

const basePath = "/api";

export async function MigrarSap(token, request_numbers, society_value) {
  const body = {
    request_numbers: request_numbers,
    society_value: society_value,
  };

  try {
    const response = await axios.post(
      `${API}${basePath}/exportation-job/`,
      body,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
