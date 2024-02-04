// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlEz7cyUuIf6UjtC2e9Wp34Na8C4cZsbM",
  authDomain: "delta-hacks-x.firebaseapp.com",
  projectId: "delta-hacks-x",
  storageBucket: "delta-hacks-x.appspot.com",
  messagingSenderId: "1063173296448",
  appId: "1:1063173296448:web:543c1e08323bf703b0eaa5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const usersDb  = firebase.firestore().collection('users')


// Initialize Firebase
// Sign up





function signup(){
    let email = document.getElementById("emailSignUp").value
    let password = document.getElementById("passwordSignUp").value
    console.log(password)
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        const newDocRef = usersDb.doc(user.uid)
        let userData = {
            email: email,
            password: password,
            excersizes: []
        }
        newDocRef.set(userData)
        .then(()=> {
            console.log("sucess")
        }
        ).catch((error) => {
            console.error(error)
        })
        sessionStorage.setItem('userID',user.uid)   
        console.log("good")
    })
    .catch((error) => {
        switch(error.code){
            case 'auth/invalid-email':
                alert('Invalid email address');
                break;
            case 'auth/email-already-in-use':
                alert('Email address is already in use');
                break;
            case 'auth/weak-password':
                alert('Weak password. Password should be at least 6 characters');
                break;
            default:
                console.error('Sign-up error:', error);
        }
    });
}

// Sign in
function signin(){
    let email = document.getElementById('emailSignIn').value
    let password = document.getElementById('passwordSignIn').value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User signed in successfully
      const user = userCredential.user;
      sessionStorage.setItem("userID",user,uID)
    })
    .catch((error) => {
      // Handle errors
      switch (error.code){
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-email':
            alert("Incorrect email or password")
        default:
            console.log(error.code)
      }
    });
}


function addEx(name){
    let userID = sessionStorage.getItem("userID")
    let userdoc = usersDb.doc(userID)

    userdoc.get()
        .then((doc) => {
            const currentArray = doc.data().excersizes || []; // Default to an empty array if the field doesn't exist
            const newItem = {name};
            currentArray.push(newItem);

            return userdoc.update({
                excersizes: currentArray
            });
        })
}


document.getElementById("addExcersize").addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      addEx(document.getElementById("addExcersize").value)
    }
  });
document.getElementById('signup').addEventListener('click', () => {
    event.preventDefault()
    signup(); // Trigger the function when the button is clicked
});
document.getElementById('signIn').addEventListener('click', () => {
    event.preventDefault()
    signin(); // Trigger the function when the button is clicked
});


