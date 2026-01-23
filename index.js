const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const artworkCollection = db.collection("artworks");
    const artistCollection = db.collection("artists");
    const favouritesCollection = db.collection("favourites");

    //Adding Users to database
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    //Adding artworks to database
    app.post("/artwork", async (req, res) => {
      const newArt = req.body;
      const result = await artworkCollection.insertOne(newArt);
      res.send(result);
    });

    //Adding artists to database
    app.post("/artists", async (req, res) => {
      const newArtist = req.body;
      const result = await artistCollection.insertOne(newArtist);
      res.send(result);
    });

    //Getting 6 artworks by sorting according to likesCount
    app.get("/artwork", async (req, res) => {
      const cursor = artworkCollection.find().sort({ likesCount: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Getting all artworks
    app.get("/exploreArtworks", async (req, res) => {
      const cursor = artworkCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/exploreArtworks", async (req, res) => {
      const newArt = req.body;
      const result = await artworkCollection.insertOne(newArt);
      res.send(result);
    });

    //Getting 6 artists

    app.get("/artists", async (req, res) => {
      const cursor = artistCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    //getting a specific artwork
    app.get("/artwork/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artworkCollection.findOne(query);
      res.send(result);
    });

    //updating artworks collection

    app.patch("/exploreArtworks/like/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artworkCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likesCount: 1 } },
      );
      res.send(result);
    });

    //Search by title or artist
    app.get("/searchArtworks", async (req, res) => {
      const searchQuery = req.query.query;
      console.log(req.query);
      const cursor = artworkCollection.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { artistName: { $regex: searchQuery, $options: "i" } },
        ],
      });
      const result = await cursor.toArray();
      res.send(result);
    });

    //Adding fav content to database
    app.post("/favourites/:id", async (req, res) => {
      const newFav = req.body;
      const result = await favouritesCollection.insertOne(newFav);
      res.send(result);
    });

    //getting favourites from database
    app.get("/favourites",async (req,res)=>{
      const email=req.query.email;
      const favourites=await favouritesCollection.find({userEmail:email}).toArray();
      const artworkIds=favourites.map(fav=>new ObjectId(fav.artworkId));

      const artworks=await artworkCollection.find({
        _id: {$in: artworkIds}
      }).toArray();
      res.send(artworks);
    })

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
