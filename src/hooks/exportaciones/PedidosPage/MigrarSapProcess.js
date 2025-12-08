import { modalMessages } from "../../../config/modalMessages";
import { MigrarSap } from "../../../services/exportaciones/PedidosPage/MigrarSap";

export async function MigrarSapProcess(
  accessToken,
  request_numbers,
  society_Value,
  setModalData,
  setIsMigrarModalOpen,
  setIsModalMigrarSap,
  fetchDataWithoutFilters,
  setPedidos
) {
  try {
    const result = await MigrarSap(accessToken, request_numbers, society_Value);
    if (result.status === 200) {
      setModalData(
        modalMessages.success({
          message: "La migración se realizó exitosamente",
        })
      );
    }

    setIsMigrarModalOpen(false);
    setIsModalMigrarSap(true);
    fetchDataWithoutFilters(accessToken, setPedidos, setModalData);
  } catch (error) {
    setIsMigrarModalOpen(false);
    setIsModalMigrarSap(true);
    setModalData(modalMessages.error({ message: error.message }));
  }
}
