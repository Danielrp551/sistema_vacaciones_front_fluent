import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import SolVacaciones from '../pages/SolVacaciones/SolVacaciones';
import Solicitudes from '../pages/Solicitudes/Solicitudes';
import Dashboard from '../pages/Dashboard/Dashboard';
import GestionSolicitudes from '../pages/GestionSolicitudes/GestionSolicitudes';
import SaldosVacaciones from '../pages/SaldosVacaciones/SaldosVacaciones';
import GestionUsuarios from '../pages/GestionUsuarios/GestionUsuarios';
import LayoutRoute from './LayoutRoute'; 

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          <Route path="/dashboard" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          <Route path="/solicitar-vacaciones" element={<LayoutRoute><SolVacaciones /></LayoutRoute>} />
          <Route path="/solicitudes" element={<LayoutRoute><Solicitudes /></LayoutRoute>} />
          
          {/* Rutas de Reporte de Equipo */}
          <Route path="/reporte-equipo/gestion-solicitudes" element={<LayoutRoute><GestionSolicitudes /></LayoutRoute>} />
          <Route path="/reporte-equipo/saldos-vacaciones" element={<LayoutRoute><SaldosVacaciones /></LayoutRoute>} />
          <Route path="/reporte-equipo/programacion-vacaciones" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
          
          {/* Rutas de Administración */}
          <Route path="/administracion/usuarios" element={<LayoutRoute><GestionUsuarios /></LayoutRoute>} />
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
