import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Globe, Calendar, Tag, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SearchBox from '../components/SearchBox';
import { useUserContext } from '../context/UserContext';
import { useGroupTripContext } from '../context/GroupTripContext';
import axios from 'axios';

// Mock data for destinations and interests
const popularDestinations = [
  'Paris', 'Barcelona', 'Rome', 'London', 'Tokyo', 'New York', 
  'Bangkok', 'Dubai', 'Singapore', 'Amsterdam', 'Prague', 'Berlin'
];

const interestOptions = [
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'live-events', label: 'Live Events', icon: '🎭' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'party', label: 'Party', icon: '🎉' },
  { id: 'food', label: 'Food', icon: '🍲' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'history', label: 'History', icon: '🏺' }
];

// Step interface for type safety
interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const UserPreferences: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  const { userId } = useUserContext();
  const { saveUserPreferences } = useGroupTripContext();
  
  // Steps for the multi-step form
  const steps: Step[] = [
    { id: 'origin', title: 'Where are you from?', icon: <Home size={20} /> },
    { id: 'destinations', title: 'Where would you like to go?', icon: <Globe size={20} /> },
    { id: 'dates', title: 'When do you want to travel?', icon: <Calendar size={20} /> },
    { id: 'interests', title: 'What are you looking for?', icon: <Tag size={20} /> },
    { id: 'budget', title: 'What\'s your budget?', icon: <DollarSign size={20} /> }
  ];
  
  // State for current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  
  // Form state
  const [origin, setOrigin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(500);
  const [currency, setCurrency] = useState<string>('EUR');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtered destinations based on search query
  const filteredDestinations = popularDestinations.filter(
    dest => dest.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handler functions
  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddDestination = (destination: string) => {
    if (!selectedDestinations.includes(destination)) {
      setSelectedDestinations([...selectedDestinations, destination]);
      setSearchQuery('');
    }
  };
  
  const handleRemoveDestination = (destination: string) => {
    setSelectedDestinations(selectedDestinations.filter(d => d !== destination));
  };
  
  const handleInterestToggle = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(parseInt(e.target.value));
  };
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const submitPreferences = async () => {
    if (!userId || !groupCode) {
      setError('Missing user ID or group code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare user preferences data
      const userPreferences = {
        userId,
        from: origin,
        destinationIdeas: selectedDestinations,
        dates: {
          start: startDate ? startDate.toISOString().split('T')[0] : null,
          end: endDate ? endDate.toISOString().split('T')[0] : null,
        },
        interests: selectedInterests,
        budget: {
          min: 0,
          max: budget,
          currency: currency
        },
        completed: true
      };
      
      // Save to backend
      await axios.post(`http://localhost:5000/api/group-trip/${groupCode}/preferences`, userPreferences);
      
      // Save to context (for front-end state)
      saveUserPreferences(groupCode, userPreferences);
      
      // Navigate to waiting room
      navigate(`/waiting/${groupCode}`);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    setError('');
    
    switch (currentStep.id) {
      case 'origin':
        if (!origin.trim()) {
          setError('Please enter your location');
          return false;
        }
        break;
      case 'destinations':
        if (selectedDestinations.length === 0) {
          setError('Please select at least one destination');
          return false;
        }
        break;
      case 'dates':
        if (!startDate || !endDate) {
          setError('Please select both start and end dates');
          return false;
        }
        if (startDate > endDate) {
          setError('End date must be after start date');
          return false;
        }
        break;
      case 'interests':
        if (selectedInterests.length === 0) {
          setError('Please select at least one interest');
          return false;
        }
        break;
    }
    
    return true;
  };
  
  const handleContinue = () => {
    if (validateCurrentStep()) {
      if (currentStepIndex === steps.length - 1) {
        submitPreferences();
      } else {
        goToNextStep();
      }
    }
  };
  
  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Direction of animation
  const [direction, setDirection] = useState(0);

  // Update direction when changing steps
  const navigateToStep = (index: number) => {
    setDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-sky-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => navigateToStep(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index < currentStepIndex
                        ? 'bg-sky-green-500 text-white'
                        : index === currentStepIndex
                        ? 'bg-sky-blue-500 text-white'
                        : 'bg-sky-gray-200 text-sky-gray-500'
                    }`}
                    disabled={index > currentStepIndex}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.icon
                    )}
                  </button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 h-1 bg-sky-gray-200 w-full rounded-full"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-sky-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Form content */}
            <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-6">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <h2 className="text-2xl font-bold text-sky-gray-800 mb-6 flex items-center">
                    {currentStep.icon && <span className="mr-2">{currentStep.icon}</span>}
                    {currentStep.title}
                  </h2>
                  
                  {/* Different content for each step */}
                  {currentStep.id === 'origin' && (
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-sky-gray-700 mb-2">
                        Your location
                      </label>
                      <input
                        type="text"
                        id="origin"
                        value={origin}
                        onChange={handleOriginChange}
                        placeholder="Enter your city"
                        className="w-full px-4 py-3 border border-sky-gray-300 rounded-md focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent"
                      />
                      <p className="mt-2 text-sky-gray-500 text-sm">
                        This helps us find suitable destinations with good connections from your location.
                      </p>
                    </div>
                  )}
                  
                  {currentStep.id === 'destinations' && (
                    <div>
                      <label className="block text-sm font-medium text-sky-gray-700 mb-2">
                        Search and select destinations you're interested in
                      </label>
                      <SearchBox
                        placeholder="Search destinations..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onSearch={() => {}}
                        buttonText="Add"
                        className="mb-4"
                      />
                      
                      {searchQuery && (
                        <div className="mb-4 max-h-40 overflow-y-auto bg-white border border-sky-gray-200 rounded-md shadow-sm">
                          {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((destination) => (
                              <button
                                key={destination}
                                className="w-full text-left px-4 py-2 hover:bg-sky-blue-50 transition-colors"
                                onClick={() => handleAddDestination(destination)}
                              >
                                {destination}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sky-gray-500">
                              No destinations found
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h3 className="text-sky-gray-700 font-medium mb-2">Selected Destinations:</h3>
                        {selectedDestinations.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedDestinations.map((destination) => (
                              <div 
                                key={destination} 
                                className="bg-sky-blue-50 text-sky-blue-600 px-3 py-1.5 rounded-full flex items-center"
                              >
                                <span>{destination}</span>
                                <button
                                  onClick={() => handleRemoveDestination(destination)}
                                  className="ml-2 text-sky-blue-400 hover:text-sky-blue-600"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sky-gray-500">No destinations selected yet</p>
                        )}
                      </div>
                      
                      <h3 className="text-sky-gray-700 font-medium mb-2">Popular Destinations:</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularDestinations.slice(0, 8).map((destination) => (
                          <button
                            key={destination}
                            onClick={() => handleAddDestination(destination)}
                            className={`px-3 py-1.5 rounded-full transition-colors ${
                              selectedDestinations.includes(destination)
                                ? 'bg-sky-blue-500 text-white'
                                : 'bg-sky-gray-100 text-sky-gray-700 hover:bg-sky-gray-200'
                            }`}
                          >
                            {destination}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentStep.id === 'dates' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-sky-gray-700 mb-2">
                            Start Date
                          </label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            minDate={new Date()}
                            className="w-full px-4 py-3 border border-sky-gray-300 rounded-md focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent"
                            placeholderText="Select start date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sky-gray-700 mb-2">
                            End Date
                          </label>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="w-full px-4 py-3 border border-sky-gray-300 rounded-md focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent"
                            placeholderText="Select end date"
                          />
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sky-gray-500 text-sm">
                        We'll match these dates with your group to find the best time for everyone.
                      </p>
                    </div>
                  )}
                  
                  {currentStep.id === 'interests' && (
                    <div>
                      <p className="text-sky-gray-600 mb-4">
                        Select the activities and experiences you're interested in for this trip.
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest.id}
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                              selectedInterests.includes(interest.id)
                                ? 'bg-sky-blue-50 border-2 border-sky-blue-500 text-sky-blue-700'
                                : 'bg-white border border-sky-gray-200 text-sky-gray-700 hover:bg-sky-gray-50'
                            }`}
                          >
                            <span className="text-2xl mb-2">{interest.icon}</span>
                            <span className="text-sm font-medium">{interest.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentStep.id === 'budget' && (
                    <div>
                      <p className="text-sky-gray-600 mb-6">
                        What's your maximum budget for this trip per person?
                      </p>
                      
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="budget" className="text-sm font-medium text-sky-gray-700">
                            Budget per person
                          </label>
                          <div className="flex items-center">
                            <select
                              value={currency}
                              onChange={handleCurrencyChange}
                              className="mr-2 border border-sky-gray-300 rounded-md"
                            >
                              <option value="EUR">€</option>
                              <option value="USD">$</option>
                              <option value="GBP">£</option>
                            </select>
                            <span className="text-sky-blue-600 font-bold text-xl">
                              {budget}
                            </span>
                          </div>
                        </div>
                        
                        <input
                          type="range"
                          id="budget"
                          min="100"
                          max="5000"
                          step="50"
                          value={budget}
                          onChange={handleBudgetChange}
                          className="w-full h-2 bg-sky-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        
                        <div className="flex justify-between text-xs text-sky-gray-500 mt-1">
                          <span>Budget (100)</span>
                          <span>Luxury (5000)</span>
                        </div>
                      </div>
                      
                      <p className="text-sky-gray-500 text-sm">
                        We'll use this to suggest destinations and accommodations that fit your budget.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {error && (
                <div className="mt-4 p-3 bg-sky-error bg-opacity-10 text-sky-error text-sm rounded-md">
                  {error}
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0 || isLoading}
                icon={<ArrowLeft size={20} />}
                iconPosition="left"
              >
                Back
              </Button>
              
              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={isLoading}
                icon={<ArrowRight size={20} />}
                iconPosition="right"
              >
                {isLoading 
                  ? 'Saving...' 
                  : currentStepIndex === steps.length - 1 
                    ? 'Complete' 
                    : 'Continue'
                }
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserPreferences;
