const express = require("express");
const transactions = require("./transactions");
const app = express();
const port = 4000;

app.use(express.json()) 

app.use((req, res, next) => {
    res.on("finish", () => {
      // the 'finish' event will be emitted when the response is handed over to the OS
      console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
  });

function getNextIdFromCollection(collection) {
    if(collection.length === 0) return 1; 
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the transaction Application Tracker API!");
});

//get all the transactions
app.get("/transactions", (req, res) => {
 res.send(transactions);
})

//gets an individual transaction.
app.get("/transactions/:id", (req, res) => {
    const transactionsId = parseInt(req.params.id,10);//gets the id from the request
    const transaction = transactions.find(transaction=>transaction.id===transactionId);//find the transaction with that id.
    if(transaction){
        res.send(transaction);//print out the reqeuested transaction.
    }
    else{
        res.status(404).send({message:"transaction Not Found!"});
    }
    
})

//creates a new job.
app.post("/transactions", (req, res) =>{
    const newTransactions = {...req.body, id:getNextIdFromCollection(transactions)};
    transactions.push(newTransactions);
    console.log("new Transactions: ", newTransactions);
    res.status(201).send(newTransactions);
})

//update a specific job.
app.patch("/transactions/:id", (req, res) =>{
    const transactionId = parseInt(req.params.id, 10);//get the id we want to change
    const transactionUpdates = req.body;//the updates that will be made.
    const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);//find the item we want to change
    if(transactionIndex!==-1){
        const updatedTransaction = {
            ...transactions[transactionIndex],
            ...transactionUpdates
        }
        transactions[transactionIndex] = updatedTransaction;
        res.send(updatedTransaction);
    }else{
        res.status(404).send({message:"transaction Not Found"});
    }
    
})

//delete
app.delete("/transactions/:id",(req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    const transactionIndex = transactions.findIndex(transaction =>transaction.id === transactionId);
    if(transactionIndex!==-1){
        transactions.splice(jobtransactionIndexIndex,1);
        res.send({message:"transaction deleted succesfully"});
    }
    else{
        res.status(404).send({message:"transaction Not Found"});
    }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});








