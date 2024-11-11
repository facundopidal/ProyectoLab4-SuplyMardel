const express = require("express");
const emailHelper = require("./helpers/emailHelpers");
const cors = require("cors")

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post("/send-email", async (req, res) => {
  const { to, subject, text,client } = req.body;
  const newText = text + '\n Cliente: ' + client;
  console.log("new text:", newText);  
  try {
    let info = await emailHelper(to, subject, newText);
    res.status(200).json({message: `email sent: ${info.response}`});
  } catch (error) {
    res.status(500).json({message: "error sending email"});
  }
});

app.post("/send-email-touser", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    let info = await emailHelper(to, subject, text);
    res.status(200).json({message: `Email sent: ${info.response}`});
  } catch (error) {
    res.status(500).json({message: "Error sending email"});
  }
})

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});