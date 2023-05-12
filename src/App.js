import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddBudgetModal from "./components/AddBudgetModal";
import AddExpenseModal from "./components/AddExpenseModal";
import ViewExpensesModal from "./components/ViewExpensesModal";
import BudgetCard from "./components/BudgetCard";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "./firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./App.css"


function App() {
  const navigation = useNavigate();

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModal, setViewExpensesModal] = useState();
  const [expenseName, setExpenseName] = useState();

  const userId = useRef("");

  const [cardsLists, setCardsLists] = useState([]);

  let childId = 0;

  const cardsCollectionRef = collection(db, "cards");
  let q = query(cardsCollectionRef, where("user", "==", "")); //declaration of query variable

  const getCardsLists = async () => {
    //Read
    try {

      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setCardsLists(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  

  function openAddExpenseModal() {
    setShowAddExpenseModal(true);
  }

  function openViewExpenseModal(budgetName) {
    setExpenseName(budgetName);
    setViewExpensesModal(true);
  }

  const Logout = async () => {
    try {
      await signOut(auth);
      navigation("/");
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(()=>{
    getCardsLists();
  },[]) //Reads information from the database
  
  

  const authen = getAuth();
  onAuthStateChanged(authen, (user) => {
  if (user) {
    if(userId.current === "")
    {
      q = query(cardsCollectionRef, where("user", "==", user.uid)); //changes query based on user id
      getCardsLists();
      userId.current = user.uid
      
    }
  } else {
    navigation("/")
  }
  });

  return (
    <div className="spacer layer2">
      <Container >
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-primary" onClick={openAddExpenseModal}>
            Add Expense
          </Button>
          <Button variant="danger" onClick={Logout}>
            Log out
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          <div>
            {cardsLists.map((cards) => {
              return (
                <BudgetCard
                  key={childId++}
                  name={cards.name}
                  amount={cards.currentAmount}
                  max={cards.budget}
                  onAddExpenseClick={() => openAddExpenseModal()}
                  onViewExpensesClick={() => openViewExpenseModal(cards.name)}
                />
              );
            })}
          </div>
        </div>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        show={viewExpensesModal}
        handleClose={() => setViewExpensesModal(false)}
        budgetName={expenseName}
      />
    </div>
  );
}

export default App;
