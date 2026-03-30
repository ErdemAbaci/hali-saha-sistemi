jest.mock("../utils/stripeClient", () => ({
  createPaymentIntent: jest.fn(),
  createRefund: jest.fn(),
  retrievePaymentIntent: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const Field = require("../models/field");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");
const Subscription = require("../models/Subscription");
const SubscriptionPackage = require("../models/SubscriptionPackage");
const stripeClient = require("../utils/stripeClient");
const { authHeader, createUser } = require("./helpers/auth");

describe("Payment and subscription flows", () => {
  beforeEach(() => {
    stripeClient.createPaymentIntent.mockReset();
    stripeClient.createRefund.mockReset();
    stripeClient.retrievePaymentIntent.mockReset();
  });

  it("creates a reservation payment and stays idempotent on duplicate click", async () => {
    const operator = await createUser({ role: "operator" });
    const customer = await createUser();

    const field = await Field.create({
      name: "Odeme Saha",
      location: "Atasehir",
      address: "Adres 5",
      price: 1500,
      fields: [1],
      operator: operator._id,
    });

    stripeClient.createPaymentIntent.mockResolvedValue({
      id: "pi_reservation_1",
      status: "succeeded",
    });

    const payload = {
      paymentMethodId: "pm_card_visa",
      amount: 1500,
      fieldId: field._id.toString(),
      fieldNumber: 1,
      date: "2026-04-03",
      hour: "11:00",
    };

    const firstResponse = await request(app)
      .post("/api/payments/create")
      .set(authHeader(customer))
      .send(payload);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.success).toBe(true);

    const secondResponse = await request(app)
      .post("/api/payments/create")
      .set(authHeader(customer))
      .send(payload);

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.paymentId).toEqual(firstResponse.body.paymentId);

    expect(await Payment.countDocuments()).toBe(1);
    expect(await Reservation.countDocuments()).toBe(1);

    stripeClient.retrievePaymentIntent.mockResolvedValue({
      id: "pi_reservation_1",
      status: "succeeded",
    });

    const statusResponse = await request(app)
      .get(`/api/payments/status/${firstResponse.body.paymentId}`)
      .set(authHeader(customer));

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe("succeeded");
  });

  it("refunds when payment succeeds but slot is already locked", async () => {
    const operator = await createUser({ role: "operator" });
    const customer = await createUser();

    const field = await Field.create({
      name: "Conflict Saha",
      location: "Umraniye",
      address: "Adres 6",
      price: 1300,
      fields: [1],
      operator: operator._id,
    });

    await Reservation.create({
      user: customer._id,
      field: field._id,
      fieldNumber: 1,
      date: "2026-04-03",
      hour: "12:00",
      status: "confirmed",
      activeSlot: true,
      slotKey: `${field._id}:1:2026-04-03:12:00`,
    });

    stripeClient.createPaymentIntent.mockResolvedValue({
      id: "pi_reservation_conflict",
      status: "succeeded",
    });

    stripeClient.createRefund.mockResolvedValue({ id: "re_1" });

    const response = await request(app)
      .post("/api/payments/create")
      .set(authHeader(customer))
      .send({
        paymentMethodId: "pm_card_visa",
        amount: 1300,
        fieldId: field._id.toString(),
        fieldNumber: 1,
        date: "2026-04-03",
        hour: "12:00",
      });

    expect(response.status).toBe(400);
    expect(stripeClient.createRefund).toHaveBeenCalledWith({
      payment_intent: "pi_reservation_conflict",
    });
  });

  it("creates subscription payment, exposes active subscription and uses one right", async () => {
    const operator = await createUser({ role: "operator" });
    const customer = await createUser();

    const field = await Field.create({
      name: "Abonelik Saha",
      location: "Kartal",
      address: "Adres 7",
      price: 900,
      fields: [1],
      operator: operator._id,
    });

    const subscriptionPackage = await SubscriptionPackage.create({
      name: "Aylik",
      duration: 1,
      price: 3000,
      matchCount: 3,
      description: "3 mac",
      isActive: true,
    });

    stripeClient.createPaymentIntent.mockResolvedValue({
      id: "pi_subscription_1",
      status: "succeeded",
    });

    const purchaseResponse = await request(app)
      .post("/api/payments/create-subscription")
      .set(authHeader(customer))
      .send({
        paymentMethodId: "pm_card_visa",
        amount: 3000,
        packageId: subscriptionPackage._id.toString(),
      });

    expect(purchaseResponse.status).toBe(200);
    expect(purchaseResponse.body.success).toBe(true);

    const activeSubscriptionResponse = await request(app)
      .get("/api/subscriptions/user")
      .set(authHeader(customer));

    expect(activeSubscriptionResponse.status).toBe(200);
    expect(activeSubscriptionResponse.body.remainingMatches).toBe(3);

    const useRightResponse = await request(app)
      .post("/api/subscriptions/use-subscription-right")
      .set(authHeader(customer))
      .send({
        fieldId: field._id.toString(),
        halisahaId: field._id.toString(),
        fieldNumber: 1,
        date: "2026-04-04",
        hour: "19:00",
      });

    expect(useRightResponse.status).toBe(200);
    expect(useRightResponse.body.success).toBe(true);

    const subscription = await Subscription.findById(purchaseResponse.body.subscriptionId);
    expect(subscription.remainingMatches).toBe(2);

    const cancelResponse = await request(app)
      .delete(`/api/subscriptions/${subscription._id}`)
      .set(authHeader(customer));

    expect(cancelResponse.status).toBe(200);
  });
});
