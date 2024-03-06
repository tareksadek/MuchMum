import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkFirestoreConnectivity } from '../API/setup';

interface ConnectivityProviderProps {
  children: ReactNode;
}

const ConnectivityContext = createContext<{
  isOnline: boolean;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error("useConnectivity must be used within a ConnectivityProvider");
  }
  return context;
};

export const ConnectivityProvider: React.FC<ConnectivityProviderProps> = ({ children }) => {
  // Initialize state with a function to defer execution until after mounting
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // Define the event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Add event listeners after the component mounts
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Remove event listeners before the component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

