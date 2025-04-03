import { AuthCheck, HomeHOD, Login, Register } from '@/pages';
import { Route, Routes } from 'react-router';
import HodRoutes from './hod.routes';
import IqacRoutes from './iqac.routes';

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/auth" element={<HomeHOD />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/team/hod" element={<HodRoutes />} />
      <Route path="/team/iqac" element={<IqacRoutes />} />
    </Routes>
  );
};

export default MyRoutes;
