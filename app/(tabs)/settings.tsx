import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config'; // Import your firebase configuration and auth

interface SettingsProps {
  onLogout: () => void; // Callback function to handle logout in the parent component
}

export default function Settings({ onLogout }: SettingsProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      onLogout(); // Notify the parent component that the user is logged out
    } catch (error) {
      Alert.alert('Logout Error', 'An error occurred during logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
