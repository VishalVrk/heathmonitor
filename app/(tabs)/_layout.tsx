// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type LogoutScreenProps = {
  onLogout: () => void; // Define the type for the onLogin function
}

export default function TabLayout({ onLogout }:LogoutScreenProps) {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Patient Vitals',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patient-list"
        options={{
          title: 'Details',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="image-upload"
        options={{
          title: 'Food Analyizer',
          tabBarIcon: ({ color, size }) => <Ionicons name="camera" size={size} color={color} />,
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
