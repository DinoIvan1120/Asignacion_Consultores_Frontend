import { fetchDataWithFilters } from "./FilrarPedidos";

export const handleApplyFilterClickPedidos = async ({
  accessToken,
  setFiltrarPedidos,
  startDate,
  endDate,
  orderNumberFilter,
  customerNameFilter,
  sellOrganizationFilter,
  customerNumberFilter,
  has_fileFilter,
  isDateRangeValid,
  setHasAppliedFilter,
  setModalDataButton,
  setLoading,
  setModalData,
  setShowModal,
}) => {
  setLoading(true);

  const hasFileValue = (has_fileFilter || "").trim().toLowerCase();
  const hasFile =
    hasFileValue === "si" ? true : hasFileValue === "no" ? false : undefined;

  if (
    !startDate &&
    !endDate &&
    !orderNumberFilter &&
    !customerNameFilter &&
    !sellOrganizationFilter &&
    !customerNumberFilter &&
    hasFile === undefined
  ) {
    setModalDataButton({
      title: "Error de filtrado",
      message: "Debes ingresar al menos un dato para filtrar.",
      icon: "times",
    });
    setLoading(false);
    return;
  }

  const numberOffilters = [
    orderNumberFilter,
    customerNameFilter,
    sellOrganizationFilter,
    customerNumberFilter,
    hasFile,
  ].filter(Boolean).length;

  if (numberOffilters > 1 && (!startDate || !endDate)) {
    setModalDataButton({
      title: "Error de fechas",
      message:
        "Debes ingresar un rango de fechas si estás utilizando más de un filtro.",
      icon: "times",
    });
    setLoading(false);
    return;
  }

  if (numberOffilters === 0 && (!startDate || !endDate)) {
    setModalDataButton({
      title: "Error de fechas",
      message: "Debes ingresar un rango de fechas",
      icon: "times",
    });
    setLoading(false);
  }

  if (!isDateRangeValid(startDate, endDate)) {
    setModalDataButton({
      title: "Error",
      message: "Solo puedes ingresar como máximo un rango de un año.",
      icon: "times",
    });
    setLoading(false);
    return;
  }

  try {
    await fetchDataWithFilters(
      accessToken,
      setFiltrarPedidos,
      startDate,
      endDate,
      orderNumberFilter,
      customerNameFilter,
      sellOrganizationFilter,
      customerNumberFilter,
      hasFile,
      setModalData,
      setShowModal,
    );
    setHasAppliedFilter(true);
  } catch (error) {
    console.error("Error de filtrado: ", error);
  } finally {
    setLoading(false);
  }
};
