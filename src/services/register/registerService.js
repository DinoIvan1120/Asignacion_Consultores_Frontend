import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

export async function RegisterUser(
  alias,
  birthdayDate,
  email,
  firstname,
  fullname,
  lastname,
  password
) {
  const body = {
    alias: alias,
    birthdayDate: birthdayDate,
    email: email,
    firstname: firstname,
    fullname: fullname,
    lastname: lastname,
    password: password,
  };

  try {
    const response = await axios.post(`${API}/citizen/saveCitizen`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log("Error de registro: ", error);
    throw new Error(getErrorMessage(error));
  }
}
