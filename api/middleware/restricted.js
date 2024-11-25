const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets"); // use this secret!
const { findBy } = require("../auth/auth-model");

// module.exports = (req, res, next) => {
//   next();
//   /*
//     IMPLEMENT

//     1- On valid token in the Authorization header, call next.

//     2- On missing token in the Authorization header,
//       the response body should include a string exactly as follows: "token required".

//     3- On invalid or expired token in the Authorization header,
//       the response body should include a string exactly as follows: "token invalid".
//   */
// };

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
  const usernmaeExist = await findBy({ username });
  if (usernmaeExist) {
    next();
  } else {
    next({ status: 401, message: "username taken" });
  }
}
module.exports = { validateBody, checkUsernameExistis };
