import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-cinzel text-6xl text-[#001233] mb-4">404</h1>
        <h2 className="font-cinzel text-2xl text-[#D4A373] mb-4">Page Not Found</h2>
        <p className="text-[#6C757D] mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-gold inline-flex items-center gap-2">
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
