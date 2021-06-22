const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "rR58%&h7bm6@th*jjZwDuN3ahB2ukF+5ZYHsZ88Str^2mqsb_e"

router.post("/signup", async (req, res) => {
    // If there is an error inside of the try block, it will move to the catch block and handle the error.
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password)
            return res.status(400).send("Please fill out all of the fields.");
        if (password.length < 6)
            return res.status(400).send("Please enter a password that is at least 6 characters long.");

        // Ensure only unique emails
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).send("An account with this email already exists.");

        // Hash the password
        // We don't want to save the password in the database, so we encrypt it so that the databse never knows the exact password of the users.
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({ email, passwordHash });
        const savedUser = await newUser.save();

        // Log in the new user
        // hide key
        // To log a user in, we put a jwt in the users cookie storage. This is how we determine if the user is allowed to visit our protected pages.
        const token = jwt.sign({
            user: savedUser._id
        }, secretKey);
        res.cookie("token", token, {
            httpOnly: false,
        }).send();

        // Use a password generator to get your own secret key for the JSON Web Token
        // Don't forget to hide your JWT in an env file or in heroku config vars
        // JWT payloads are not secure, don't put sensitive info in the payload, only use for logging in.

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password)
            return res.status(400).send("Please enter all required fields");
        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(401).send("Wrong email or password.");

        // Bcrypt will compare the password the user entered with the password Hash saved in the db.
        // If the password and passwordHash are linked to the same origin, bcrypt returns true, otherwise it returns false.
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect)
            return res.status(401).send("Wrong email or password.");

        // Log in the new user
        const token = jwt.sign({
            user: existingUser._id
        }, secretKey);
        res.cookie("token", token, {
            httpOnly: false,
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// To log a user out, we delete the cookie that we set in the earlier routes.
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: false,
        expires: new Date(0)
    }).send();
});

router.get("/loggedIn", (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.json(false);

        res.send(true);
    } catch (err) {
        res.json(false);
    }
});

router.get("/profile/:id", async (req, res) => {
    try {
        const userInfo = await User.findById(req.params.id);
        res.json(userInfo);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;