const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET a single user
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      // Unique violation in PostgreSQL
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE a user
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const updatedUser = await User.update(id, { name, email });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedUser = await User.delete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
