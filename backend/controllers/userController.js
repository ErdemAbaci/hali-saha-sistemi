const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.json(user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.json(user);
});

exports.getAdminUsers = asyncHandler(async (req, res) => {
  const users = await userService.listAllUsers();
  res.json(users);
});

exports.getOperatorUsers = asyncHandler(async (req, res) => {
  const users = await userService.listOperatorVisibleUsers();
  res.json(users);
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  res.json(user);
});
