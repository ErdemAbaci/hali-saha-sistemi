const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { authHeader, createUser } = require("./helpers/auth");

describe("Auth and user flows", () => {
  it("registers, logs in and rejects duplicate email", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Musteri",
      email: "musteri@example.com",
      phone: "5551112233",
      password: "secret123",
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();
    expect(registerResponse.body.user.email).toBe("musteri@example.com");
    expect(registerResponse.body.user.phone).toBe("5551112233");

    const duplicateResponse = await request(app).post("/api/auth/register").send({
      name: "Musteri 2",
      email: "musteri@example.com",
      phone: "5551112244",
      password: "secret123",
    });

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.message).toMatch(/email/i);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "musteri@example.com",
      password: "secret123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.email).toBe("musteri@example.com");
  });

  it("allows an admin to create another admin", async () => {
    const admin = await createUser({ role: "admin" });

    const response = await request(app)
      .post("/api/auth/create-admin")
      .set(authHeader(admin))
      .send({
        name: "Yeni Admin",
        email: "admin2@example.com",
        password: "secret123",
      });

    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("admin");
  });

  it("supports profile get, profile update, update alias and password change", async () => {
    const user = await createUser();

    const profileResponse = await request(app)
      .get("/api/users/profile")
      .set(authHeader(user));

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.email).toBe(user.email);

    const updateProfileResponse = await request(app)
      .put("/api/users/profile")
      .set(authHeader(user))
      .send({
        name: "Yeni Isim",
        phone: "5552223344",
      });

    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.body.name).toBe("Yeni Isim");
    expect(updateProfileResponse.body.phone).toBe("5552223344");

    const aliasUpdateResponse = await request(app)
      .put("/api/users/update")
      .set(authHeader(user))
      .send({
        currentPassword: "secret123",
        newPassword: "newsecret123",
      });

    expect(aliasUpdateResponse.status).toBe(200);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "newsecret123",
    });

    expect(loginResponse.status).toBe(200);
  });

  it("lists users for admin and updates roles", async () => {
    const admin = await createUser({ role: "admin" });
    const targetUser = await createUser({ email: "target@example.com", phone: "5559998888" });

    const listResponse = await request(app)
      .get("/api/users/admin/users")
      .set(authHeader(admin));

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);

    const updateRoleResponse = await request(app)
      .put(`/api/users/admin/users/${targetUser._id}/role`)
      .set(authHeader(admin))
      .send({ role: "operator" });

    expect(updateRoleResponse.status).toBe(200);
    expect(updateRoleResponse.body.role).toBe("operator");

    const updatedUser = await User.findById(targetUser._id);
    expect(updatedUser.role).toBe("operator");
  });
});
