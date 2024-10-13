import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View ,Image,Alert} from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase-config'; 

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null); 
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState<string | null>(null);

  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

      const storageRef = ref(storage, `images/${filename}`);
      await uploadBytes(storageRef, blob);

      // Get the Firebase image URL
      const url = await getDownloadURL(storageRef);
      setFirebaseImageUrl(url);
      Alert.alert('Image uploaded', 'Image uploaded successfully to Firebase.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      Alert.alert('Error', 'Failed to upload image to Firebase.');
    }
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
     };

  const takePicture = async () => {
    if (cameraRef) {
        const photo = await cameraRef.takePictureAsync({
            quality: 0.5, // Adjust this value (0.0 - 1.0) for picture quality
            skipProcessing: true, // Set to true to skip processing
         });
        //  const source = photo.uri;
    }
};

const retakePicture = () => {
    setImageUri(null);
};

  return (
    <View style={styles.container}>
    <View style={styles.box}>
        {!imageUri ? (
            <View style={styles.cameraContainer}>
                <CameraView style={styles.fixedRatio} facing={facing}/>
            </View>
        ) : (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                />
                <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={retakePicture}
                >
                    <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
    {!imageUri && (
        <TouchableOpacity
            style={styles.takePictureButton}
            onPress={takePicture}
        >
            <Text style={styles.takePictureButtonText}>
                Analyse
            </Text>
        </TouchableOpacity>
    )}
</View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Heading: {
        fontSize: 40,
        fontWeight: "bold",
        padding: 20,
        color: "green",
    },
    SubHeading: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 120,
        marginTop: -20,
    },
    box: {
        flex: 0.7,
        borderWidth: 2,
        borderColor: "black",
        margin: 10,
        overflow: "hidden",
        borderRadius: 10,
    },
    cameraContainer: {
        flex: 1,
        aspectRatio: 1,
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
    takePictureButton: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 10,
        alignSelf: "center",
        position: "absolute",
        bottom: 30,
    },
    takePictureButtonText: {
        color: "white",
        fontSize: 18,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
    },
    retakeButton: {
        position: "absolute",
        bottom: 30,
        backgroundColor: "red",
        padding: 20,
        borderRadius: 10,
    },
    retakeButtonText: {
        color: "white",
        fontSize: 18,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
      }
});
