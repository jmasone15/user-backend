const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const courses = [
    { id: 1, name: "Algorithms" },
    { id: 2, name: "Software Engineering" },
    { id: 3, name: "Human Computer Interaction" }
];

app.get("/", function (req, res) {
    //when we get an http get request to the root/homepage
    res.send("Hello World");
});

app.listen(PORT, function () {
    console.log(`Listening on Port ${PORT}`);
});