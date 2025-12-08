import axios from "axios";
import { API } from "../../../constants/env";
import { getErrorMessage } from "../../../config/getErrorMessage";


export async function FiltrarPedidos(params, token) {
  try {
    const {
      order_creation_date,
      order_number,
      customer_name,
      sell_organization,
      customer_number,
      has_file,
      created_at,
    } = params;
    const queryParams = new URLSearchParams();

    if (order_creation_date) {
      queryParams.append("order_creation", order_creation_date);
    }
    if (order_number) {
      queryParams.append("order_number", order_number);
    }
    if (customer_name) {
      queryParams.append("customer_name", customer_name);
    }
    if (sell_organization) {
      queryParams.append("sell_organization", sell_organization);
    }
    if (customer_number) {
      queryParams.append("customer_number", customer_number);
    }
    if (created_at) {
      queryParams.append("created_at", created_at);
    }

    if (
      has_file !== undefined &&
      (has_file === true ||
        has_file === "true" ||
        has_file === false ||
        has_file === "false")
    ) {
      queryParams.append("has_file", has_file.toString());
    }

    const queryString = queryParams.toString();

    const API_URL = queryString
      ? `${basePath}/exportation-detail/?${queryString}`
      : `${base}/exportation-detail/`;

    const response = await axios.get(`${API}${API_URL}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data.result;
  } catch (error) {
    console.error("Error al obtener el filtro de datos: ", error);
    throw error;
  }
}
