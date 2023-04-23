import React from "react";
import { Button, Container } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import {auth, googleProvider} from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigation  = useNavigate();
  const signInWithGoogle = async () =>{
    try {
        await signInWithPopup(auth, googleProvider);
        navigation('/home');
    }catch(err)
    {
        console.error(err);
    }

}

  return (
    <Container>
      <h1 className="me-auto text-center mt-3"> Login </h1>
      <div className="text-center">
        <Button className="primary m-3" onClick={signInWithGoogle}> Log in with Google</Button>
      </div>
    </Container>
  );
}

export default Login;
