import Activities from './Activities';
import Confirmation from '../../../components/Confirmation';

const HomeHOD = () => {
  return (
    <div>
      <Confirmation onSubmit={() => {console.log("Confirmation completed")}} />
      <Activities />
    </div>
  );
};

export default HomeHOD;
