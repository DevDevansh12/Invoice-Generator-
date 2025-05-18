import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button 
        className="mt-8"
        onClick={() => navigate('/')}
        icon={<Home size={18} />}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;