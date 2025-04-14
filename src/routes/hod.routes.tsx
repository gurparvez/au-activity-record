import { HomeHOD, OutletHod } from '@/pages/hod';
import { Route, Routes } from 'react-router';

const HodRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletHod />}>
        <Route index element={<HomeHOD />} />

        <Route path="dashboard" element={<div>HOD Dashboard</div>} />
        <Route path="settings" element={<div>HOD Settings</div>} />
      </Route>
    </Routes>
  );
};

export default HodRoutes;
