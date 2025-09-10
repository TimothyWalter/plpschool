
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");

let users = [
  { _id: "1", email: "customer@example.com", role: "customer" },
  { _id: "2", email: "trader@example.com", role: "trader" },
  { _id: "3", email: "admin@example.com", role: "admin" }
];

// GET /api/users -> list all users
router.get("/", verifyToken, verifyAdmin, (req, res) => {
  res.json(users);
});

// PATCH /api/users/:id/role -> change role
router.patch("/:id/role", verifyToken, verifyAdmin, (req, res) => {
  const { role } = req.body;
  const user = users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.role = role;
  res.json({ message: "Role updated", user });
});

module.exports = router;
