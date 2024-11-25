const db = require("../../data/dbConfig");
const request = require("supertest");
const server = require("../server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe("[POST] /register", () => {
  const newUser = {
    username: "Captain Marvel",
    password: "foobar",
  };
  const newUser2 = {
    username: "Bat Man",
    password: "foobar",
  };
  const newUser3 = {
    username: "Taco Man",
    password: "foobar",
  };
  test("adds a new user to the database", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    expect(await db("users")).toHaveLength(1);
    await request(server).post("/api/auth/register").send(newUser2);
    expect(await db("users")).toHaveLength(2);
  });
  test("responds with the new user", async () => {
    const res = await request(server).post("/api/auth/register").send(newUser3);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("password");
    expect(res.body.username).toEqual(newUser3.username);
  });
});
