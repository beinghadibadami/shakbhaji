
import React from 'react';
import { Leaf, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-1.5 transition-transform group-hover:scale-110 duration-300">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">VegVision</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/api" 
              className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <span>API Docs</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
