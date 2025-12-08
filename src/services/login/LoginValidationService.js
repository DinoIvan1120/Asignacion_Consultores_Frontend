import { API } from "../../constants/env";
import axios from "axios";
import { getErrorMessage } from "../../config/getErrorMessage";

//const basePath = "/api/user";

//Servicio para validar si el usuario esta registrado en la plataforma
export async function UserVerification(email) {
  try {
    const response = await axios.post(
      `${API}/auth/requestPasswordChange/${email}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

//Servicio para enviar codigo de cambio de contraseña al correo electrónico
export async function Forgotpassword(newPassword, token) {
  const body = { newPassword: newPassword, token: token };

  try {
    const response = await axios.post(`${API}/auth/changePassword/`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

//Servicio para confirmar codigo e ingresar la nueva contraseña
// export async function ConfirmVerificationCode(newcode, newPassword) {
//   const body = { code: newcode, password: newPassword };

//   try {
//     const response = await axios.post(`${API}/confirmforgotpassword/`, body, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return response.status;
//   } catch (error) {
//     throw new Error(getErrorMessage(error));
//   }
// }
