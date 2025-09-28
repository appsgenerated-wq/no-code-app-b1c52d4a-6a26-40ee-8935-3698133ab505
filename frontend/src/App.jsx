import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [potatoVarieties, setPotatoVarieties] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null); // Start with null to show loading
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest({ appId: config.APP_ID, baseURL: config.BACKEND_URL });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);
      
      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful. Checking auth status...');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
        } catch (error) {
          console.log('ℹ️ [APP] No active session found.');
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed. The app may not function correctly.');
        console.error('❌ [APP] Connection error:', connectionResult.error);
        setCurrentScreen('landing'); // Show landing page even if backend fails
      }
    };
    
    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setPotatoVarieties([]);
    setCurrentScreen('landing');
  };

  const loadPotatoVarieties = async () => {
    try {
      const response = await manifest.from('PotatoVariety').find({
        include: ['contributor'],
        sort: { createdAt: 'desc' }
      });
      setPotatoVarieties(response.data);
    } catch (error) {
      console.error('Failed to load potato varieties:', error);
    }
  };

  const createPotatoVariety = async (varietyData) => {
    try {
      const newVariety = await manifest.from('PotatoVariety').create(varietyData);
      // Refetch to get the newly created item with contributor info
      await loadPotatoVarieties();
    } catch (error) {
      console.error('Failed to create potato variety:', error);
      alert('Failed to create variety. Please try again.');
    }
  };

  const renderContent = () => {
    if (currentScreen === null) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    if (currentScreen === 'dashboard' && user) {
      return (
        <DashboardPage
          user={user}
          potatoVarieties={potatoVarieties}
          onLogout={handleLogout}
          onLoadVarieties={loadPotatoVarieties}
          onCreateVariety={createPotatoVariety}
        />
      );
    }

    return <LandingPage onLogin={handleLogin} />;
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-600">{backendConnected ? 'API Connected' : 'API Disconnected'}</span>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
