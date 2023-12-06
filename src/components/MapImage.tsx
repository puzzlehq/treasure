import { useSearchParams } from 'react-router-dom';
import map_0 from '../assets/map/map_0.png';
import map_gif from '../assets/map/map_gif.gif';

const MapImage = () => {
  const [searchParams] = useSearchParams();

  const loading = searchParams.get('loading');

  return (
    <img
      src={loading === 'true' ? map_gif : map_0}
      alt='Treasure Map'
      className='fixed bottom-0 left-0 w-screen items-center justify-center object-contain'
      style={{
        transformOrigin: 'center bottom',
      }}
    />
  );
};

export default MapImage;
