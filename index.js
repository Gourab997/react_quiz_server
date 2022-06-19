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

    // POST User : add a new user
    app.post("/quiz", async (req, res) => {
      const newQuiz = req.body;
      console.log("adding new user", newQuiz);
      const result = await quizCollection.insertOne(newQuiz);
      res.send(result);
    });
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running node server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
