const Course = require("../models/course")
const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const Student = require("../models/studem")
cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});
const addCourse = async (req, res) => {
              try {
                            const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                            const token = req.headers.authorization.split(" ")[1]
                            const user = await jwt.verify(token, 'shivam 123')
                            const course = new Course({
                                          _id: new mongoose.Types.ObjectId,
                                          courseName: req.body.courseName,
                                          price: req.body.price,
                                          startingDate: req.body.startingDate,
                                          endDate: req.body.endDate,
                                          user_id: user._id,
                                          imageUrl: uploadedImage.secure_url,
                                          imageId: uploadedImage.public_id,
                                          description: req.body.description

                            })
                            await course.save();
                            res.json({
                                          success: true,
                                          message: "Course is created successfully",
                                          course: course
                            })



              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}


const getAllCourses = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1]
                            const user = await jwt.verify(token, 'shivam 123')
                            const course = await Course.find({ user_id: user._id })
                            res.json({
                                          success: true,
                                          message: "All courses",
                                          courses: course
                            })

              }
              catch (err) {
                            res.json({
                                          success: tfalse,
                                          message: err.message
                            })
              }
}

// const deleteCourse = async (req, res) => {
//               try {
//                             const token = req.headers.authorization.split(" ")[1]
//                             const user = await jwt.verify(token, 'shivam 123')
//                             const course = await Course.findById(req.params.courseId)
//                             if (course.user_id.toString() !== user._id) {
//                                           return res.json({
//                                                         success: false,
//                                                         message: "Invalid Credentials"
//                                           })
//                             }

//                             cloudinary.uploader.destroy(course.imageId)
//                             const deleteCourse = await Course.findByIdAndDelete(req.params.courseId);
//                             res.json({
//                                           success: true,
//                                           message: "Course deleted Successfully",
//                                           deletedCourse: deleteCourse
//                             })

//               }
//               catch (err) {
//                             res.json({
//                                           success: false,
//                                           message: err.message
//                             })
//               }
// }



const deleteCourse = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');

                            const course = await Course.findById(req.params.courseId);
                            if (!course) {
                                          return res.status(404).json({
                                                        success: false,
                                                        message: "Course not found"
                                          });
                            }

                            if (course.user_id.toString() !== user._id) {
                                          return res.status(403).json({
                                                        success: false,
                                                        message: "Unauthorized action"
                                          });
                            }

                            await cloudinary.uploader.destroy(course.imageId);

                            const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
                            const deletedStudents = await Student.deleteMany({
                                          courseId: req.params.courseId
                            });

                            res.json({
                                          success: true,
                                          message: "Course deleted successfully",
                                          deletedCourse: deletedCourse,
                                          deletedStudents: deletedStudents
                            });

              } catch (err) {
                            console.error(err);
                            res.status(500).json({
                                          success: false,
                                          message: err.message
                            });
              }
};

const getCourseDetails = async (req, res) => {
              try {
                            const course = await Course.findById(req.params.courseId).select('_id user_id courseName description price startingDate endDate imageUrl imageId');
                            const student = await Student.find({ courseId: req.params.courseId })
                            if (!course) {
                                          return res.json({
                                                        success: false,
                                                        message: "Course not found"
                                          })
                            }
                            res.json({
                                          success: true,
                                          message: "Course detals here",
                                          course: course,
                                          student: student
                            })


              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
const updateCourse = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const course = await Course.findById(req.params.courseId);
                            console.log(user._id)
                            console.log(course.user_id)
                            if (!course) {
                                          return res.json({
                                                        success: false,
                                                        message: "Course not found"
                                          });
                            }

                            if (course.user_id.toString() !== user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "You do not have permission to update this course"
                                          });
                            }
                            else {
                                          const updatedData = {
                                                        courseName: req.body.courseName,
                                                        description: req.body.description,
                                                        price: req.body.price,
                                                        startingDate: req.body.startingDate,
                                                        endDate: req.body.endDate,
                                                        user_id: user._id,
                                                        imageUrl: course.imageUrl,
                                                        imageId: course.imageId
                                          };

                                          if (req.files && req.files.image) {
                                                        await cloudinary.uploader.destroy(course.imageId);
                                                        const updatedThumbnail = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                                                        updatedData.imageUrl = updatedThumbnail.secure_url;
                                                        updatedData.imageId = updatedThumbnail.public_id;
                                          }

                                          const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, updatedData, { new: true });
                                          console.log(updatedCourse);

                                          res.json({
                                                        success: true,
                                                        message: "Course updated successfully",
                                                        course: updatedCourse
                                          });

                            }


              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};

const getSomeCourses = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const courses = await Course.find({ user_id: user._id }).sort({ $natural: -1 }).limit(5)
                                          .select('_id user_id fullName phone address email imageUrl imageId');

                            if (!courses || courses.length === 0) {
                                          return res.json({
                                                        success: false,
                                                        message: "No Course found"
                                          });
                            }

                            res.json({
                                          success: true,
                                          message: "All Course",
                                          course: courses
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}


const homeCourse = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, "shivam 123");

                            const course = await Course.find({ user_id: user._id })
                                          .sort({ $natural: -1 })
                                          .limit(5);

                            const students = await Student.find({ user_id: user._id })
                                          .sort({ $natural: -1 })
                                          .limit(5);

                            const totalCourse = await Course.countDocuments({ user_id: user._id });
                            const totalStudent = await Student.countDocuments({ user_id: user._id });
                         
                            res.json({
                                          success: true,
                                          courses: course,
                                          students: students,
                                          totalCourse: totalCourse, // Include total courses in response
                                          totalStudent:totalStudent
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};
module.exports = { addCourse, getAllCourses, deleteCourse, updateCourse, getCourseDetails, getSomeCourses, homeCourse }
