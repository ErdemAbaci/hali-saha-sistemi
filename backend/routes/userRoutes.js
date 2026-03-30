const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const userController = require("../controllers/userController");
const {
  updateProfileSchema,
  updateUserRoleBodySchema,
  updateUserRoleParamsSchema,
} = require("../validators/userValidators");

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, validate(updateProfileSchema), userController.updateProfile);
router.put("/update", protect, validate(updateProfileSchema), userController.updateProfile);

router.get("/admin/users", protect, checkRole(["admin"]), userController.getAdminUsers);

router.get(
  "/operator/users",
  protect,
  checkRole(["operator", "admin"]),
  userController.getOperatorUsers
);

router.put(
  "/admin/users/:id/role",
  protect,
  checkRole(["admin"]),
  validate(updateUserRoleParamsSchema, "params"),
  validate(updateUserRoleBodySchema),
  userController.updateUserRole
);

module.exports = router;
