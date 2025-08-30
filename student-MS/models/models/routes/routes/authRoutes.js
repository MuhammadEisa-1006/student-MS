const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register form
router.get("/register", (req, res) => res.render("register"));
router.post("/register", async (req, res) => {
  await User.create(req.body);
  res.redirect("/login");
});

// Login form
router.get("/login", (req, res) => res.render("login"));
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await user.comparePassword(req.body.password)) {
    res.redirect("/students");
  } else {
    res.send("Invalid credentials");
  }
});

// Homepage
router.get("/", (req, res) => res.render("index"));

module.exports = router;
