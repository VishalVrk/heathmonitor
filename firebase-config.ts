// firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs} from 'firebase/firestore';

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
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth,storage,db };
