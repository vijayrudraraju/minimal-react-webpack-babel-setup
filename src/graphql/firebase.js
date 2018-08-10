import firebase from 'firebase'
import * as firebaseui from 'firebaseui'

console.log('VJ', { firebase, firebaseui })

const config = {
  apiKey: "AIzaSyCgU9TqabqXmzPlH4pqUlzEteIyrSNg9lQ",
  authDomain: "slicr-81118.firebaseapp.com",
  databaseURL: "https://slicr-81118.firebaseio.com",
  projectId: "slicr-81118",
  storageBucket: "slicr-81118.appspot.com",
  messagingSenderId: "686529729406"
}
firebase.initializeApp(config);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
  })
  .catch(error => {
    console.log('VJ', 'setPersistence', { error })
  })
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const { 
      displayName, 
      email, 
      emailVerified, 
      isAnonymous, 
      photoURL,
      phoneNumber,
      uid
    } = user.providerData[0]
    console.log('VJ', 'onAuthStateChanged', { displayName, email, emailVerified, isAnonymous, photoURL, phoneNumber, uid })
  }
})

const uiConfig = {
  signInSuccessUrl: '',
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: 'https://www.beatshoplabs.com/',
  // Privacy policy url.
  privacyPolicyUrl: 'https://www.beatshoplabs.com/',
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      console.log('VJ', 'signInSuccessWithAuthResult', { authResult, redirectUrl })
      return false
    },
    uiShown: () => {
      console.log('VJ', 'uiShown')
    }
  }
}

const ui = new firebaseui.auth.AuthUI(firebase.auth())
ui.start('#firebaseui', uiConfig)

const firestoreDb = firebase.firestore()

export const usersColl = firestoreDb.collection("users")
export const loopsColl = firestoreDb.collection("loops")
export const padsColl = firestoreDb.collection("pads")
export const tracksColl = firestoreDb.collection("tracks")
export const banksColl = firestoreDb.collection("banks")
export const kitsColl = firestoreDb.collection("kits")
export const projectsColl = firestoreDb.collection("projects")

usersColl.get().then(querySnapshot => {
  querySnapshot.forEach(doc => {
    console.log('VJ', 'usersColl', { id: doc.id, ...doc.data() })
  })
})
