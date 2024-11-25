const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("../api/server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secrets/index");
const Auth = require("./auth/auth-model");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
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
describe("[POST] /login", () => {
  const user = {
    username: "Captain Marvel",
    password: "foobar",
  };
  test("responds with token in res.body", async () => {
    const res = await request(server).post("/api/auth/login").send(user);
    expect(res.body).toHaveProperty("token");
  });
  test("res.body contains welcome message", async () => {
    const res = await request(server).post("/api/auth/login").send(user);
    expect(res.body.message).toEqual("welcome, Captain Marvel");
  });
});

describe("findBy", () => {
  test("[1] resolves user by filtered word", async () => {
    const mockUser1 = {
      username: "CaptainMarvel",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG",
    };
    const { username } = mockUser1;
    await db("users").insert(mockUser1);
    const user = await Auth.findBy({ username });
    expect(user).toMatchObject({ ...mockUser1 });
  });
});
describe("findById", () => {
  test("[2] resolves user by ID", async () => {
    const mockUser1 = {
      username: "IronMan",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG",
    };
    const mockUser2 = {
      username: "TacoMan",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2Lhpu",
    };
    await db("users").insert(mockUser1);
    await db("users").insert(mockUser2);
    const user = await Auth.findById(5);
    expect(user).toMatchObject(mockUser1);
  });
});
describe("add", () => {
  test("[3] resolves newly created user", async () => {
    const mockUser = {
      username: "BatMan",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2Lhpu",
    };
    const user = await Auth.add(mockUser);
    expect(user).toMatchObject(mockUser);
  });
});
