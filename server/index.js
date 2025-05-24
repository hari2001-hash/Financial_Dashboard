const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use('/api/users', require('./routes/userRoutes'));



app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
