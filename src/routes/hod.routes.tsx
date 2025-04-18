import { Activity, HomeHOD, OutletHod } from '@/pages/hod';
import { Route, Routes } from 'react-router';

const HodRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletHod />}>
        <Route index element={<HomeHOD />} />

        <Route path="activity/:id" element={<Activity />} />
      </Route>
    </Routes>
  );
};

export default HodRoutes;
