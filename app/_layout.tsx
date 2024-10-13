import React, { useState } from 'react';
import LoginScreen from './login-screen'; // Your login screen component
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { auth } from '../firebase-config';
// import { Buffer } from 'buffer';


// global.Buffer = global.Buffer || Buffer;
// global.process = require('process');

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to Firebase auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuthenticated(true); // User is logged in
    } else {
      setIsAuthenticated(false); // User is logged out
    }
  });

  const handleLogout = () => {
    signOut(auth); // Logs out the user
  };


  return (
    <>
      
      {!isAuthenticated ? (
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      ) : (
       <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack> 
      )}
    </>
  );
}
