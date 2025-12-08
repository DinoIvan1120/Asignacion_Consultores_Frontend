// src/hooks/exportaciones/ActividadesPage/FiltrarAsignacionesProcess.js
import { FiltrarAsignaciones } from "../../../services/detalleasignaciones/filtrarasignaciones";
import { format } from "date-fns";
import { modalMessages } from "../../../config/modalMessages";

/**
 * Handler para aplicar filtros en asignaciones
 * Convierte los valores de los inputs a los IDs necesarios y llama al servicio de filtrado
 */
export const handleApplyFilterClickAsignaciones = async ({
  accessToken,
  // Valores de los inputs
  startDate,
  endDate,
  clienteFilter,
  consultorFilter,
  // Listas completas para conversión
  clientes,
  // Funciones de actualización
  setAsignaciones,
  setAsignacionesPage,
  setAsignacionesHasMore,
  setTotalAsignaciones,
  setAsignacionesCargadas,
  setUltimaCargaCantidad,
  setLoading,
  setModalData,
  setShowModal,
}) => {
  try {
    console.log("🔍 Iniciando búsqueda de asignaciones con filtros...");

    // ============================================
    // 1️⃣ VALIDAR QUE HAYA AL MENOS UN FILTRO
    // ============================================
    const hayFiltros = startDate || endDate || clienteFilter || consultorFilter;

    if (!hayFiltros) {
      console.warn("⚠️ No se aplicó ningún filtro");
      setModalData(
        modalMessages.error({
          message:
            "Por favor, seleccione al menos un criterio de búsqueda antes de filtrar.",
        })
      );
      setShowModal(true);
      return;
    }

    setLoading(true);

    // ============================================
    // 2️⃣ CONSTRUIR OBJETO DE FILTROS
    // ============================================
    const filtros = {};

    // A) Fechas (convertir a formato yyyy-MM-dd)
    if (startDate) {
      filtros.fechaInicio = format(startDate, "yyyy-MM-dd");
      console.log("📅 Fecha inicio:", filtros.fechaInicio);
    }
    if (endDate) {
      // 🔥 AGREGAR UN DÍA para incluir todo el día seleccionado
      // Si el usuario selecciona 07/12/2025, buscaremos hasta el inicio del 08/12/2025
      // Esto incluye todos los registros del 07/12/2025 (00:00:00 - 23:59:59)
      const fechaFinAjustada = new Date(endDate);
      fechaFinAjustada.setDate(fechaFinAjustada.getDate() + 1);
      filtros.fechaFin = format(fechaFinAjustada, "yyyy-MM-dd");
      console.log("📅 Fecha fin (ajustada +1 día):", filtros.fechaFin);
    }

    // B) Cliente (convertir nombre a ID)
    if (clienteFilter && clienteFilter.trim() !== "") {
      const clienteEncontrado = clientes.find(
        (cliente) =>
          cliente.nombreCompleto.toLowerCase() === clienteFilter.toLowerCase()
      );

      if (clienteEncontrado) {
        filtros.idUsuario = clienteEncontrado.id;
        console.log(`👤 Cliente: ${clienteFilter} → ID: ${filtros.idUsuario}`);
      } else {
        console.warn("⚠️ Cliente no encontrado:", clienteFilter);
      }
    }

    // C) Consultor (enviar nombre directamente)
    if (consultorFilter && consultorFilter.trim() !== "") {
      filtros.nombreConsultor = consultorFilter.trim();
      console.log("👨‍💼 Consultor:", filtros.nombreConsultor);
    }

    console.log("📦 Filtros completos:", filtros);

    // ============================================
    // 3️⃣ LLAMAR AL SERVICIO DE FILTRADO
    // ============================================
    const response = await FiltrarAsignaciones(filtros, accessToken, 0, 10);

    console.log("✅ Asignaciones filtradas recibidas:", response);

    // ============================================
    // 4️⃣ ACTUALIZAR ESTADOS
    // ============================================
    setAsignaciones(response.content);
    setAsignacionesPage(0);
    setAsignacionesHasMore(!response.last);
    setTotalAsignaciones(response.totalElements);
    setAsignacionesCargadas(response.content.length);
    setUltimaCargaCantidad(response.content.length);

    // ============================================
    // 5️⃣ MOSTRAR FEEDBACK
    // ============================================
    if (response.content.length === 0) {
      setModalData(
        modalMessages.error({
          message:
            "No se encontraron asignaciones con los criterios seleccionados.",
        })
      );
      setShowModal(true);
    } else {
      console.log(
        `✅ Se encontraron ${response.totalElements} asignaciones filtradas`
      );
    }
  } catch (error) {
    console.error("❌ Error al filtrar asignaciones:", error);
    setModalData(
      modalMessages.error({
        message:
          error.message || "Error al aplicar filtros. Intente nuevamente.",
      })
    );
    setShowModal(true);

    // Limpiar resultados en caso de error
    setAsignaciones([]);
    setAsignacionesPage(0);
    setAsignacionesHasMore(false);
    setTotalAsignaciones(0);
    setAsignacionesCargadas(0);
    setUltimaCargaCantidad(0);
  } finally {
    setLoading(false);
  }
};
