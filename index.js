const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({ path: "./key.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const configuration = new Configuration({
  organization: "org-SRl9bJ1fabFg9oDkbxCRAXUC",
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;

  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: 1000,
    temperature: 0.5,
  });

  res.json({
    message: response.data.choices[0].text,
  });
});
app.get("/models", async (req, res) => {
  try {
    const response = await openai.listEngines();
    res.json({
      models: response.data.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
