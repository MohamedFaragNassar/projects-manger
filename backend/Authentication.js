const jwt = require("jsonwebtoken");

const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userName: user.userName,
    },
    process.env.JWT_SECRET
  );
};

const isAuth = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decodedToken;
      next();
      return;
    });
  } else {
    res.status(401).send({ message: "tocken not provided" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  } else {
    res.status(403).send({ message: "Access denied" });
  }
};

module.exports = { getToken, isAuth, isAdmin };
