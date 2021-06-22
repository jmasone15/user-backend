const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Runs functions for incoming requests for all paths or specific requests 
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "https://www.jordanmasone.com" }));
app.use(morgan("tiny")); // logging framework

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Database Connection
// Make sure to put the db name here.
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/herokuBackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
});

// Routes
app.use("/auth", require("./routes/userRoutes"));

// Starts the server.
app.listen(PORT, () => console.log(`Running on port: ${PORT}🌎`));