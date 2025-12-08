import { useState } from "react";

export function PedidosState() {
  const [pedidos, setPedidos] = useState([]);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    icon: "",
  });
  const [isMigrarModalOpen, setIsMigrarModalOpen] = useState(false);
  const [isModalMigrarSap, setIsModalMigrarSap] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orderCreationDataFilter, setOrderCreationDataFilter] = useState("");
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [sellOrganizationFilter, setSellOrganizationFilter] = useState("");
  const [customerNumberFilter, setCutsomerNumberFilter] = useState("");
  const [has_fileFilter, sethas_fileFilter] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [modelDataButton, setModalDataButton] = useState({
    title: "",
    message: "",
    icon: "",
  });
  const [filtradopedidos, setFiltrarPedidos] = useState([]);

  return {
    pedidos,
    setPedidos,
    modalData,
    setModalData,
    isMigrarModalOpen,
    setIsMigrarModalOpen,
    isModalMigrarSap,
    setIsModalMigrarSap,
    isModalOpen,
    setIsModalOpen,
    showFilter,
    setShowFilter,
    isLoading,
    setIsLoading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    orderCreationDataFilter,
    setOrderCreationDataFilter,
    orderNumberFilter,
    setOrderNumberFilter,
    customerNameFilter,
    setCustomerNameFilter,
    sellOrganizationFilter,
    setSellOrganizationFilter,
    customerNumberFilter,
    setCutsomerNumberFilter,
    has_fileFilter,
    sethas_fileFilter,
    hasAppliedFilter,
    setHasAppliedFilter,
    modelDataButton,
    setModalDataButton,
    filtradopedidos,
    setFiltrarPedidos,
    loading,
    setLoading,
    showModal,
    setShowModal,
  };
}
