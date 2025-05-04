import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { v4 as uuidv4 } from 'uuid';
import { useUserContext } from '../context/UserContext';

const JoinGroup: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  const { userId, setUserId } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [groupExists, setGroupExists] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real application, verify the group exists
    const verifyGroup = async () => {
      try {
        // Simulating API call to check if group exists
        // const response = await axios.get(`/api/group-trip/${groupCode}`);
        // setGroupExists(response.data.exists);
        
        // For demo purposes, we'll assume the group exists
        setGroupExists(true);
        
        // If user doesn't have an ID yet, generate one
        if (!userId) {
          setUserId(uuidv4());
        }
      } catch (err) {
        setError('Group not found or has expired');
        setGroupExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyGroup();
  }, [groupCode, userId, setUserId]);

  const handleJoin = () => {
    navigate(`/preferences/${groupCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-sky-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-md mx-auto bg-white rounded-lg shadow-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-sky-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sky-gray-600">Verifying group code...</p>
              </div>
            ) : groupExists ? (
              <div className="text-center">
                <div className="bg-sky-green-50 text-sky-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                  Join Group Trip
                </h2>
                <p className="text-sky-gray-600 mb-6">
                  You're about to join a group trip with code:
                </p>
                
                <div className="bg-sky-gray-50 px-6 py-3 rounded-md text-2xl font-bold text-sky-blue-500 tracking-widest inline-block mb-6">
                  {groupCode}
                </div>
                
                <p className="text-sky-gray-600 mb-6">
                  You'll be asked to share your travel preferences to help find the perfect destination for your group.
                </p>
                
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  onClick={handleJoin}
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                >
                  Continue to Preferences
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-sky-error bg-opacity-10 text-sky-error w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                  Group Not Found
                </h2>
                <p className="text-sky-gray-600 mb-6">
                  {error || "We couldn't find a group with that code. Please check the code and try again."}
                </p>
                
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  onClick={() => navigate('/group-trip')}
                >
                  Back to Group Trip
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JoinGroup;