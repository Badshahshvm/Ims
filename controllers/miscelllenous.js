const User = require("../models/user")
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const mongoose = require("mongoose");

const adminStats = async (req, res) => {
              try {

                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, 'shivam 123');
                            if (verifyUser.role != 'Admin') {
                                          res.json({
                                                        success: false,
                                                        message: "UnAuthorized Action"
                                          })
                            }
                            const allUsersCount = await User.countDocuments();

                            const subscribedUsersCount = await User.countDocuments({
                                          'subscription.status': 'active',
                            });

                            res.status(200).json({
                                          success: true,
                                          message: 'All registered users count',
                                          users: allUsersCount,
                                          subscribe: subscribedUsersCount,
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

module.exports = { adminStats }