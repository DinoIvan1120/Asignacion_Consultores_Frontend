import axios from "axios";
import { API } from "../../constants/env";
import { getErrorMessage } from "../../config/getErrorMessage";

//Nombres de empresas
export async function FindAllNameCompany(token) {
  try {
    const response = await axios.get(`${API}/empresas/nombrecomercial`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ✅ NUEVO SERVICIO: Obtener clientes por empresa
export async function FindClientesByEmpresa(token, idEmpresa) {
  try {
    const response = await axios.get(
      `${API}/user/clientes/empresa/${idEmpresa}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ✅ OPCIONAL: Obtener solo clientes activos por empresa
export async function FindClientesActivosByEmpresa(token, idEmpresa) {
  try {
    const response = await axios.get(
      `${API}/user/clientes/empresa/${idEmpresa}/activos`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

//Obtener la moneda correspondientea  a una empresa
export async function FindMonedaByEmpresa(token, idEmpresa) {
  try {
    const response = await axios.get(`${API}/empresas/${idEmpresa}/moneda`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

//Obtener el pais correspondiente a una empresa
export async function FindPaisByEmpresa(token, idEmpresa) {
  try {
    const response = await axios.get(`${API}/empresas/${idEmpresa}/pais`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
