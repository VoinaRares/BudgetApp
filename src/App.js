import { Button, Stack } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import BudgetCard from "./components/BudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import { useState } from "react"
import { onSnapshot, collection } from "firebase/firestore"
import db from './firebase'
import { deleteDoc, getDocs, doc, where } from 'firebase/firestore';



function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()

  const [cardsLists, setCardsLists] = useState([])
  


  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }


  const getCards = async(qu) => {
    try{
        const data = await getDocs(qu);
        setCardsLists(data.docs.map((doc) => ({...doc.data(), cardId: doc.cardId})));
    }catch(err)
    {
        console.log(err);
        alert("Query failed!");
    }
};
  

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-primary" onClick={openAddExpenseModal}>
            Add Expense
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
          <div> {cardsLists.map((users) => {
              return <BudgetCard
              key={users.cardId}
              name={users.budget}
              amount={users.currentAmount}
              max={users.max}
              onAddExpenseClick={() => openAddExpenseModal(1)}
              onViewExpensesClick={() =>
                setViewExpensesModalBudgetId(1)
              }
          />
          })}
              
          </div>
          <TotalBudgetCard />
        </div>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  )
}

export default App