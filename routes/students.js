const express = require("express");
const { addStudent, getAllStudents, getStudentForCourse, deleteStudent, updateStudent, getLatestFiveStudent } = require("../controllers/student");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router()

router.post("/add-student", addStudent)
router.get("/all", checkAuth, getAllStudents)
router.get("/all/:courseId", checkAuth, getStudentForCourse)
router.delete("/:studentId", checkAuth, deleteStudent)
router.put("/:studentId", checkAuth, updateStudent)
router.get("/latest-student", checkAuth, getLatestFiveStudent)
router.get("/student-detail/:studentId", checkAuth, getStudent)
module.exports = router
