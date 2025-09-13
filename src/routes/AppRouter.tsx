import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import SolVacaciones from '../pages/SolVacaciones/SolVacaciones';
import Solicitudes from '../pages/Solicitudes/Solicitudes';
import Dashboard from '../pages/Dashboard/Dashboard';
import GestionSolicitudes from '../pages/GestionSolicitudes/GestionSolicitudes';
import SaldosVacaciones from '../pages/SaldosVacaciones/SaldosVacaciones';
import GestionUsuarios from '../pages/GestionUsuarios/GestionUsuarios';
import GestionRoles from '../pages/GestionRoles/GestionRoles';
import GestionPermisos from '../pages/GestionPermisos/GestionPermisos';
import LayoutRoute from './LayoutRoute';
import { PermissionGuard } from '../components/Common/PermissionGuard';
import { PERMISOS } from '../types/permissions'; 

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.DASHBOARD_MENU]}>
                <Dashboard />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/dashboard" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.DASHBOARD_MENU]}>
                <Dashboard />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/solicitar-vacaciones" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.SOLICITAR_VACACIONES_MENU]}>
                <SolVacaciones />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/solicitudes" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.MIS_SOLICITUDES_MENU]}>
                <Solicitudes />
              </PermissionGuard>
            </LayoutRoute>
          } />
          
          {/* Rutas de Reporte de Equipo */}
          <Route path="/reporte-equipo/gestion-solicitudes" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.GESTION_SOLICITUDES_MENU]}>
                <GestionSolicitudes />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/reporte-equipo/saldos-vacaciones" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.SALDOS_VACACIONES_MENU]}>
                <SaldosVacaciones />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/reporte-equipo/programacion-vacaciones" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.PROGRAMACION_VACACIONES_MENU]}>
                <Dashboard />
              </PermissionGuard>
            </LayoutRoute>
          } />
          
          {/* Rutas de Administración */}
          <Route path="/administracion/usuarios" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.ADMIN_USUARIOS_MENU]}>
                <GestionUsuarios />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/administracion/roles" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.ADMIN_ROLES_MENU]}>
                <GestionRoles />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/administracion/permisos" element={
            <LayoutRoute>
              <PermissionGuard permisos={[PERMISOS.ADMIN_PERMISOS_MENU]}>
                <GestionPermisos />
              </PermissionGuard>
            </LayoutRoute>
          } />
          <Route path="/administracion/departamentos" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          <Route path="/administracion/configuracion" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          
          {/* Rutas de Reportes */}
          <Route path="/reportes/vacaciones-usuario" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          <Route path="/reportes/estadisticas" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
