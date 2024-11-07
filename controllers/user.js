const mongoose = require("mongoose");
const User = require("../models/user")
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});
const signup = async (req, res) => {
              try {

                            User.find({ email: req.body.email }).then((users) => {
                                          if (users.length > 0) {
                                                        return res.json({
                                                                      success: false,
                                                                      message: "User already registered"
                                                        })
                                          }
                            })
                            const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                            const hashPassword = await bcrypt.hash(req.body.password, 10);

                            const user = new User({
                                          _id: new mongoose.Types.ObjectId(),
                                          firstName: req.body.firstName,
                                          lastName: req.body.lastName,
                                          email: req.body.email,
                                          password: hashPassword,
                                          imageUrl: uploadedImage.secure_url,
                                          imageId: uploadedImage.public_id
                            });


                            await user.save();

                            // Send a success response
                            res.json({
                                          success: true,
                                          message: "Signup successfully",
                                          user: user,
                                          token: token
                            });
              } catch (err) {

                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
}

const login = async (req, res) => {
              try {
                            console.log(req.body);
                            const users = await User.find({ email: req.body.email });

                            if (users.length === 0) {
                                          return res.json({
                                                        success: false,
                                                        message: "User not found"
                                          });
                            }

                            const isPassword = await bcrypt.compare(req.body.password, users[0].password);

                            if (!isPassword) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid password"
                                          });
                            }

                            const token = jwt.sign({
                                          _id: users[0]._id,

                                          email: users[0].email,

                                          imageId: users[0].logoId,
                                          imageUrl: users[0].logoUrl
                            }, 'shivam 123', { expiresIn: '365d' });

                            res.json({
                                          success: true,
                                          message: "Successfully logged in",
                                          user: users[0],
                                          token: token
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};


const logout = async (req, res) => {
              try {
                            const { token } = req.body;
                            const user = await User.findOne({ token: token });
                            if (!user) {
                                          res.json({
                                                        success: false,
                                                        message: "User not found"
                                          })
                            }
                            user.token = null; // Remove the token from the user record
                            await user.save();

                            res.json({
                                          success: true,
                                          message: "User logged out successfully"
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}


module.exports = { signup, login, logout }