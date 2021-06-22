const jwt = require("jsonwebtoken");
const secretKey = "rR58%&h7bm6@th*jjZwDuN3ahB2ukF+5ZYHsZ88Str^2mqsb_e"

function auth(req, res, next) {
    try {
        const token = req.cookies.token;

        // If there is no token, the user is not logged in. Therefore they cannot see our protected routes.
        if (!token)
            return res.status(401).json({ errorMessage: "Unauthorized" });

        // If there is a token, we have to verify that it was created with our secret key unique to our website.
        // Don't forget to hide your secret Key in an env file or config var with heroku.
        const verified = jwt.verify(token, secretKey);
        req.user = verified.user;
        // If the token is verified, the jwt function will return the payload of the token as an object, otherwise it will throw an error.

        // The next function finishes the middleware function and continues on with the route function.
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = auth;