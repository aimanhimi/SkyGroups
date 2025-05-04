import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GlobeIcon, 
  MessageCircleIcon, 
  LockIcon, 
  InfoIcon, 
  HelpCircleIcon,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '#' },
        { label: 'Careers', url: '#' },
        { label: 'Press', url: '#' },
        { label: 'Partnerships', url: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', url: '#' },
        { label: 'Contact Us', url: '#' },
        { label: 'FAQs', url: '#' },
        { label: 'Feedback', url: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', url: '#' },
        { label: 'Privacy Policy', url: '#' },
        { label: 'Cookie Policy', url: '#' },
        { label: 'Security', url: '#' }
      ]
    }
  ];
  
  return (
    <footer className="bg-sky-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <GlobeIcon className="text-sky-blue-400" size={24} />
              <span className="text-xl font-bold">SkyGrouper</span>
            </Link>
            <p className="text-sky-gray-300 mb-4">
              Group travel made simple. Plan together, travel together.
            </p>
            <div className="flex space-x-4 text-sky-gray-300">
              <a href="#" className="hover:text-sky-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.url} 
                      className="text-sky-gray-300 hover:text-sky-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-sky-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sky-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SkyGrouper. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sky-gray-400 text-sm">
              <a href="#" className="hover:text-sky-blue-400 transition-colors flex items-center">
                <GlobeIcon size={16} className="mr-1" /> English (US)
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors flex items-center">
                <MessageCircleIcon size={16} className="mr-1" /> Feedback
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors flex items-center">
                <LockIcon size={16} className="mr-1" /> Privacy
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors flex items-center">
                <InfoIcon size={16} className="mr-1" /> Legal
              </a>
              <a href="#" className="hover:text-sky-blue-400 transition-colors flex items-center">
                <HelpCircleIcon size={16} className="mr-1" /> Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;