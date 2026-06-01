const express = require("express");
const { connectToDatabase } = require("./database/Db");
const dotnv = require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// ➤ FIX: Add CORS middleware
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(
    cors({
        origin: [
            "https://production.traxoindia.com",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use("/api/v1/superadmin", require("./routes/superAdminRoute"));

connectToDatabase()
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port 2000");
});


app.get("/", (req, res) => {
    res.send("🚀Traxo Production Server Is working")
})

