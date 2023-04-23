import { Form, Modal, Button } from "react-bootstrap"
import { useRef, useState, useEffect } from "react"
import { addDoc, collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"
import {db} from "../firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function AddExpenseModal({
  show,
  handleClose
}) {

  const [cardsLists, setCardsLists] = useState([])
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateAmount, setUpdateAmount] = useState(0)
  const [expenseDescription, setExpenseDescription] = useState("")

  const cardsCollectionRef = collection(db, "cards")
  const expensesCollectionRef = collection(db, "Expenses")

  const userId  = useRef();

  const navigation = useNavigate();

  const getCardsLists = async () =>{
    //Read
    try{
      const data = await getDocs(cardsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
         id: doc.id
        }))
      setCardsLists(filteredData);
    }catch (err){
      console.error(err);
    }
  };

  useEffect(() =>{
    getCardsLists();
  }, [])

  const addExpense = async (name, amount, E_description) => {
     await addDoc(expensesCollectionRef, {
        amount: amount,
        description: E_description,
        name: name,
        user: userId.current
      })
      var updateId;
      var index;
      for(let i = 0; i < cardsLists.length;  i++)
      {
        if(cardsLists[i].name === name)
        {
            updateId = cardsLists[i].id;
            index = i;
        }
      }
      const budgetDoc = doc(db,"cards", updateId);
      amount += cardsLists[index].currentAmount;
      await updateDoc(budgetDoc, {currentAmount: amount});
      window.location.reload(true)
      handleClose();
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
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control onChange ={(e) => {setExpenseDescription(e.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              onChange={(e) => {setUpdateAmount(Number(e.target.value))}}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>Budget</Form.Label>
            <Form.Control placeholder="Please enter the budget name" onChange ={(e) => {setUpdateTitle(e.target.value)}}>
              
            </Form.Control>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => addExpense(updateTitle, updateAmount, expenseDescription)}>
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}