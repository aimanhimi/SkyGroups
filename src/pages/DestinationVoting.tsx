import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Heart, X, MapPin, Calendar, Users, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

// Mock destination data
const mockDestinations = [
  {
    id: 1,
    name: 'Barcelona, Spain',
    image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg',
    description: 'A vibrant city with stunning architecture, beautiful beaches, and amazing food.',
    interests: ['Culture', 'Beach', 'Nightlife', 'Food'],
    price: '€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 2,
    name: 'Paris, France',
    image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    description: 'The city of love with iconic landmarks, world-class museums, and exquisite cuisine.',
    interests: ['Culture', 'History', 'Food'],
    price: '€€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 3,
    name: 'Rome, Italy',
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg',
    description: 'Explore ancient ruins, enjoy delicious Italian food, and experience the vibrant atmosphere.',
    interests: ['History', 'Culture', 'Food'],
    price: '€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 4,
    name: 'Amsterdam, Netherlands',
    image: 'https://images.pexels.com/photos/967292/pexels-photo-967292.jpeg',
    description: 'Picturesque canals, historic buildings, museums, and a laid-back atmosphere.',
    interests: ['Culture', 'Nightlife', 'History'],
    price: '€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 5,
    name: 'Prague, Czech Republic',
    image: 'https://images.pexels.com/photos/125137/pexels-photo-125137.jpeg',
    description: 'Stunning architecture, rich history, affordable prices, and great beer.',
    interests: ['History', 'Culture', 'Nightlife'],
    price: '€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 6,
    name: 'Berlin, Germany',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
    description: 'A city with a rich history, vibrant arts scene, and legendary nightlife.',
    interests: ['History', 'Nightlife', 'Culture'],
    price: '€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 7,
    name: 'Lisbon, Portugal',
    image: 'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg',
    description: 'Charming streets, historic buildings, beautiful viewpoints, and delicious food.',
    interests: ['Culture', 'Food', 'History'],
    price: '€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 8,
    name: 'Vienna, Austria',
    image: 'https://images.pexels.com/photos/2058911/pexels-photo-2058911.jpeg',
    description: 'Impressive imperial palaces, magnificent museums, and classical music heritage.',
    interests: ['Culture', 'History', 'Food'],
    price: '€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 9,
    name: 'London, UK',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    description: 'World-class museums, iconic landmarks, diverse food scene, and vibrant cultural life.',
    interests: ['Culture', 'History', 'Shopping'],
    price: '€€€',
    likes: 0,
    dislikes: 0
  },
  {
    id: 10,
    name: 'Budapest, Hungary',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
    description: 'Stunning architecture, thermal baths, vibrant nightlife, and affordable prices.',
    interests: ['History', 'Nightlife', 'Culture'],
    price: '€',
    likes: 0,
    dislikes: 0
  }
];

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  interests: string[];
  price: string;
  likes: number;
  dislikes: number;
}

const DestinationVoting: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left' | null>(null);
  const [votingComplete, setVotingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [remainingVotes, setRemainingVotes] = useState(0);
  
  // Load destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // In a real app, fetch from API
        // const response = await axios.get(`/api/group-trip/${groupCode}/suggestions`);
        // const destinations = response.data;
        
        // For demo, use mock data
        setDestinations(mockDestinations);
        setRemainingVotes(mockDestinations.length);
      } catch (err) {
        setError('Failed to load destinations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDestinations();
  }, [groupCode]);
  
  // Check if voting is complete
  useEffect(() => {
    if (currentIndex >= destinations.length && destinations.length > 0) {
      setVotingComplete(true);
      
      // In a real app, send voting results to the backend
      // const results = destinations.map(d => ({ id: d.id, likes: d.likes, dislikes: d.dislikes }));
      // axios.post(`/api/group-trip/${groupCode}/votes`, { results });
      
      // Navigate to results page after short delay
      const timer = setTimeout(() => {
        navigate(`/results/${groupCode}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, destinations, groupCode, navigate]);
  
  // Handle like/dislike
  const handleVote = (liked: boolean) => {
    if (currentIndex >= destinations.length) return;
    
    const newDestinations = [...destinations];
    if (liked) {
      newDestinations[currentIndex].likes += 1;
      setDirection('right');
    } else {
      newDestinations[currentIndex].dislikes += 1;
      setDirection('left');
    }
    
    setDestinations(newDestinations);
    setRemainingVotes(remainingVotes - 1);
    
    // Move to next destination after animation completes
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDirection(null);
    }, 300);
  };
  
  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleVote(false),
    onSwipedRight: () => handleVote(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  
  // Current destination
  const currentDestination = destinations[currentIndex];
  
  // Progress percentage
  const progressPercentage = destinations.length > 0 
    ? ((currentIndex) / destinations.length) * 100 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-sky-gray-50 py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-sky-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sky-gray-600">Loading destination suggestions...</p>
            </div>
          ) : error ? (
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-card p-8 text-center">
              <div className="text-sky-error mb-4">
                <X size={40} />
              </div>
              <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                Oops, something went wrong
              </h2>
              <p className="text-sky-gray-600 mb-6">
                {error}
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : votingComplete ? (
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-card p-8 text-center">
              <div className="bg-sky-green-50 text-sky-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp size={32} />
              </div>
              <h2 className="text-2xl font-bold text-sky-gray-800 mb-2">
                Voting Complete!
              </h2>
              <p className="text-sky-gray-600 mb-6">
                Thank you for your votes. We're tallying the results...
              </p>
              <div className="w-12 h-12 border-4 border-sky-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="max-w-lg mx-auto mb-6 text-center">
                <h1 className="text-2xl font-bold text-sky-gray-800 mb-2">Vote on Destinations</h1>
                <p className="text-sky-gray-600">
                  Swipe right if you like a destination, left if you don't.
                </p>
                <div className="mt-4 relative h-2 bg-sky-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-sky-blue-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-sky-gray-500">
                  {remainingVotes} destinations remaining
                </p>
              </div>
              
              {/* Card container */}
              <div className="relative max-w-md mx-auto h-[500px]" {...swipeHandlers}>
                <AnimatePresence mode="wait">
                  {currentDestination && (
                    <motion.div
                      key={currentDestination.id}
                      className="absolute inset-0"
                      initial={{ opacity: 1 }}
                      animate={{ 
                        x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
                        opacity: direction ? 0 : 1,
                        rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white rounded-lg shadow-card overflow-hidden h-full flex flex-col">
                        {/* Image */}
                        <div 
                          className="h-64 bg-cover bg-center"
                          style={{ backgroundImage: `url(${currentDestination.image})` }}
                        >
                          <div className="h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow p-4">
                          <h2 className="text-2xl font-bold text-sky-gray-800 mb-1">
                            {currentDestination.name}
                          </h2>
                          <div className="flex items-center mb-4">
                            <MapPin size={16} className="text-sky-blue-500 mr-1" />
                            <span className="text-sky-gray-600 text-sm">
                              {currentDestination.price} • Match score: 85%
                            </span>
                          </div>
                          
                          <p className="text-sky-gray-600 mb-4">
                            {currentDestination.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {currentDestination.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-sky-blue-50 text-sky-blue-600 rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="p-4 pt-0 flex justify-center space-x-8">
                          <button
                            onClick={() => handleVote(false)}
                            className="w-14 h-14 flex items-center justify-center bg-white border border-sky-gray-200 rounded-full text-sky-error hover:bg-sky-error hover:text-white hover:border-sky-error transition-colors"
                          >
                            <ThumbsDown size={24} />
                          </button>
                          <button
                            onClick={() => handleVote(true)}
                            className="w-14 h-14 flex items-center justify-center bg-white border border-sky-gray-200 rounded-full text-sky-green-500 hover:bg-sky-green-500 hover:text-white hover:border-sky-green-500 transition-colors"
                          >
                            <ThumbsUp size={24} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Instructions */}
              <div className="max-w-md mx-auto mt-6 bg-sky-blue-50 rounded-lg p-4 flex justify-between">
                <div className="flex items-center text-sky-gray-600">
                  <X size={20} className="mr-2 text-sky-error" />
                  <span>Swipe left to pass</span>
                </div>
                <div className="flex items-center text-sky-gray-600">
                  <Heart size={20} className="mr-2 text-sky-green-500" />
                  <span>Swipe right to like</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DestinationVoting;