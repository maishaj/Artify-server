const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//Mongodb

const uri =
  "mongodb+srv://ArtifyDBUser:vSbwqye54OpPWyYF@cluster0.fjenzci.mongodb.net/?appName=Cluster0";

// Middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!..");
});

app.listen(port, () => {
  console.log(`Artify is running on port ${port}`);
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    //Creating Collection
    const db = client.db("artify_db");
    const usersCollection = db.collection("users");

    //Adding Users to database
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
