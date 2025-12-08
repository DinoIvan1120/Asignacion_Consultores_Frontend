// src/hooks/exportaciones/PedidosPage/DownloadExcelProcess.js
// import {
//   DownloadExcelCompleto,
//   DownloadExcelFiltrado,
// } from "../../../services/asignaciones/filtrarydescargarexcel";
import {
  DownloadExcelCompleto,
  DownloadExcelFiltrado,
} from "../../../services/detalleasignaciones/filtrarydescargarexcel";
import { format } from "date-fns";
import { modalMessages } from "../../../config/modalMessages";

/**
 * Handler para descargar Excel de asignaciones con detección automática de filtros
 * Si hay filtros aplicados → Descarga filtrada
 * Si NO hay filtros → Descarga completa
 */
export const handleDownloadExcelAsignaciones = async ({
  accessToken,
  // Valores de los filtros
  startDate,
  endDate,
  clienteFilter,
  consultorFilter,
  // Listas para conversión
  clientes,
  // Funciones de actualización
  setLoadingDownload,
  setModalData,
  setShowModal,
}) => {
  try {
    console.log("🔽 Iniciando proceso de descarga de Excel...");

    setLoadingDownload(true);

    // ============================================
    // 1️⃣ VERIFICAR SI HAY FILTROS APLICADOS
    // ============================================
    const hayFiltros = startDate || endDate || clienteFilter || consultorFilter;

    let blob;
    let fileName;

    if (!hayFiltros) {
      // ============================================
      // 2️⃣ DESCARGA COMPLETA (SIN FILTROS)
      // ============================================
      console.log("📊 No hay filtros aplicados → Descargando reporte completo");

      blob = await DownloadExcelCompleto(accessToken);

      // Generar nombre de archivo
      const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
      //   fileName = `Informe_Actividades_Completo_${timestamp}.xlsx`;
      fileName = `Reporte_Actividades_Completo.xlsx`;
    } else {
      // ============================================
      // 3️⃣ DESCARGA FILTRADA
      // ============================================
      console.log("📊 Filtros detectados → Descargando reporte filtrado");

      // Construir objeto de filtros
      const filtros = {};

      // A) Fechas (convertir a formato yyyy-MM-dd)
      if (startDate) {
        filtros.fechaInicio = format(startDate, "yyyy-MM-dd");
        console.log("📅 Fecha inicio:", filtros.fechaInicio);
      }
      if (endDate) {
        // 🔥 AGREGAR UN DÍA para incluir todo el día seleccionado
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
          console.log(
            `👤 Cliente: ${clienteFilter} → ID: ${filtros.idUsuario}`
          );
        } else {
          console.warn("⚠️ Cliente no encontrado en la lista:", clienteFilter);
        }
      }

      // C) Consultor (enviar nombre directamente)
      if (consultorFilter && consultorFilter.trim() !== "") {
        filtros.nombreConsultor = consultorFilter.trim();
        console.log("👨‍💼 Consultor:", filtros.nombreConsultor);
      }

      console.log("📦 Filtros para descarga:", filtros);

      // Llamar al servicio de descarga filtrada
      blob = await DownloadExcelFiltrado(filtros, accessToken);

      // Generar nombre de archivo descriptivo
      let nombreDescriptivo = "Informe_Actividades_Filtrado";
      //   if (startDate || endDate) nombreDescriptivo += "_Fechas";
      //   if (clienteFilter) nombreDescriptivo += "_Cliente";
      //   if (consultorFilter) nombreDescriptivo += "_Consultor";

      const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
      //   fileName = `${nombreDescriptivo}_${timestamp}.xlsx`;
      fileName = `Reporte_Actividades.xlsx`;
    }

    // ============================================
    // 4️⃣ DESCARGAR EL ARCHIVO
    // ============================================
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("✅ Archivo descargado:", fileName);

    // ============================================
    // 5️⃣ MOSTRAR FEEDBACK DE ÉXITO
    // ============================================
    setModalData(
      modalMessages.success({
        //message: `El archivo "${fileName}" ha sido descargado correctamente.`,
        message: `El reporte ha sido descargado correctamente.`,
      })
    );
    setShowModal(true);
  } catch (error) {
    console.error("❌ Error en el proceso de descarga:", error);

    // Mostrar modal de error
    setModalData(
      modalMessages.error({
        message:
          error.message ||
          "Error al descargar el archivo Excel. Intente nuevamente.",
      })
    );
    setShowModal(true);
  } finally {
    setLoadingDownload(false);
  }
};
