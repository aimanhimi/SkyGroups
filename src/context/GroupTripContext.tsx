import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserPreferences {
  userId: string;
  from: string;
  destinationIdeas: string[];
  dates: {
    start: string | null;
    end: string | null;
  };
  interests: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  completed: boolean;
}

interface GroupTrip {
  groupCode: string;
  numUsers: number;
  users: UserPreferences[];
}

interface GroupTripContextType {
  groupTrips: Record<string, GroupTrip>;
  saveUserPreferences: (groupCode: string, preferences: UserPreferences) => void;
  getTripStatus: (groupCode: string) => { completed: number; total: number; allCompleted: boolean };
}

const GroupTripContext = createContext<GroupTripContextType | undefined>(undefined);

interface GroupTripProviderProps {
  children: ReactNode;
}

export const GroupTripProvider = ({ children }: GroupTripProviderProps) => {
  const [groupTrips, setGroupTrips] = useState<Record<string, GroupTrip>>({});

  const saveUserPreferences = (groupCode: string, preferences: UserPreferences) => {
    setGroupTrips(prev => {
      // Check if group exists
      if (!prev[groupCode]) {
        // Create new group
        return {
          ...prev,
          [groupCode]: {
            groupCode,
            numUsers: 3, // Default to 3 for demo
            users: [preferences]
          }
        };
      }

      // Group exists, check if user exists
      const existingUserIndex = prev[groupCode].users.findIndex(u => u.userId === preferences.userId);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedUsers = [...prev[groupCode].users];
        updatedUsers[existingUserIndex] = preferences;
        
        return {
          ...prev,
          [groupCode]: {
            ...prev[groupCode],
            users: updatedUsers
          }
        };
      } else {
        // Add new user
        return {
          ...prev,
          [groupCode]: {
            ...prev[groupCode],
            users: [...prev[groupCode].users, preferences]
          }
        };
      }
    });
  };

  const getTripStatus = (groupCode: string) => {
    if (!groupTrips[groupCode]) {
      return { completed: 0, total: 0, allCompleted: false };
    }

    const trip = groupTrips[groupCode];
    const completedUsers = trip.users.filter(u => u.completed).length;
    
    return {
      completed: completedUsers,
      total: trip.numUsers,
      allCompleted: completedUsers === trip.numUsers
    };
  };

  return (
    <GroupTripContext.Provider value={{ groupTrips, saveUserPreferences, getTripStatus }}>
      {children}
    </GroupTripContext.Provider>
  );
};

export const useGroupTripContext = (): GroupTripContextType => {
  const context = useContext(GroupTripContext);
  if (context === undefined) {
    throw new Error('useGroupTripContext must be used within a GroupTripProvider');
  }
  return context;
};