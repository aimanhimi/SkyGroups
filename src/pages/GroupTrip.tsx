import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Clipboard, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUserContext } from '../context/UserContext';

const GroupTrip: React.FC = () => {
  const navigate = useNavigate();
  const { setUserId } = useUserContext();
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [groupCode, setGroupCode] = useState('');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const handleTabChange = (tab: 'join' | 'create') => {
    setActiveTab(tab);
    setError('');
  };

  const handleGroupCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupCode(e.target.value.toUpperCase());
    setError('');
  };

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setGroupSize(size);
  };

  const handleJoinGroup = async () => {
    if (!groupCode) {
      setError('Please enter a group code');
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, you would validate this code with your backend
      // await axios.get(`/api/group-trip/${groupCode}`);
      
      // Generate a user ID
      const userId = uuidv4();
      setUserId(userId);
      
      // Navigate to the preferences page
      navigate(`/preferences/${groupCode}`);
    } catch (err) {
      setError('Invalid group code or group not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (groupSize < 2) {
      setError('Group size must be at least 2 people');
      return;
    }

    setIsLoading(true);
    try {
      // Generate a random 6-character alphanumeric code
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create a new group in the backend
      await axios.post('http://localhost:5000/api/group-trip', {
        groupCode: generatedCode,
        numUsers: groupSize
      });
      
      // Set the new group code for display
      setNewGroupCode(generatedCode);
      
      // Generate a user ID
      const userId = uuidv4();
      setUserId(userId);
      
      // Reset the active tab to show the success state
      setActiveTab('join');
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(newGroupCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const startPlanning = () => {
    navigate(`/preferences/${newGroupCode}`);
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
            className="max-w-md mx-auto bg-white rounded-lg shadow-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {newGroupCode ? (
              <div className="text-center">
                <div className="bg-sky-green-50 text-sky-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                  Group Created!
                </h2>
                <p className="text-sky-gray-600 mb-6">
                  Share this code with your travel companions so they can join your trip planning.
                </p>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-sky-gray-50 px-6 py-3 rounded-md text-2xl font-bold text-sky-blue-500 tracking-widest">
                    {newGroupCode}
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="ml-2 p-2 rounded-md hover:bg-sky-gray-100 transition-colors"
                    aria-label="Copy code"
                  >
                    {codeCopied ? <Clipboard size={20} className="text-sky-green-500" /> : <Copy size={20} className="text-sky-gray-500" />}
                  </button>
                </div>
                
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  onClick={startPlanning}
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                >
                  Start Planning Your Trip
                </Button>
              </div>
            ) : (
              <>
                <div className="flex border-b border-sky-gray-200 mb-6">
                  <button
                    className={`flex-1 py-3 text-center font-medium ${
                      activeTab === 'join'
                        ? 'text-sky-blue-500 border-b-2 border-sky-blue-500'
                        : 'text-sky-gray-500 hover:text-sky-blue-400'
                    }`}
                    onClick={() => handleTabChange('join')}
                  >
                    Join a Trip
                  </button>
                  <button
                    className={`flex-1 py-3 text-center font-medium ${
                      activeTab === 'create'
                        ? 'text-sky-blue-500 border-b-2 border-sky-blue-500'
                        : 'text-sky-gray-500 hover:text-sky-blue-400'
                    }`}
                    onClick={() => handleTabChange('create')}
                  >
                    Create a Trip
                  </button>
                </div>
                
                {activeTab === 'join' ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-sky-gray-800 mb-4">
                        Join with a Code
                      </h2>
                      <p className="text-sky-gray-600 mb-6">
                        Enter the group code you received from your trip organizer.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mb-6">
                      <label htmlFor="groupCode" className="block text-sm font-medium text-sky-gray-700 mb-2">
                        Group Code
                      </label>
                      <input
                        type="text"
                        id="groupCode"
                        value={groupCode}
                        onChange={handleGroupCodeChange}
                        className="w-full px-4 py-3 border border-sky-gray-300 rounded-md focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent uppercase"
                        placeholder="Enter 6-character code"
                        maxLength={6}
                      />
                      {error && <p className="mt-2 text-sky-error text-sm">{error}</p>}
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleJoinGroup}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Joining...' : 'Join Group Trip'}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-sky-gray-800 mb-4">
                        Create a Group Trip
                      </h2>
                      <p className="text-sky-gray-600 mb-6">
                        Start planning your group adventure and invite your travel buddies.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mb-6">
                      <label htmlFor="groupSize" className="block text-sm font-medium text-sky-gray-700 mb-2">
                        How many people in your group?
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          id="groupSize"
                          min="2"
                          max="20"
                          value={groupSize}
                          onChange={handleGroupSizeChange}
                          className="w-full h-2 bg-sky-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-4 text-sky-gray-800 font-medium">
                          {groupSize}
                        </span>
                      </div>
                      {error && <p className="mt-2 text-sky-error text-sm">{error}</p>}
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleCreateGroup}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating...' : 'Create Group Trip'}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
          
          <motion.div 
            className="max-w-md mx-auto mt-8 text-center text-sky-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>
              By creating or joining a group trip, you agree to our{' '}
              <a href="#" className="text-sky-blue-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-sky-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupTrip;