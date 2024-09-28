import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View ,Image} from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

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

  const takePicture = async () => {
    // if (camera) {
    //     const data = aw  /ait camera.takePictureAsync(null);
    //     setImage(data.uri);
    // }
};

const retakePicture = () => {
    setImage(null);
};

  return (
    <View style={styles.container}>
    <View style={styles.box}>
        {!image ? (
            <View style={styles.cameraContainer}>
                <CameraView style={styles.fixedRatio} facing={facing}/>
            </View>
        ) : (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
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
    {!image && (
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
