module.exports = {
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "shh",
};