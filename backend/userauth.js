const jwt = require("jsonwebtoken");
const process.env.JWT_SECRET = "helloworld";

const userAuthenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
     return res.status(401).send("No token provided");
    } 
    else{
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.email = decodedToken.email;
      req.isVerified = decodedToken.isVerified;
    //  console.log(decodedToken.isVerified)
      if(!decodedToken.isVerified){
        return res.status(401).send("Please verify your email first")
      }
    //  console.log(decodedToken.email)
      next();
    }
  } catch (err) {
    return res.status(401).json({
      error: "invalid authorization",
    });
  }
};

module.exports = userAuthenticate;
