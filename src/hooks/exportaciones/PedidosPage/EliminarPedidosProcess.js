import { EliminarPedidos } from "../../../services/exportaciones/EliminarPedidos";
import { modalMessages } from "../../../config/modalMessages";

export async function EliminarPedidosProcess(
  accessToken,
  bulkl,
  setModalData,
  setShowModal,
  setHasAppliedFilter,
  setHasResults,
  setSelectedPedidoId,
  setIsConfirmationDeleteModalOpen,
  setSelectAll,
) {
  try {
    const result = await EliminarPedidos(accessToken, bulkl);
    if (result.status === 200) {
      setShowModal(true);
      setModalData(
        modalMessages.success({
          message: "La eliminación de realizo correctamente",
        }),
      );
    }
    setHasAppliedFilter(false);
    setHasResults(false);
    setSelectedPedidoId([]);
    setIsConfirmationDeleteModalOpen(false);
    setSelectAll(false);
  } catch (error) {
    setShowModal(true);
    setModalData(modalMessages.error({ message: error.message }));
  }
}
