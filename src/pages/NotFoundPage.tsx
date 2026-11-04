import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Icons';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const NotFoundPage = () => {
  useDocumentTitle('Page not found');
  return (
    <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-14 w-14 text-espresso" />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="mt-3 text-5xl font-light">This flame went out</h1>
      <p className="mt-4 max-w-md text-bark/80">The page you are looking for has moved, been renamed or never existed.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          Back home
        </Link>
        <Link to="/shop" className="btn-outline">
          Shop candles
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
