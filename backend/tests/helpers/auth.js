const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const userCounter = {
  value: 0,
};

const createUser = async (overrides = {}) => {
  userCounter.value += 1;
  const suffix = userCounter.value;

  const password = overrides.password || "secret123";
  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    name: overrides.name || `Test User ${suffix}`,
    email: overrides.email || `user${suffix}@example.com`,
    phone: overrides.phone || `555000${String(suffix).padStart(4, "0")}`,
    password: hashedPassword,
    role: overrides.role || "customer",
  });
};

const buildToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const authHeader = (user) => ({
  Authorization: `Bearer ${buildToken(user)}`,
});

module.exports = {
  authHeader,
  buildToken,
  createUser,
};
