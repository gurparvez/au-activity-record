import { AuthCheck, Login, Register, VerifyEmail, UpdateVerification, PrivateRoute } from '@/pages';
import { Route, Routes } from 'react-router';
import HodRoutes from './hod.routes';
import IqacRoutes from './iqac.routes';
import { DEPARTMENTS } from '@/constants';

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/update-verification" element={<UpdateVerification />} />

      <Route
        path="/team/hod/*" // Use wildcard to match all sub-routes
        element={<PrivateRoute element={HodRoutes} allowedDepartments={DEPARTMENTS} />}
      />
      <Route
        path="/team/iqac/*"
        element={<PrivateRoute element={IqacRoutes} allowedDepartments={['iqac']} />}
      />
    </Routes>
  );
};

export default MyRoutes;
