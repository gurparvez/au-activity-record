import { AuthCheck, HomeHOD, Login, Register, VerifyEmail, UpdateVerification } from '@/pages';
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
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/update-verification" element={<UpdateVerification />} />

      <Route path="/team/hod" element={<HodRoutes />} />
      <Route path="/team/iqac" element={<IqacRoutes />} />
    </Routes>
  );
};

export default MyRoutes;
