const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// List students with search & sort
router.get("/", async (req, res) => {
  const { search, sort } = req.query;
  let query = {};
  if (search) {
    query = { $or: [{ name: new RegExp(search, "i") }, { department: new RegExp(search, "i") }] };
  }

  let students = await Student.find(query);
  if (sort === "gpa") students = students.sort((a, b) => b.gpa - a.gpa);
  if (sort === "name") students = students.sort((a, b) => a.name.localeCompare(b.name));

  res.render("students", { students, message: req.flash("success") });
});

// Add student form
router.get("/add", (req, res) => res.render("addStudent"));

// Create student
router.post("/add", async (req, res) => {
  try {
    await Student.create(req.body);
    req.flash("success", "Student added successfully!");
    res.redirect("/students");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Show student details
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("studentDetails", { student });
});

// Edit form
router.get("/edit/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("editStudent", { student });
});

// Update
router.put("/edit/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  req.flash("success", "Student updated successfully!");
  res.redirect("/students");
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash("success", "Student deleted successfully!");
  res.redirect("/students");
});

module.exports = router;
