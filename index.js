const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieSession = require("cookie-session");

dotenv.config();

const app = express();

let PORT = process.env.PORT || 8000;


//using the cookeisession middleware to handle the expire and key to enode the payload
app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Then generate JWT Token

app.get("/user/generateToken", (req, res) => {
  //how to use the session ?

  //   req.session.views = (req.session.views || 0) + 1;
  //   console.log(req.session);

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, jwtSecretKey);

  req.session = { tokenHeaderKey: token };
  res.send(`${req.session.tokenHeaderKey}`);
});

// Validate User Here

app.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    //passing the token in the header

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token = req.headers.authorization.split(" ")[1];

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        return res.send("Successfully Verified");
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } else {
      //passing the jwt signature on the cookieSession insted of the headers;
      let token = req.session.tokenHeaderKey;

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        return res.send("Successfully Verified");
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
