const db = require("../../data/dbConfig");
const Auth = require("./auth-model");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe("findBy", () => {
  test("[1] resolves user by filtered word", async () => {
    const mockUser1 = {
      username: "Captain Marvel",
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
      username: "Iron Man",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG",
    };
    const mockUser2 = {
      username: "Taco Man",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2Lhpu",
    };
    await db("users").insert(mockUser1);
    await db("users").insert(mockUser2);
    const user = await Auth.findById(2);
    expect(user).toMatchObject(mockUser1);
  });
});
describe("add", () => {
  test("[3] resolves newly created user", async () => {
    const mockUser = {
      username: "Bat Man",
      password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2Lhpu",
    };
    const user = await Auth.add(mockUser);
    expect(user).toMatchObject(mockUser);
  });
});
