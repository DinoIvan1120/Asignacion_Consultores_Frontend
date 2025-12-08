import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

export async function LoginUser(email, password) {
  const body = { email: email, password: password };

  try {
    const response = await axios.post(`${API}/auth/login`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    }
  } catch (error) {
    console.log("Errorrrr: ", error);
    throw new Error(getErrorMessage(error));
  }
}
