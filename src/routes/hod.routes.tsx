import { Activity, HomeHOD, NewRecord, OutletHod } from '@/pages/hod';
import { Route, Routes } from 'react-router';

const HodRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletHod />}>
        <Route index element={<HomeHOD />} />

        <Route path="activity/:id" element={<Activity />} />
        <Route path="activity/:id/new" element={<NewRecord />} />
      </Route>
    </Routes>
  );
};

export default HodRoutes;
