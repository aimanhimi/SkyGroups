import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Building2, Car, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const TravelOptionTabs: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    { 
      id: 'flights', 
      label: 'Flights', 
      icon: <Plane size={20} />, 
      disabled: true 
    },
    { 
      id: 'hotels', 
      label: 'Hotels', 
      icon: <Building2 size={20} />, 
      disabled: true 
    },
    { 
      id: 'cars', 
      label: 'Car Rental', 
      icon: <Car size={20} />, 
      disabled: true 
    },
    { 
      id: 'group-trip', 
      label: 'Group Trip', 
      icon: <Users size={20} />, 
      to: '/group-trip',
      disabled: false,
      active: location.pathname === '/group-trip'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-card p-1 mb-6">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          tab.disabled ? (
            <div
              key={tab.id}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-md text-sky-gray-400 cursor-not-allowed opacity-70"
            >
              {tab.icon}
              <span className="mt-1 text-sm font-medium">{tab.label}</span>
            </div>
          ) : (
            <Link
              key={tab.id}
              to={tab.to || '#'}
              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-md transition-colors ${
                tab.active 
                  ? 'bg-sky-blue-50 text-sky-blue-500' 
                  : 'text-sky-gray-600 hover:bg-sky-blue-50 hover:text-sky-blue-500'
              }`}
            >
              {tab.icon}
              <span className="mt-1 text-sm font-medium">{tab.label}</span>
              {tab.active && (
                <motion.div
                  layoutId="activeTravelTab"
                  className="absolute inset-0 bg-sky-blue-50 rounded-md -z-10"
                  initial={false}
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default TravelOptionTabs;