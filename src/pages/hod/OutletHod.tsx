import Navbar from './components/Navbar';
import { Outlet } from 'react-router';

const OutletHod = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default OutletHod;
