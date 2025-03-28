import { Login } from '@/pages';
import { Route, Routes } from 'react-router';

const routes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default routes;
