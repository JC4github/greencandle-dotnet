import './App.css'
import NavigationBar from './components/NavigationBar'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import firebase from 'firebase/compat/app';

export default function App() {
  const apiKey = import.meta.env.VITE_APIKEY
  const authDomain = import.meta.env.VITE_AUTHDOMAIN
  const projectId = import.meta.env.VITE_PROJECTID
  const storageBucket = import.meta.env. VITE_STORAGEBUCKET
  const messagingSenderId = import.meta.env. VITE_MESSAGING_SENDERID
  const appId = import.meta.env. VITE_APPID
  const measurementId = import.meta.env. VITE_MEASUREMENTID
  
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return (
    <ChakraProvider>
      <NavigationBar />
        <Outlet />
    </ChakraProvider>
  )
}