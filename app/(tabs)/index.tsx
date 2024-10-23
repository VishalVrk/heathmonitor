import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView,Alert, Keyboard, Text, Switch} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyABv_G5wc4IUYihLAKxFfTkxBeFlf25sSk",
  authDomain: "healthcare-mobileapp.firebaseapp.com",
  projectId: "healthcare-mobileapp",
  storageBucket: "healthcare-mobileapp.appspot.com",
  messagingSenderId: "534901278592",
  appId: "1:534901278592:web:402ab71be2d6a29c7fe365",
  measurementId: "G-GTK2XEJJWR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function PatientDataForm() {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    sugarLevel: '',
    bloodPressure: '',
    allergies: '',
    medications: '',
    healthConditions: '',
  });

  const validateForm = () => {
    const { name, age, gender, weight, height, sugarLevel, bloodPressure, allergies, medications, healthConditions } = patientData;
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addDoc(collection(db, 'patients'), patientData);
        Alert.alert('Success', 'Patient data submitted successfully!');
        // Reset form
        setPatientData({
          name: '',
          age: '',
          gender: '',
          weight: '',
          height: '',
          sugarLevel: '',
          bloodPressure: '',
          allergies: '',
          medications: '',
          healthConditions: '',
        });
      } catch (error) {
        console.error('Error adding document: ', error);
        Alert.alert('Error', 'An error occurred while submitting data.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888" // Adjust placeholder color here
        value={patientData.name}
        onChangeText={(text) => setPatientData({ ...patientData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#888" // Adjust placeholder color here
        value={patientData.age}
        onChangeText={(text) => setPatientData({ ...patientData, age: text })}
      />
         <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#888" // Adjust placeholder color here
        value={patientData.gender}
        onChangeText={(text) => setPatientData({ ...patientData, gender: text })}
      />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#888"
          value={patientData.weight}
          onChangeText={(text) => setPatientData({ ...patientData, weight: text.replace(/[^0-9]/g, '') })} // Restrict to numbers only
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          maxLength={2}
          />
       <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        placeholderTextColor="#888" // Adjust placeholder color here
        value={patientData.height}
        onChangeText={(text) => setPatientData({ ...patientData, height: text })}
        keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          maxLength={3}
      />
      <TextInput
        style={styles.input}
        placeholder="Sugar Level (mg/dL)"
        placeholderTextColor="#888" // Adjust placeholder color here
        value={patientData.sugarLevel}
        onChangeText={(text) => setPatientData({ ...patientData, sugarLevel: text })}
        keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          maxLength={3}
      />
     <View style={styles.switch}>
      <Text style={styles.label}>Allergies</Text>
        <Switch
         value={patientData.allergies === 'Yes'}
         onValueChange={(value) => setPatientData({ ...patientData, allergies: value ? 'Yes' : 'No' })}
            />
        </View>
        <View style={styles.switch}>
      <Text style={styles.label}>Medications</Text>
        <Switch
         value={patientData.medications === 'Yes'}
         onValueChange={(value) => setPatientData({ ...patientData, medications: value ? 'Yes' : 'No' })}
            />
        </View>
        <View style={styles.switch}>
      <Text style={styles.label}>Health Conditions</Text>
        <Switch
         value={patientData.healthConditions === 'Yes'}
         onValueChange={(value) => setPatientData({ ...patientData, healthConditions: value ? 'Yes' : 'No' })}
            />
        </View>
       <Button title="Submit" onPress={handleSubmit}/>
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
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // For Android shadow
  },
  switch:{
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});