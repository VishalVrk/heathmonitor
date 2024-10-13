// PatientList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Your Firebase config
  apiKey: "AIzaSyABv_G5wc4IUYihLAKxFfTkxBeFlf25sSk",
  authDomain: "healthcare-mobileapp.firebaseapp.com",
  projectId: "healthcare-mobileapp",
  storageBucket: "healthcare-mobileapp.appspot.com",
  messagingSenderId: "534901278592",
  appId: "1:534901278592:web:402ab71be2d6a29c7fe365",
  measurementId: "G-GTK2XEJJWR"
};


// Define the type for the patient data
interface Patient {
    id: string;
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    sugarLevel: string;
    bloodPressure: string;
    allergies: string;
    medications: string;
    healthConditions: string;
  }

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]); // Explicitly type the state as an array of Patient

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientsList: Patient[] = [];
        querySnapshot.forEach((doc) => {
            patientsList.push({ id: doc.id, ...doc.data() } as Patient); // Type cast the data to Patient
          });
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients: ', error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient List</Text>
      {patients.length > 0 ? (
        patients.map((patient, index) => (
          <View key={index} style={styles.patientCard}>
            <Text>Name: {patient.name}</Text>
            <Text>Age: {patient.age}</Text>
            <Text>Gender: {patient.gender}</Text>
            <Text>Weight: {patient.weight}</Text>
            <Text>Height: {patient.height}</Text>
            <Text>Sugar Level: {patient.sugarLevel}</Text>
            <Text>Blood Pressure: {patient.bloodPressure}</Text>
            <Text>Allergies: {patient.allergies}</Text>
            <Text>Medications: {patient.medications}</Text>
            <Text>Health Conditions: {patient.healthConditions}</Text>
          </View>
        ))
      ) : (
        <Text>No patient data available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  patientCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
});
