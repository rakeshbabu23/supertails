import React, {createContext, useState, useContext, useEffect} from 'react';
import {checkLocationPermission} from '../services/locationService';

const LocationContext = createContext(null);

export const LocationProvider = ({children}) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      setIsCheckingPermission(true);
      const hasPermission = await checkLocationPermission();
      setHasLocationPermission(hasPermission);
    } catch (error) {
      console.error('Error checking location permission:', error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const updateLocationPermission = async () => {
    await checkPermissionStatus();
  };

  return (
    <LocationContext.Provider
      value={{
        hasLocationPermission,
        isCheckingPermission,
        updateLocationPermission,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
