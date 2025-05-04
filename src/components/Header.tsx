import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Building2, Car, Users, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { id: 'flights', label: 'Flights', icon: <Plane size={20} />, isActive: false },
    { id: 'hotels', label: 'Hotels', icon: <Building2 size={20} />, isActive: false },
    { id: 'cars', label: 'Car Rental', icon: <Car size={20} />, isActive: false },
    { 
      id: 'group-trip', 
      label: 'Group Trip', 
      icon: <Users size={20} />, 
      isActive: location.pathname === '/group-trip' || location.pathname.includes('/join') 
    },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="text-sky-blue-500" size={28} />
            <span className="text-xl font-bold text-sky-blue-500">SkyGrouper</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-sky-gray-500 hover:text-sky-blue-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.id}
                to={item.id === 'group-trip' ? '/group-trip' : '#'} 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors
                  ${item.isActive 
                    ? 'text-sky-blue-500 font-medium' 
                    : 'text-sky-gray-500 hover:text-sky-blue-500'
                  }
                  ${item.id !== 'group-trip' ? 'cursor-not-allowed opacity-70' : ''}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.isActive && (
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-blue-500"
                    layoutId="activeTab"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 space-y-2"
          >
            {navItems.map((item) => (
              <Link 
                key={item.id}
                to={item.id === 'group-trip' ? '/group-trip' : '#'} 
                className={`flex items-center space-x-2 p-3 rounded-md w-full transition-colors
                  ${item.isActive 
                    ? 'bg-sky-blue-50 text-sky-blue-500 font-medium' 
                    : 'text-sky-gray-500 hover:bg-sky-blue-50 hover:text-sky-blue-500'
                  }
                  ${item.id !== 'group-trip' ? 'cursor-not-allowed opacity-70' : ''}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;