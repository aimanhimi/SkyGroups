import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map, Calendar, Search, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import TravelOptionTabs from '../components/TravelOptionTabs';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const goToGroupTrip = () => {
    navigate('/group-trip');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <Users className="text-sky-blue-500" size={36} />,
      title: 'Group Coordination',
      description: 'Easily plan trips with friends and family without the hassle of endless group chats.'
    },
    {
      icon: <Map className="text-sky-blue-500" size={36} />,
      title: 'Destination Matching',
      description: 'Find the perfect destination that matches everyone\'s preferences and budget.'
    },
    {
      icon: <Calendar className="text-sky-blue-500" size={36} />,
      title: 'Date Syncing',
      description: 'Coordinate available dates across your travel group to find the perfect time to travel together.'
    },
    {
      icon: <DollarSign className="text-sky-blue-500" size={36} />,
      title: 'Budget Alignment',
      description: 'Set individual budgets and find destinations that work for everyone\'s financial comfort zone.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-sky-blue-600 to-sky-blue-500 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" 
             style={{ backgroundImage: 'url(https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Plan Your Perfect Group Trip
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 opacity-90"
            >
              Coordinating travel with friends just got easier
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-4 md:p-6"
            >
              <TravelOptionTabs />
              
              <div className="relative">
                <div className="flex items-center bg-sky-gray-100 rounded-md overflow-hidden">
                  <div className="p-3 pl-4">
                    <Search size={20} className="text-sky-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Where to? Search destinations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-grow p-3 bg-transparent outline-none"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={goToGroupTrip}
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                    className="m-1"
                  >
                    Plan Group Trip
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-sky-gray-800 mb-4">Why Plan Group Travel with SkyGrouper?</h2>
            <p className="text-sky-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to coordinate travel preferences, find ideal destinations, and make group decisions.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-sky-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sky-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={goToGroupTrip}
              icon={<ArrowRight size={20} />}
              iconPosition="right"
            >
              Start Planning Your Group Trip
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-sky-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-sky-gray-800 mb-6">Simplify Group Travel Planning</h2>
            <div className="bg-white rounded-lg shadow-card p-8">
              <p className="text-lg text-sky-gray-600 italic mb-6">
                "Planning our annual friend trip used to take weeks of back-and-forth messages. With SkyGrouper, we found our perfect destination in one day!"
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-full flex items-center justify-center text-sky-blue-500 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4 text-left">
                  <p className="font-semibold text-sky-gray-800">Jane Doe</p>
                  <p className="text-sky-gray-500 text-sm">Group Trip to Barcelona</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-sky-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Plan Your Next Adventure Together?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Start a group trip now and invite your friends and family to join the planning process.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={goToGroupTrip}
              icon={<Users size={20} />}
              iconPosition="left"
            >
              Create Group Trip
            </Button>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;