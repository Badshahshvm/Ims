const Student = require("../models/studem")
const mongoose = require("mongoose")
const Course = require("../models/course")
const Fee = require("../models/fees")
require("dotenv").config()
const cloudinary = require("cloudinary").v2

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});

const addStudent = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath)
                            const student = new Student({
                                          _id: new mongoose.Types.ObjectId,
                                          fullName: req.body.fullName,
                                          email: req.body.email,
                                          phone: req.body.phone,
                                          address: req.body.address,
                                          courseId: req.body.courseId,
                                          user_id: user._id,
                                          imageUrl: uploadedImage.secure_url,
                                          imageId: uploadedImage.public_id

                            })
                            await student.save();
                            res.json({
                                          success: true,
                                          message: "Student is enrolled",
                                          student: student
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          mssage: err.message
                            })
              }
}
const getAllStudents = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const students = await Student.find({ user_id: user._id })
                                          .select('_id user_id fullName phone address email imageUrl imageId');

                            if (!students || students.length === 0) {
                                          return res.json({
                                                        success: false,
                                                        message: "No students found"
                                          });
                            }

                            res.json({
                                          success: true,
                                          message: "All Students",
                                          students: students
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};



 const getStudent = async (req, res) => {
              try {
                            const authHeader = req.headers.authorization;
                            if (!authHeader) {
                                          return res.status(401).json({ success: false, message: "Authorization header missing" });
                            }

                            const token = authHeader.split(" ")[1];
                            const user = jwt.verify(token, 'shivam 123');

                            const student = await Student.findById(req.params.studentId)
                                          .select('_id user_id fullName phone address email imageUrl imageId courseId');

                            if (!student) {
                                          return res.status(404).json({ success: false, message: "No student found" });
                            }

                            const course = await Course.findById(student.courseId);
                            const fee = await Fee.find({
                                          user_id: user._id,
                                          courseId: student.courseId,
                                          phone: student.phone
                            });

                            res.json({
                                          success: true,
                                          message: "Student and Course Details",
                                          student: student,
                                          course: course,
                                          fee: fee
                            });
              } catch (err) {
                            res.status(500).json({
                                          success: false,
                                          message: err.message,
                            });
              }
};




const getStudentForCourse = async (req, res) => {
              try {

                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const students = await Student.find({ user_id: user._id, courseId: req.params.courseId }).select('_id user_id fullName phone address email imageUrl imageId');
                            if (!students || students.length === 0) {
                                          return res.json({
                                                        success: false,
                                                        message: "No students found"
                                          });
                            }

                            res.json({
                                          success: true,
                                          message: "All Students",
                                          students: students
                            });


              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
const deleteStudent = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const student = await Student.findById(req.params.studentId);

                            if (!student) {
                                          return res.json({
                                                        success: false,
                                                        message: "Student not found"
                                          });
                            }

                            if (student.user_id.toString() !== user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid Credentials"
                                          });
                            }

                            await cloudinary.uploader.destroy(student.imageId);
                            const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);

                            res.json({
                                          success: true,
                                          message: "Student deleted successfully",
                                          deletedStudent: deletedStudent
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};

const updateStudent = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const student = await Student.findById(req.params.studentId);

                            if (!student) {
                                          return res.json({
                                                        success: false,
                                                        message: "Student not found"
                                          });
                            }

                            if (student.user_id.toString() !== user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "You do not have permission to update this student"
                                          });
                            }

                            const updatedData = {
                                          fullName: req.body.fullName,
                                          email: req.body.email,
                                          phone: req.body.phone,
                                          address: req.body.address,
                                          courseId: req.body.courseId,
                                          user_id: user._id,
                                          imageUrl: student.imageUrl,
                                          imageId: student.imageId
                            };

                            if (req.files && req.files.image) {
                                          await cloudinary.uploader.destroy(student.imageId);
                                          const updatedThumbnail = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                                          updatedData.imageUrl = updatedThumbnail.secure_url;
                                          updatedData.imageId = updatedThumbnail.public_id;
                            }

                            const updatedStudent = await Student.findByIdAndUpdate(req.params.studentId, updatedData, { new: true });
                            console.log(updatedStudent);

                            res.json({
                                          success: true,
                                          message: "Student updated successfully",
                                          student: updatedStudent
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};
const getLatestFiveStudent = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const students = await Student.find({ user_id: user._id }).sort({ $natural: -1 }).limit(5)
                                          .select('_id user_id fullName phone address email imageUrl imageId');

                            if (!students || students.length === 0) {
                                          return res.json({
                                                        success: false,
                                                        message: "No students found"
                                          });
                            }

                            res.json({
                                          success: true,
                                          message: "All Students",
                                          students: students
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
module.exports = { addStudent, getAllStudents, getStudentForCourse, deleteStudent, updateStudent, getLatestFiveStudent , getStudent}
