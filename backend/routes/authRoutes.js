const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createAdminSchema,
  loginSchema,
  registerSchema,
} = require("../validators/authValidators");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  validate(createAdminSchema),
  authController.createAdmin
);

module.exports = router;
