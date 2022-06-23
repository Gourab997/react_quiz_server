const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jepw0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const quizCollection = client.db("quizCollection").collection("quiz");
    const answerCollection = client.db("quizCollection").collection("answer");
    // POST User : add a new user
    app.post("/quiz", async (req, res) => {
      const newQuiz = req.body;
      console.log("adding new user", newQuiz);
      const result = await quizCollection.insertOne(newQuiz);
      res.send(result);
    });

    // post answer : add a new answer
    app.post("/answer", async (req, res) => {
      const newAnswer = req.body;
      console.log("adding new answer", newAnswer);
      const result = await answerCollection.insertOne(newAnswer);
      res.send(result);
    });

    app.get("/quiz/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await quizCollection.findOne(query);

      res.send(result);
    });

    app.get("/answer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { uniqueId: id };
      const result = await answerCollection.findOne(query);

      res.send(result);
    });

    // Get all users
    app.get("/quiz", async (req, res) => {
      const cursor = quizCollection.find({});

      const quizs = await cursor.toArray();
      res.send(quizs);
    });
    //get single user
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running node server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
