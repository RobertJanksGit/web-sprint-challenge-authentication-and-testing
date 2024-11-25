const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets"); // use this secret!
const { findBy } = require("../auth/auth-model");

function restricted(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);
  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, message: "token invalid" });
      } else {
        req.decodedJwt = decoded;
        next();
      }
    });
  } else {
    next({ status: 401, message: "token required" });
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
}

function validateBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, message: "username and password required" });
  } else {
    next();
  }
}

async function checkUsernameExistis(req, res, next) {
  const { username } = req.body;
  try {
    const usernameExist = await findBy({ username });
    if (!usernameExist) {
      next();
    } else {
      next({ status: 401, message: "username taken" });
    }
  } catch (err) {
    next({ status: 500, message: "server error while checking username" });
  }
}
module.exports = { restricted, validateBody, checkUsernameExistis };
