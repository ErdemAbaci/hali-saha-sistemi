const { authorize } = require("./authMiddleware");

const checkRole = (roles = []) => authorize(...roles);

module.exports = checkRole;
