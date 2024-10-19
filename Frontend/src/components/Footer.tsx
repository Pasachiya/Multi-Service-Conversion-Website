import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ConvertMaster</h3>
            <p className="text-sm">Your one-stop solution for all file conversion needs.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-blue-300">Home</Link></li>
              <li><Link to="/services" className="text-sm hover:text-blue-300">Services</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-blue-300">Pricing</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-blue-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm hover:text-blue-300">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-blue-300">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-300"><Facebook size={20} /></a>
              <a href="#" className="text-white hover:text-blue-300"><Twitter size={20} /></a>
              <a href="#" className="text-white hover:text-blue-300"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          &copy; {new Date().getFullYear()} ConvertMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;