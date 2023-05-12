import { Modal, Stack, Card, Button } from "react-bootstrap";
import { currencyFormatter } from "../utils";
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ViewExpensesModal({ show, handleClose, budgetName }) {
  let childId = 1;
  const [expenseList, setExpenseList] = useState([]);
  const [cardsLists, setCardsLists] = useState([])

  const expensesCollectionRef = collection(db, "Expenses");
  const cardsCollectionRef = collection(db, "cards");

  let q = query(expensesCollectionRef, where("name", "==", ""));

  const userId = useRef();

  const navigation = useNavigate();

  const getExpenseListQuery = async () => {
    try {
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setExpenseList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    if (show) {
      q = query(expensesCollectionRef, where("name", "==", budgetName), where("user", "==", userId.current));
      getExpenseListQuery();
      getCardsLists();
    }
  }, [show]);

  useEffect(() => {
    //getExpenseListQuery();
  }, []);

  const deleteExpense = async (id, name, amount) => {
    const expenseDoc = doc(db, "Expenses", id);
    
    await deleteDoc(expenseDoc);
    let newAmount = 0;
    for(let i = 0; i < cardsLists.length;  i++)
      {
        if(cardsLists[i].name === name && cardsLists[i].user === userId.current)
        {
            
            newAmount = cardsLists[i].currentAmount - amount;
            const budgetDoc = doc(db, "cards", cardsLists[i].id);
            await updateDoc(budgetDoc, {currentAmount: newAmount});
            break;
        }
      }
      
      window.location.reload(true);
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
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div>Expenses - {budgetName}</div>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap="3">
          {expenseList.map((expense) => (
            <Card key={childId++}>
              <Card.Title className="ms-2"> Expense #{childId}</Card.Title>
              <Card.Subtitle className="ms-3 mb-2 text-muted">
                {" "}
                {currencyFormatter.format(expense.amount)}
              </Card.Subtitle>
              <Card.Text className="ms-2 mb-2">
                {" "}
                {expense.description}{" "}
              </Card.Text>
              <Button variant="danger" size="sm" className="m-2"  onClick={() => deleteExpense(expense.id, expense.name, expense.amount)}>
                {" "}
                Delete
              </Button>
            </Card>
          ))}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
