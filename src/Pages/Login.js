import React from "react";
import { Button, Container } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import {auth, googleProvider} from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
    <>
    <div className="spacer layer1">
    <Container className="me-auto d-flex flex-column justify-content-center" style={{ height: '100vh' }}>
      <h1 className="text-center text-white">Welcome to the Budget App</h1>
      <h1 className="text-center text-white"> Login </h1>
      <div className="text-center">
        <Button className="primary m-3" onClick={signInWithGoogle}> Log in with Google</Button>
      </div>
    </Container>
    </div>
    </>
  );
}

export default Login;
