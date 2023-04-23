import { Form, Modal, Button } from "react-bootstrap"
import { useRef, useState } from "react"
import { addDoc, collection, query, where } from "firebase/firestore"
import {auth, db} from "../firebase"
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function AddBudgetModal({ show, handleClose }) {

  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetMax, setNewBudgetMax] = useState(0);
  
  const userId = useRef();
  

  const cardsCollectionRef = collection(db, "cards");

  const navigation = useNavigate();

  const onSubmitCard = async () => {
    try{
      await addDoc(cardsCollectionRef, {
        budget: newBudgetMax,
        currentAmount: 0,
        name: newBudgetName,
        user: userId.current
      })
      window.location.reload(true)
      handleClose();
    }catch(err){
      console.error(err);
    }
  }

  const authen = getAuth();
  onAuthStateChanged(authen, (user) => {
  if (user) {
      userId.current = user.uid
  } else {
    navigation("/")
  }
  });
  
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={(e) => setNewBudgetName(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              onChange={(e) => setNewBudgetMax(Number(e.target.value))}
              min={0}
              step={0.01}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={onSubmitCard}>
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}