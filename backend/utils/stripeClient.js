const Stripe = require("stripe");
const { getEnv } = require("../config/env");

let stripeClient;

const getStripeClient = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(getEnv().STRIPE_SECRET_KEY);
  }

  return stripeClient;
};

const createPaymentIntent = async (payload, options = {}) => {
  const client = getStripeClient();

  return client.paymentIntents.create(payload, options);
};

const retrievePaymentIntent = async (paymentIntentId) => {
  const client = getStripeClient();

  return client.paymentIntents.retrieve(paymentIntentId);
};

const createRefund = async (payload) => {
  const client = getStripeClient();

  return client.refunds.create(payload);
};

module.exports = {
  createPaymentIntent,
  createRefund,
  retrievePaymentIntent,
};
