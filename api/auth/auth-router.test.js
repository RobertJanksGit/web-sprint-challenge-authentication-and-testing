const db = require("../../data/dbConfig");
const request = require("supertest");
const server = require("./auth-router");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe("[POST] /register", () => {
  const newUser = {
    username: "Captain Marvel",
    password: "foobar",
  };
  test("adds a new user to the database", async () => {
    await request(server).post("/register").send(newUser);
    expect(await db("users")).toHaveLength(1);
  });
});
