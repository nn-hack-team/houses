import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAbGvh7CEf0no2bNNiQHSnFI-S4zEyTzJU",
//   authDomain: "houses-5ba82.firebaseapp.com",
//   projectId: "houses-5ba82",
//   storageBucket: "houses-5ba82.appspot.com",
//   messagingSenderId: "885687688470",
//   appId: "1:885687688470:web:ac919c686a5da833b84437"
// }

const firebaseConfig = {
  apiKey: 'AIzaSyDA8LVcBB6ZuFMGtZZLEh_veJ44WGrNRdE',
  authDomain: 'house-marketplace-app-fb1d0.firebaseapp.com',
  projectId: 'house-marketplace-app-fb1d0',
  storageBucket: 'house-marketplace-app-fb1d0.appspot.com',
  messagingSenderId: '832068369979',
  appId: '1:832068369979:web:dce177da9bfc60a4b4e61e',
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
