const express = require("express");
const transactions = require("./transactions");
const app = express();
const port = 4000;
const { query } = require('./database');


app.use(express.json()) 

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    res.on("finish", () => {
      // the 'finish' event will be emitted when the response is handed over to the OS
      console.log(`Response Status: ${res.statusCode}`);
    });
    next();
  });


app.get("/", (req, res) => {
    res.send("Welcome to the transaction Application Tracker API!");
  });

//get all transactions from the database
app.get("/transactions", async(req, res) => {
    try{
        const allTransactions = await query("SELECT * FROM transactionstable");
        res.status(200).send(allTransactions.rows);
    }
    catch(error){
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
    }

});

//gets an individual transaction.
app.get("/transactions/:id", async(req, res) => {

    const transactionsId = parseInt(req.params.id,10);//gets the id from the request
   try{
    const transaction = await query("SELECT * FROM transactionstable WHERE id = $1", [transactionsId]);
    if(transaction.rows.length>0){
        res.status(200).json(transaction.rows[0]);
    }
    else{
        res.status(404).send({message:"transaction Not Found"});
    }
   }catch(error){
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    }
    
})

//creates a new transaciton.
app.post("/transactions", async(req, res) =>{
    //get the information out of the request by destructure all the inputs.
   const{ date, description, category, amount, type} = req.body;
   //make a new job
   try{
        const newTransaction = await query(
            `INSERT INTO transactionstable ( date, description, category, amount, type) VALUES 
            ($1, $2, $3, $4, $5) RETURNING *`,
            [ date, description, category, amount, type]
        )
        console.log(newTransaction);
        res.status(201).json(newTransaction.rows[0]);
   }
   catch(error){
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
   }
})

//update a specific transction.
app.patch("/transactions/:id", async(req, res) =>{
    const transactionId = parseInt(req.params.id, 10);//get the id we want to change
    //destructure the request
    const{ date, description, category, amount, type} = req.body;
    //make a new transaction
    try {
        const updatedTransaction = await query(
            "UPDATE transactionstable SET date = $1, description = $2, category = $3, amount = $4, type = $5 WHERE id = $6 RETURNING *",
            [date, description, category, amount, type, transactionId]
        );
        //check to see if the update was even on a transaction that was there.
        if(updatedTransaction.rows.length>0){
            res.status(200).json(updatedTransaction.rows[0]);
        }else{
            res.status(404).send({message:"transaction Not Found"});
            
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
})

//delete a transaciton
app.delete("/transactions/:id", async(req, res) => {
    const transactionId = parseInt(req.params.id, 10);

    try{
        const deleteTransaction = await query("DELETE FROM transactionstable WHERE id = $1", [transactionId]);
        
        if(deleteTransaction.rowCount>0){
            res.status(200).send({message:"transaction deleted successfully"});
        }
        else{
            res.status(404).send({message:"transaction Not Found"});
        }
    }
    catch(error){
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }

})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});








