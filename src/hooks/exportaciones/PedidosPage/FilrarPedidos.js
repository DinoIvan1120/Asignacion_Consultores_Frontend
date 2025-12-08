import { format } from "date-fns-tz";
import { FiltrarPedidos } from "../../../services/exportaciones/PedidosPage/FiltrarPedidos";
import { modalMessages } from "../../../config/modalMessages";

export async function fetchDataWithFilters(
  accessToken,
  setFiltrarPedidos,
  startDate,
  endDate,
  orderNumberFilter,
  customerNameFilter,
  sell_organizationFilter,
  customerNumberFilter,
  has_fileFilter,
  setModalData,
  setShowModal,
) {
  try {
    if (!accessToken) {
      setShowModal(true);
      setModalData(
        modalMessages.error({ message: "No cuenta con autenticación" }),
      );
      return;
    }

    const order_creation_date =
      startDate && endDate
        ? `${format(startDate, "yyyy-MM-dd")},${format(endDate, "yyyy-MM-dd")}`
        : "";
    // const created_at = formatteDate && formatteDate ? `${formatteDate},${formatteDate}`: '';

    const filtroParams = {
      order_creation_date,
      order_number: orderNumberFilter,
      customer_name: customerNameFilter,
      sell_organization: sell_organizationFilter,
      customer_number: customerNumberFilter,
      has_file: has_fileFilter,
      // created_at,
    };

    const filteredData = await FiltrarPedidos(filtroParams, accessToken);
    if (filteredData) {
      setFiltrarPedidos(filteredData);
      setShowModal(true);
      setModalData(
        modalMessages.success({
          message: "Filtro realizado satisfactoriamente",
        }),
      );
    }
  } catch (error) {
    setShowModal(true);
    setModalData(modalMessages.error({ message: error.message }));
  }
}
