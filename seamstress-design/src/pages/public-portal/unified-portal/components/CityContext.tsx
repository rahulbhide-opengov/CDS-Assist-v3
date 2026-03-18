/**
 * City Context
 * Manages city selection and city-specific accounts/services
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { City } from './CitySwitcher';
import { defaultCities } from './CitySwitcher';

interface CityContextType {
  currentCity: City;
  setCurrentCity: (city: City) => void;
  availableServices: string[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

interface CityProviderProps {
  children: ReactNode;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children }) => {
  // Get initial city - always default to Cloud City on initial page load
  const getInitialCity = (): City => {
    // Check if this is the initial page load (not a city switch during session)
    const isInitialLoad = !sessionStorage.getItem('cityContextInitialized');

    if (isInitialLoad) {
      // Mark that we've initialized for this session
      sessionStorage.setItem('cityContextInitialized', 'true');
      // Always start with Cloud City on fresh page load
      return defaultCities[0]; // Cloud City
    }

    // After initial load, respect saved preferences
    const savedCityId = localStorage.getItem('selectedCityId');
    if (savedCityId) {
      const city = defaultCities.find(c => c.id === savedCityId);
      if (city) return city;
    }
    return defaultCities[0]; // Cloud City
  };

  const [currentCity, setCurrentCityState] = useState<City>(getInitialCity);

  // Get available services based on current city
  const getAvailableServices = (cityId: string): string[] => {
    if (cityId === 'riverside-city') {
      // Riverside only has taxes and utilities
      return ['taxes', 'utilities'];
    }
    // All other cities have all services
    return ['utilities', 'taxes', 'permits', 'parks', 'grants'];
  };

  const availableServices = getAvailableServices(currentCity.id);

  // Persist city selection to localStorage
  const setCurrentCity = (city: City) => {
    setCurrentCityState(city);
    localStorage.setItem('selectedCityId', city.id);
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCityId' && e.newValue) {
        const city = defaultCities.find(c => c.id === e.newValue);
        if (city) {
          setCurrentCityState(city);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CityContext.Provider value={{ currentCity, setCurrentCity, availableServices }}>
      {children}
    </CityContext.Provider>
  );
};
