import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Clock, Check, RefreshCw, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useGroupTripContext } from '../context/GroupTripContext';

const WaitingRoom: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [completedUsers, setCompletedUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Fetch group status from backend
  const fetchGroupStatus = async () => {
    try {
      if (!groupCode) {
        setError('Invalid group code');
        return;
      }

      console.log(`Fetching status for group: ${groupCode}`); // Debug log
      const response = await axios.get(`http://localhost:5000/api/group-trip/${groupCode}/status`);
      console.log('Status response:', response.data); // Debug log

      const { completed, total, allCompleted } = response.data;

      setCompletedUsers(completed);
      setTotalUsers(total);
      setAllCompleted(allCompleted);

      // If all completed, start countdown 
      if (allCompleted && countdown > 0) {
        setCountdown(prev => prev - 1);
      }

    } catch (err: any) {
      console.error('Error fetching status:', err.response?.data || err); // Better error logging
      setError(err.response?.data?.error || 'Failed to get group status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Poll for status updates
  useEffect(() => {
    // Initial fetch
    fetchGroupStatus();
    
    // Set up polling interval
    const intervalId = setInterval(fetchGroupStatus, 2000);
    
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [groupCode]);

  // Handle countdown and navigation
  useEffect(() => {
    if (allCompleted) {
      if (countdown <= 0) {
        navigate(`/voting/${groupCode}`);
      }
    }
  }, [allCompleted, countdown, navigate, groupCode]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    fetchGroupStatus();
  };
  
  const handleShare = () => {
    // Create share URL
    const shareUrl = `${window.location.origin}/join/${groupCode}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Join my group trip!',
        text: `I've started planning a group trip. Join with code: ${groupCode}`,
        url: shareUrl
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-sky-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-md mx-auto bg-white rounded-lg shadow-card p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-sky-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sky-gray-600">Checking group status...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="text-sky-error mb-4">
                  <RefreshCw size={40} />
                </div>
                <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                  Oops, something went wrong
                </h2>
                <p className="text-sky-gray-600 mb-6">
                  {error}
                </p>
                <Button
                  variant="primary"
                  onClick={handleRefresh}
                  icon={<RefreshCw size={20} />}
                  iconPosition="left"
                >
                  Try Again
                </Button>
              </div>
            ) : allCompleted ? (
              <motion.div className="text-center" variants={containerVariants}>
                <motion.div 
                  className="bg-sky-green-50 text-sky-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={itemVariants}
                >
                  <Check size={32} />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-sky-gray-800 mb-2"
                  variants={itemVariants}
                >
                  Everyone's Ready!
                </motion.h2>
                <motion.p 
                  className="text-sky-gray-600 mb-8"
                  variants={itemVariants}
                >
                  All group members have completed their preferences. Redirecting to destination voting...
                </motion.p>
                <motion.div variants={itemVariants}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-sky-blue-50 text-sky-blue-500 text-2xl font-bold mx-auto">
                    {countdown}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className="text-center" variants={containerVariants}>
                <motion.div 
                  className="bg-sky-blue-50 text-sky-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={itemVariants}
                >
                  <Clock size={32} />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-sky-gray-800 mb-2"
                  variants={itemVariants}
                >
                  Waiting for Others
                </motion.h2>
                <motion.p 
                  className="text-sky-gray-600 mb-8"
                  variants={itemVariants}
                >
                  {completedUsers} of {totalUsers} group members have completed their preferences.
                </motion.p>
                
                <motion.div 
                  className="w-48 h-48 relative mx-auto mb-8"
                  variants={itemVariants}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0770e3"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * completedUsers) / totalUsers}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sky-blue-500">
                        {completedUsers}/{totalUsers}
                      </div>
                      <div className="text-sm text-sky-gray-500">completed</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="flex justify-center space-x-4" variants={itemVariants}>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    icon={<RefreshCw size={20} />}
                    iconPosition="left"
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleShare}
                    icon={<Share2 size={20} />}
                    iconPosition="left"
                  >
                    Invite Others
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="max-w-md mx-auto mt-8 text-center text-sky-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>
              Group Code: <span className="font-bold tracking-wide">{groupCode}</span>
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitingRoom;