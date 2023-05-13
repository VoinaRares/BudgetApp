import { Form, Modal, Button } from "react-bootstrap"
import { useRef, useState, useEffect } from "react"
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"
import {auth, db} from "../firebase"
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function AddBudgetModal({ show, handleClose }) {

  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetMax, setNewBudgetMax] = useState(0);
  const [cardsLists, setCardsLists] = useState([]);
  
  const userId = useRef();
  

  const cardsCollectionRef = collection(db, "cards"); //db for the cards

  const getCardsLists = async () => {
    //Read
    try {

      const data = await getDocs(cardsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setCardsLists(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const navigation = useNavigate();// for redirection

  const onSubmitCard = async () => {
    let ok = 1;

    for(let i = 0; i < cardsLists.length;  i++)
    {
        if(cardsLists[i].name === newBudgetName && cardsLists[i].user === userId.current)
        {
            ok = 0;
            alert("Please enter the correct Data");
        }
    }
    if(ok === 1)
    {
      try{
        await addDoc(cardsCollectionRef, {
          budget: newBudgetMax,
          currentAmount: 0,
          name: newBudgetName,
          user: userId.current
        })//add Document
        window.location.reload(true)
        handleClose();
      }catch(err){
        console.error(err);
      }
    }
  }

  useEffect(()=>{
    getCardsLists();
  },[]) //Reads information from the database

  const authen = getAuth();
  onAuthStateChanged(authen, (user) => {
  if (user) {
      userId.current = user.uid
  } else {
    navigation("/")
  }
  }); //redirect if not logged in
  
  
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