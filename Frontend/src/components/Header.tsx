import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Image, Scissors, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" />
          ConvertMaster
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/services" className="hover:text-blue-200">Services</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <button onClick={logout} className="hover:text-blue-200">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-200">Login</Link>
          )}
        </nav>
        <button className="md:hidden">
          <Menu />
        </button>
      </div>
      <div className="bg-blue-700 py-2">
        <div className="container mx-auto px-4 flex justify-center space-x-4">
          <Link to="/document-conversion" className="flex items-center text-sm hover:text-blue-200">
            <FileText className="mr-1" size={16} />
            Document
          </Link>
          <Link to="/image-conversion" className="flex items-center text-sm hover:text-blue-200">
            <Image className="mr-1" size={16} />
            Image
          </Link>
          <Link to="/background-removal" className="flex items-center text-sm hover:text-blue-200">
            <Scissors className="mr-1" size={16} />
            Remove BG
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;