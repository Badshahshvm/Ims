const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const { addCourse, getAllCourses, deleteCourse, updateCourse, getCourseDetails, getSomeCourses, homeCourse } = require("../controllers/course");
const router = express.Router()

router.post("/create-course", checkAuth, addCourse)
router.get("/all", getAllCourses)
router.delete("/delete/:courseId", checkAuth, deleteCourse)
router.put("/update/:courseId", checkAuth, updateCourse)
router.get("/course-details/:courseId", checkAuth, getCourseDetails)
router.get("/latest-course", checkAuth, getSomeCourses)
router.get("/home", checkAuth, homeCourse)
module.exports = router
