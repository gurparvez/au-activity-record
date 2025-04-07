import { Outlet } from 'react-router';
import Navbar from './components/Navbar';

const OutletIqac = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default OutletIqac;
