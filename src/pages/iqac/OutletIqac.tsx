import { Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Container from '@/components/ui/Container';

const OutletIqac = () => {
  return (
    <>
      <Navbar />
      <div className="pt-[80px]">
        <Container>
          <Outlet />
        </Container>
      </div>
    </>
  );
};

export default OutletIqac;
