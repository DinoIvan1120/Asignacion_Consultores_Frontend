import { listarPedidos } from "../../../services/exportaciones/PedidosPage/ListarPedidos";
import { modalMessages } from "../../../config/modalMessages";

export async function fetchDataWithoutFilters(
  accessToken,
  setPedidos,
  setModalData,
) {
  try {
    const response = await listarPedidos(accessToken);
    console.log("Resultados del servicio: ", response);
    setPedidos(response);
  } catch (error) {
    setModalData(modalMessages.error({ message: error.message }));
  }
}
