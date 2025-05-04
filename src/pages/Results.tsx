import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, MapPin, Users, Calendar, DollarSign, Heart, ThumbsUp, Share2, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

// Mock results data - in a real app, this would come from the API
const mockResults = [
  {
    id: 1,
    rank: 1,
    name: 'Barcelona, Spain',
    image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg',
    description: 'A vibrant city with stunning architecture, beautiful beaches, and amazing food.',
    interests: ['Culture', 'Beach', 'Nightlife', 'Food'],
    price: '€€',
    matchScore: 92,
    votes: { likes: 5, dislikes: 1 }
  },
  {
    id: 5,
    rank: 2,
    name: 'Prague, Czech Republic',
    image: 'https://images.pexels.com/photos/125137/pexels-photo-125137.jpeg',
    description: 'Stunning architecture, rich history, affordable prices, and great beer.',
    interests: ['History', 'Culture', 'Nightlife'],
    price: '€',
    matchScore: 87,
    votes: { likes: 4, dislikes: 1 }
  },
  {
    id: 7,
    rank: 3,
    name: 'Lisbon, Portugal',
    image: 'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg',
    description: 'Charming streets, historic buildings, beautiful viewpoints, and delicious food.',
    interests: ['Culture', 'Food', 'History'],
    price: '€',
    matchScore: 85,
    votes: { likes: 4, dislikes: 2 }
  }
];

interface ResultItem {
  id: number;
  rank: number;
  name: string;
  image: string;
  description: string;
  interests: string[];
  price: string;
  matchScore: number;
  votes: { likes: number; dislikes: number };
}

const Results: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Load results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // In a real app, fetch from API
        // const response = await axios.get(`/api/group-trip/${groupCode}/results`);
        // const results = response.data;
        
        // For demo, use mock data
        setResults(mockResults);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [groupCode]);
  
  // Handle share
  const handleShare = () => {
    // Create share URL
    const shareUrl = `${window.location.origin}/results/${groupCode}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Our Group Trip Results!',
        text: `Check out the destinations we've voted for our group trip!`,
        url: shareUrl
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Results link copied to clipboard!');
    }
  };
  
  const goHome = () => {
    navigate('/');
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
          {isLoading ? (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-sky-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sky-gray-600">Loading results...</p>
            </div>
          ) : error ? (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-card p-8 text-center">
              <div className="text-sky-error mb-4">
                <Trophy size={40} />
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
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-sky-gray-800 mb-4">
                  Your Group Trip Results
                </h1>
                <p className="text-xl text-sky-gray-600 max-w-2xl mx-auto">
                  Based on everyone's preferences and votes, here are the top destinations for your group trip.
                </p>
              </motion.div>
              
              {/* Winner card */}
              {results.length > 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="max-w-4xl mx-auto bg-white rounded-lg shadow-card overflow-hidden mb-10"
                >
                  <div className="bg-sky-blue-500 text-white py-3 px-6 flex items-center">
                    <Trophy className="mr-2" size={24} />
                    <h2 className="text-xl font-bold">Top Destination Choice</h2>
                  </div>
                  
                  <div className="md:flex">
                    <div 
                      className="md:w-2/5 h-60 md:h-auto bg-cover bg-center"
                      style={{ backgroundImage: `url(${results[0].image})` }}
                    ></div>
                    
                    <div className="p-6 md:w-3/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-sky-gray-800 mb-1">
                            {results[0].name}
                          </h3>
                          <div className="flex items-center text-sky-gray-600">
                            <MapPin size={16} className="text-sky-blue-500 mr-1" />
                            <span>{results[0].price}</span>
                          </div>
                        </div>
                        
                        <div className="bg-sky-green-50 text-sky-green-500 font-bold text-xl h-14 w-14 rounded-full flex items-center justify-center">
                          {results[0].matchScore}%
                        </div>
                      </div>
                      
                      <p className="text-sky-gray-600 mb-4">
                        {results[0].description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {results[0].interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-sky-blue-50 text-sky-blue-600 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center text-sky-green-500 mr-4">
                          <ThumbsUp size={20} className="mr-1" />
                          <span className="font-bold">{results[0].votes.likes}</span>
                        </div>
                        <div className="text-sky-gray-500 text-sm">
                          {results[0].votes.likes} out of {results[0].votes.likes + results[0].votes.dislikes} people liked this destination
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Runner up results */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
              >
                {results.slice(1).map((result) => (
                  <div 
                    key={result.id}
                    className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                  >
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${result.image})` }}
                    ></div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-sky-gray-800 mb-1">
                            {result.name}
                          </h3>
                          <div className="flex items-center text-sky-gray-600 text-sm">
                            <MapPin size={14} className="text-sky-blue-500 mr-1" />
                            <span>{result.price}</span>
                          </div>
                        </div>
                        
                        <div className="text-sky-blue-500 font-bold text-lg h-10 w-10 rounded-full bg-sky-blue-50 flex items-center justify-center">
                          #{result.rank}
                        </div>
                      </div>
                      
                      <p className="text-sky-gray-600 text-sm mb-3 line-clamp-2">
                        {result.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.interests.slice(0, 3).map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-sky-blue-50 text-sky-blue-600 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {result.interests.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-sky-gray-100 text-sky-gray-600 rounded-full">
                            +{result.interests.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-sky-gray-600">
                          Match score: <span className="text-sky-green-500 font-bold">{result.matchScore}%</span>
                        </div>
                        <div className="flex items-center text-sky-green-500">
                          <ThumbsUp size={16} className="mr-1" />
                          <span className="font-bold">{result.votes.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
              
              {/* Actions */}
              <motion.div 
                variants={itemVariants}
                className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  variant="outline"
                  onClick={goHome}
                  icon={<Home size={20} />}
                  iconPosition="left"
                >
                  Back to Home
                </Button>
                <Button
                  variant="primary"
                  onClick={handleShare}
                  icon={<Share2 size={20} />}
                  iconPosition="left"
                >
                  Share Results
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;