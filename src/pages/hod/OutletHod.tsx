import Container from '@/components/ui/Container';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router';

const OutletHod = () => {
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

export default OutletHod;
