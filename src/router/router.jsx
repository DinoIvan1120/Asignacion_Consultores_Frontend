import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Login } from "../public/login/Login";
import { LoginValidation } from "../public/login/LoginValidation";
import { Dashboard } from "../private/dashboard/Dashboard";
import { FeaturesDemo } from "../private/features/FeaturesDemo";
import { ExportationsPage } from "../private/features/exportaciones/ExportationsPage";
import { PedidosPage } from "../private/features/exportaciones/components/PedidosPage";
import { ActividadesPage } from "../private/features/exportaciones/components/ActividadesPage";
import { GestionUsuariosPage } from "../private/features/gestion-usuarios/GestionUsuariosPage";
import { MantenimientoPage } from "../private/features/gestion-usuarios/components/MantenimientoPage";
import { GestionRolesPage } from "../private/features/gestion-roles/GestionRolesPage";
import { RolesPage } from "../private/features/gestion-roles/components/RolesPage";
import { ReportesAsignacionesPage } from "../private/features/reportes/ReportesAsignacionesPage";
import { ReportesPage } from "../private/features/reportes/components/ReportesPage";
import { Register } from "../public/register/register";
import { GeneralPage } from "../private/features/exportaciones/components/Detalle/components/GeneralPage";
import { DetallePage } from "../private/features/exportaciones/components/Detalle/DetallePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/validar" element={<LoginValidation />} exact="true" />
        <Route path="/registrarse" element={<Register />} exact="true" />
        <Route path="/dashboard" element={<Dashboard />} exact="true" />
  
        <Route path="/features" element={<FeaturesDemo />}>
          <Route index element={<Outlet />} />

          <Route path="seguimiento" element={<ExportationsPage />}>
            {/* 👇 si no se especifica nada, redirige a tickets */}
            <Route index element={<PedidosPage />} />
            <Route path="tickets" element={<PedidosPage />} />
            <Route path="actividades" element={<ActividadesPage />} />
            
            <Route path="sgr" element={<DetallePage/>}>
              <Route index element={<Outlet/>}/>
              <Route path="general" element={<GeneralPage/>}/>

            </Route>
          
          </Route>

          <Route
            path="/features/gestion-usuarios"
            element={<GestionUsuariosPage />}
          >
            <Route index element={<MantenimientoPage />} />
            {/* <Route index element={<Outlet />} /> */}
            <Route path="mantenimiento" element={<MantenimientoPage />} />
          </Route>

          <Route path="/features/gestion-roles" element={<GestionRolesPage />}>
            <Route index element={<RolesPage />} />
            {/* <Route index element={<Outlet />} /> */}
            <Route path="roles" element={<RolesPage />} />
          </Route>

          <Route
            path="/features/reportes"
            element={<ReportesAsignacionesPage />}
          >
            <Route index element={<ReportesPage />} />
            <Route path="reportes" element={<ReportesPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
