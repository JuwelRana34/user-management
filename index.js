const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//  middleware 
app.use(cors());
app.use(express.json());
require('dotenv').config()


// database setup 
const uri =`mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Pass}@cluster0.ocbhdf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

 // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const database = client.db("juwelrana");
  const collection = database.collection("users");
  

    

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await database.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);

 

// routes
app.get("/", async(req, res) => {
    const response = await collection.find().toArray()
    res.send(response);
})
app.delete("/user/:id",async(req, res) => {
  const id = req.params.id;
  const result = await collection.deleteOne({_id: new ObjectId(id)})
    res.send(result);
})
app.patch("/user/:id",async(req, res) => {
  const id = req.params.id;
  const {name} = req.body
  const result = await collection.updateOne({_id: new ObjectId(id)}, {$set: {name}})
  res.send(result);
})
app.post("/signup",async(req, res) => {
        const user = req.body
         await collection.insertOne(user)
       res.send("user successfully signup!")
})







app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});

module.exports = app