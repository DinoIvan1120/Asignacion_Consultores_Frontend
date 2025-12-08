import { FindAllAsignacionesCoordinador } from "../../../services/detalleasignaciones/listarasignaciones";

/**
 * Handler para limpiar todos los filtros y recargar asignaciones sin filtros
 */
export const handleClearFiltersAsignaciones = async ({
  accessToken,
  // Funciones para resetear filtros
  setStartDate,
  setEndDate,
  setClienteFilter,
  setConsultorFilter,
  // Funciones para actualizar asignaciones
  setAsignaciones,
  setAsignacionesPage,
  setAsignacionesHasMore,
  setTotalAsignaciones,
  setAsignacionesCargadas,
  setUltimaCargaCantidad,
  setLoadingLimpiarFiltros,
}) => {
  try {
    console.log("🧹 Limpiando filtros de asignaciones...");
    setLoadingLimpiarFiltros(true);

    // ============================================
    // 1️⃣ RESETEAR TODOS LOS FILTROS
    // ============================================
    setStartDate(null);
    setEndDate(null);
    setClienteFilter("");
    setConsultorFilter("");

    console.log("✅ Filtros limpiados");

    // ============================================
    // 2️⃣ RECARGAR ASIGNACIONES SIN FILTROS
    // ============================================
    const response = await FindAllAsignacionesCoordinador(accessToken, 0, 10);

    console.log("✅ Asignaciones recargadas sin filtros:", response);

    // ============================================
    // 3️⃣ ACTUALIZAR ESTADOS
    // ============================================
    setAsignaciones(response.content);
    setAsignacionesPage(0);
    setAsignacionesHasMore(!response.last);
    setTotalAsignaciones(response.totalElements);
    setAsignacionesCargadas(response.content.length);
    setUltimaCargaCantidad(response.content.length);

    console.log(
      `✅ Vista reseteada: ${response.content.length} asignaciones cargadas`
    );
  } catch (error) {
    console.error("❌ Error al limpiar filtros:", error);
    // No mostramos modal de error aquí, solo lo logueamos
    // porque es una operación de limpieza
  } finally {
    setLoadingLimpiarFiltros(false);
  }
};
