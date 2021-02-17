import React, { useState } from "react";
// import "./App.css";
import "./sass/App.sass";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const messageRef = firestore.collection("messages");

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <div className="container">
        <div className="hero is-white is-fullheight app-title">
          <div className="hero-header">
            <div className="hero is-primary app-title">
              <h1 className="title has-text-centered mt-6 mb-4">Chat Room</h1>
              <SignOut />
            </div>
          </div>
          <div className="hero-body chats">
            {user ? <ChatRoom /> : <SignIn />}
          </div>
          <div className="hero-footer">{user ? <ChatForm /> : null}</div>
        </div>
      </div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign In with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="button signOut" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const query = messageRef.orderBy("createdAt").limit(25);

  const [message, messageIsLoading] = useCollectionData(query, {
    idField: "id",
  });

  let lastSender = '';

  const createMessage = (msg) => {

    const {uid} = msg;

    if(uid === lastSender) {
      msg.continuousSender = true;
    }

    lastSender = uid;
    return <ChatMessage key={msg.id} message={msg} />;
  }

  return (
    <>
      <ul className="area">
        {!messageIsLoading &&
          message.map((msg) => createMessage(msg))}
      </ul>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, displayName, createdAt, continuousSender } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "send" : "recieved";
  const messageContinuous = continuousSender ? 'continuous' : '';

  const getHour = (date) => {
    console.log(date);
    const hour = date.toDate().getHours();
    const min = date.toDate().getMinutes();
    const pM = hour > 12 ? 'P.M.' : 'A.M.';
    const newHour = hour > 12 ? hour - 12 : '0' + hour;
    const newMins = min > 12 ?  min : '0' + min;

    return newHour + ':' + newMins + ' ' + pM;
  }

  return (
    <li className={`chat ${messageClass} ${messageContinuous}`}>
      <img src={photoURL}  alt={`Profile pic of ${displayName}`}/>
      <p className="text">
        <small className="sendFrom">{displayName}</small>
        {text}
        <small className="sendAt">{getHour(createdAt)}</small>
      </p>
    </li>
  );
}

function ChatForm() {
  const SubmitMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;

    console.log(uid, photoURL);

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });

    setFormValue("");
  };

  const [formValue, setFormValue] = useState("");

  return (
    <form onSubmit={SubmitMessage}>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="send something nice"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
        </div>
        <div className="control">
          <button type="submit" className="button is-primary">
            💬
          </button>
        </div>
      </div>
    </form>
  );
}

export default App;
