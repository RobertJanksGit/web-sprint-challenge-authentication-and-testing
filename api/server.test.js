const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("../api/server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secrets/index");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

describe("[GET] /api/jokes", () => {
  test("resolves an array of jokes", async () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const responds = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
    expect(responds.status).toBe(200);
    expect(responds.body).toHaveLength(3);
  });
  test("logged out users do not have access", async () => {
    const responds = await request(server).get("/api/jokes");
    expect(responds.status).toBe(401);
    expect(responds.body.message).toBe("token required");
  });
});
