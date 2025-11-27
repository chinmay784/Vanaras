const express = require("express");
const { connectToDatabase } = require("./database/Db");
const dotnv = require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// ➤ FIX: Add CORS middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/v1/superadmin", require("./routes/superAdminRoute"));

connectToDatabase()
app.listen(PORT, (req, res) => {
    console.log(`Server Running on PORT ${PORT} , and URL : http://localhost:2000`);
});

app.get("/", (req, res) => {
    res.send("Server Is working")
})