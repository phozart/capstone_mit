import { initializeApp } from 'firebase/app';
import {  getFirestore, addDoc, doc, getDoc, collection } from "firebase/firestore"
import { GoogleAuthProvider , getAuth , signInWithPopup, userAuth, additionalData} from "firebase/auth";
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);

export const auth2 = getAuth();
export const db = getFirestore();

const GoogleProvider = new GoogleAuthProvider();
//GoogleProvider.setCustomParameters({prompt: 'select_account'});

export const auth = getAuth();
export const signInWithGoogle = () => {signInWithPopup(auth2, GoogleProvider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  })};

  export const handleUserProfile = async(userAuth, additionalData) => {
    if (!userAuth) return;
    const { uid } = userAuth;

    const userRef = doc(db, 'users', `$uid`)
    const snapshot = await getDoc(userRef);

    if(snapshot.exists) {
      const {displayName, email } = userAuth;
      const timestamp = new Date();
      console.log(userAuth.photoURL)
      try {
        await addDoc(collection(db, 'users'),{
          displayName,
          email,
          createdDate: timestamp,
          ...additionalData

        }
          );
      }
      catch (err){
        console.log(err);
      }
    }
    return userRef;
  };