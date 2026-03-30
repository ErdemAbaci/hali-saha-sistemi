const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");

const Field = require("../models/field");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");
const Subscription = require("../models/Subscription");
const SubscriptionPackage = require("../models/SubscriptionPackage");
const SubscriptionPayment = require("../models/SubscriptionPayment");
const User = require("../models/user");

let mongoReplicaSet;

beforeAll(async () => {
  mongoReplicaSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });

  process.env.MONGO_URI = mongoReplicaSet.getUri();

  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    Field.syncIndexes(),
    Payment.syncIndexes(),
    Reservation.syncIndexes(),
    Subscription.syncIndexes(),
    SubscriptionPackage.syncIndexes(),
    SubscriptionPayment.syncIndexes(),
    User.syncIndexes(),
  ]);
});

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections);

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoReplicaSet) {
    await mongoReplicaSet.stop();
  }
});
