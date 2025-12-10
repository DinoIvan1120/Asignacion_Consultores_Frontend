import { FindAllRequerimientosCoordinador } from "../../../services/asignaciones/Requerimientos";
import { FindAllAsignacionesCoordinador } from "../../../services/detalleasignaciones/listarasignaciones";

/**
 * 🧹 Proceso para limpiar todos los filtros y recargar datos originales
 */
export const handleClearFiltersRequerimientos = async ({
  accessToken,
  // Funciones para resetear inputs
  setOrderNumberFilter,
  setCodigoFilter,
  setStartDate,
  setEndDate,
  setClienteFilter,
  setIdCodigoFilter,
  setConsultorFilter,
  setEstadoFilter,
  // Funciones para actualizar requerimientos
  setRequerimientos,
  setRequerimientosPage,
  setRequerimientosHasMore,
  setTotalRequerimientos,
  setRequerimientosCargados,
  //setLoadingRequerimientos,
  setLoadingLimpiarFiltros,
}) => {
  try {
    // ============================================
    // LIMPIAR TODOS LOS INPUTS
    // ============================================
    setOrderNumberFilter("");
    setCodigoFilter("");
    setStartDate(null);
    setEndDate(null);
    setClienteFilter("");
    setIdCodigoFilter("");
    setConsultorFilter("");
    setEstadoFilter("");

    console.log("🧹 Filtros limpiados");

    // ============================================
    // RECARGAR DATOS ORIGINALES (SIN FILTROS)
    // ============================================
    //setLoadingRequerimientos(true);
    setLoadingLimpiarFiltros(true);

    const response = await FindAllAsignacionesCoordinador(accessToken, 0, 10);

    setRequerimientos(response.content);
    setRequerimientosPage(0);
    setRequerimientosHasMore(!response.last);
    setTotalRequerimientos(response.totalElements);
    setRequerimientosCargados(response.content.length);

    console.log("✅ Datos originales recargados:", response);
  } catch (error) {
    console.error("❌ Error al limpiar filtros:", error);
  } finally {
    //setLoadingRequerimientos(false);
    setLoadingLimpiarFiltros(false);
  }
};
