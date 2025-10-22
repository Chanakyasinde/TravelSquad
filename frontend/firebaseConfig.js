import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAszreAM6M4ODx74PUwBS5QPt1_yUWjLtM",
  authDomain: "travelsquad-9b42a.firebaseapp.com",
  projectId: "travelsquad-9b42a",
  storageBucket: "travelsquad-9b42a.firebasestorage.app",
  messagingSenderId: "885587845501",
  appId: "1:885587845501:web:2e18c354001ed9d46d6c14",
  measurementId: "G-0ZBPBBYLDB"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});