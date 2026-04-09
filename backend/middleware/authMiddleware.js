const jwt = require("jsonwebtoken");
const { auth } = require("express-oauth2-jwt-bearer");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret-key");
    // console.log(decoded);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

module.exports = { checkJwt };
