import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Auth() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      
    } else {

    }
  });
  return <div>Auth</div>;
}

export default Auth; // Firebase authetification
