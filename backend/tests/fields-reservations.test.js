const request = require("supertest");
const app = require("../app");
const Field = require("../models/field");
const Reservation = require("../models/reservation");
const { authHeader, createUser } = require("./helpers/auth");

describe("Field and reservation flows", () => {
  it("creates and lists operator-managed fields", async () => {
    const operator = await createUser({ role: "operator" });

    const createResponse = await request(app)
      .post("/api/fields")
      .set(authHeader(operator))
      .send({
        name: "Merkez Saha",
        location: "Kadikoy",
        address: "Test Sokak 1",
        price: 1200,
        fieldCount: 2,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.fields).toEqual([1, 2]);

    const listResponse = await request(app)
      .get("/api/fields/operator/fields")
      .set(authHeader(operator));

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
  });

  it("prevents updating another operator field", async () => {
    const owner = await createUser({ role: "operator" });
    const otherOperator = await createUser({
      role: "operator",
      email: "operator2@example.com",
      phone: "5551010101",
    });

    const field = await Field.create({
      name: "Yasak Saha",
      location: "Besiktas",
      address: "Adres 2",
      price: 950,
      fields: [1],
      operator: owner._id,
    });

    const response = await request(app)
      .put(`/api/fields/${field._id}`)
      .set(authHeader(otherOperator))
      .send({ name: "Guncel" });

    expect(response.status).toBe(404);
  });

  it("adds a single review per user and returns updated slots", async () => {
    const operator = await createUser({ role: "operator" });
    const customer = await createUser();

    const field = await Field.create({
      name: "Review Saha",
      location: "Maltepe",
      address: "Adres 3",
      price: 800,
      fields: [1],
      operator: operator._id,
    });

    const firstReview = await request(app)
      .post(`/api/fields/${field._id}/reviews`)
      .set(authHeader(customer))
      .send({ rating: 5, comment: "Cok iyi saha" });

    expect(firstReview.status).toBe(201);

    const duplicateReview = await request(app)
      .post(`/api/fields/${field._id}/reviews`)
      .set(authHeader(customer))
      .send({ rating: 4, comment: "Ikinci yorum" });

    expect(duplicateReview.status).toBe(400);

    await Reservation.create({
      user: customer._id,
      field: field._id,
      fieldNumber: 1,
      date: "2026-04-01",
      hour: "09:00",
      status: "confirmed",
      activeSlot: true,
      slotKey: `${field._id}:1:2026-04-01:09:00`,
    });

    const slotsResponse = await request(app).get(
      `/api/fields/${field._id}/available-slots?date=2026-04-01&fieldNumber=1`
    );

    expect(slotsResponse.status).toBe(200);
    expect(slotsResponse.body.find((slot) => slot.time === "09:00").booked).toBe(true);
  });

  it("allows only owner or admin to cancel and frees the slot again", async () => {
    const operator = await createUser({ role: "operator" });
    const owner = await createUser();
    const stranger = await createUser({
      email: "stranger@example.com",
      phone: "5554445566",
    });

    const field = await Field.create({
      name: "Rezervasyon Saha",
      location: "Sisli",
      address: "Adres 4",
      price: 1000,
      fields: [1],
      operator: operator._id,
    });

    const createReservationResponse = await request(app)
      .post("/api/reservations")
      .set(authHeader(owner))
      .send({
        field: field._id.toString(),
        fieldNumber: 1,
        date: "2026-04-02",
        hour: "10:00",
      });

    expect(createReservationResponse.status).toBe(201);
    const reservationId = createReservationResponse.body.reservation._id;

    const forbiddenCancelResponse = await request(app)
      .patch(`/api/reservations/${reservationId}/cancel`)
      .set(authHeader(stranger));

    expect(forbiddenCancelResponse.status).toBe(403);

    const ownerCancelResponse = await request(app)
      .patch(`/api/reservations/${reservationId}/cancel`)
      .set(authHeader(owner));

    expect(ownerCancelResponse.status).toBe(200);
    expect(ownerCancelResponse.body.reservation.status).toBe("cancelled");

    const secondReservationResponse = await request(app)
      .post("/api/reservations")
      .set(authHeader(owner))
      .send({
        field: field._id.toString(),
        fieldNumber: 1,
        date: "2026-04-02",
        hour: "10:00",
      });

    expect(secondReservationResponse.status).toBe(201);
  });
});
