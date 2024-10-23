import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert,ActivityIndicator,ScrollView} from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RNPickerSelect from 'react-native-picker-select';
import { collection, getDocs,setDoc,doc} from 'firebase/firestore';
import { storage,db } from '../../firebase-config';
import Markdown from 'react-native-markdown-display';

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

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false); 
  const cameraRef = useRef<CameraView | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);  // State to store patients list from Firebase
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);  // State for selected patient
  const [photo, setPhoto] = useState<any>(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null); // State to store the OCR result
  const [analysisResult, setAnalysisResult] = useState<string | null>(null); // State to store the OCR result

  useEffect(() => {
    // Fetch patients from Firebase on component mount
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientsList: any[] = [];
        querySnapshot.forEach((doc) => {
          patientsList.push({ id: doc.id, ...doc.data() });
        });
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: false,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleAnalyze = async () => {
    setAnalysisResult(null)
    try {
        setLoading(true)
        console.log('Ingredients:', ocrResult);
        console.log('Selected Patient:', selectedPatient);

        // Retrieve the selected patient's data
        const selectedPatientData = patients.find(patient => patient.id === selectedPatient);
        console.log('Selected Patient Data:', selectedPatientData);

        // Ensure selected patient data and OCR result are not empty
        if (!selectedPatientData || !ocrResult) {
            Alert.alert('Error', 'Patient data or OCR result is missing.');
            return;
        }

        // Prepare the data as a JSON object
        const data = {
            patient: selectedPatientData,
            ingredients: ocrResult
        };
        
        const response = await fetch('https://ocrimagetotext-nsf8.onrender.com/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to send request to the server');
        }

        const result = await response.json();
        console.log('Analysis Result:', result);
        setAnalysisResult(result.recommendation)
        setLoading(false)
        // Handle the result (e.g., displaying the recommendations)
    } catch (error) {
       setLoading(false)
        console.error('Error saving food analysis:', error);
        Alert.alert('Error', 'Failed to save the analysis.');
    } finally {
      setLoading(false)
      // setPhoto(null);
    }
};


  const retakePicture = () => {
    setPhoto(null);
    setOcrResult(null); // Clear the OCR result when retaking a picture
  };

  const uploadImageToFirebase = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

      const storageRef = ref(storage, `images/${filename}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setFirebaseImageUrl(url);
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  };

  const handleConfirmPhoto = async () => {
    try {
      if (photo?.uri) {
        setLoading(true);
        const imageUrl = await uploadImageToFirebase(photo.uri);
        console.log(imageUrl);
  
        if (imageUrl) {
          const response = await fetch('https://ocrimagetotext-nsf8.onrender.com/api/ocr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl,
            }),
          });
          console.log(response)
          const result = await response.json();
          setLoading(false);
  
          if (response.ok) {
            setOcrResult(result.join(' ')); // Set OCR result in state
          } else {
            Alert.alert('Error', 'Failed to process OCR');
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in handleConfirmPhoto:', error);
      Alert.alert('Error', 'An error occurred while processing the photo');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.box}>
        {!photo ? (
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.fixedRatio} facing={facing} />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPhoto}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {!photo && !ocrResult && (
        <TouchableOpacity style={styles.takePictureButton} onPress={handleTakePhoto}>
          <Text style={styles.takePictureButtonText}>Take Picture</Text>
        </TouchableOpacity>
      )}

      {}

      
      {loading ? ( 
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  
  
  ocrResult && (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Ingridents</Text>
        <Text style={styles.ocrText}>
          {ocrResult}
        </Text>
        
        <RNPickerSelect
              onValueChange={(value) => setSelectedPatient(value)}
              items={patients.map((patient) => ({
                label: patient.name,
                value: patient.id,
                key:patient.id
              }))}
              placeholder={{
                label: 'Select a Patient',
                value: null,
              }}
              style={pickerSelectStyles}
            />
            {/* Analyze Button */}
            <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
    </View>



  ) 
  
)}
{
  analysisResult ? (<View style={styles.analyzecontainer}>
    <Text style={styles.resultText}>Recommendations</Text>
    <Markdown style={styles}>
            {analysisResult}
          </Markdown>
      </View>) : null
}

  
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  box: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Elevation for Android shadow
  },
  cameraContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  retakeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  takePictureButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  takePictureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  ocrText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  analyzeButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzecontainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
};
