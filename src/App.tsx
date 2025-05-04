import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GroupTrip from './pages/GroupTrip';
import UserPreferences from './pages/UserPreferences';
import JoinGroup from './pages/JoinGroup';
import WaitingRoom from './pages/WaitingRoom';
import DestinationVoting from './pages/DestinationVoting';
import Results from './pages/Results';
import { UserProvider } from './context/UserContext';
import { GroupTripProvider } from './context/GroupTripContext';

function App() {
  return (
    <UserProvider>
      <GroupTripProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group-trip" element={<GroupTrip />} />
          <Route path="/join/:groupCode" element={<JoinGroup />} />
          <Route path="/preferences/:groupCode" element={<UserPreferences />} />
          <Route path="/waiting/:groupCode" element={<WaitingRoom />} />
          <Route path="/voting/:groupCode" element={<DestinationVoting />} />
          <Route path="/results/:groupCode" element={<Results />} />
        </Routes>
      </GroupTripProvider>
    </UserProvider>
  );
}

export default App;