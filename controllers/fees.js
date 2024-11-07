const Fees = require("../models/fees")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const addFee = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');

                            const fee = new Fees({
                                          _id: new mongoose.Types.ObjectId,
                                          fullName: req.body.fullName,
                                          phone: req.body.phone,
                                          courseId: req.body.courseId,
                                          user_id: user._id,
                                          amount: req.body.amount,
                                          remark: req.body.remark

                            })

                            if (!fee) {
                                          return res.json({
                                                        success: false,
                                                        message: "failed"
                                          })
                            }

                            await fee.save();
                            res.json({
                                          success: true,
                                          message: "payment is done",
                                          fee: fee
                            })

              }

              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
const getFeesHistory = async (req, res) => {
              try {
                            const token = req.headers.authorization?.split(" ")[1];
                            if (!token) {
                                          return res.status(401).json({
                                                        success: false,
                                                        message: "Authorization token missing"
                                          });
                            }

                            // Verify the token
                            const user = jwt.verify(token, 'shivam 123');
                            const fee = await Fees.find({ user_id: user._id });

                            if (!fee) {
                                          return res.status(404).json({
                                                        success: false,
                                                        message: "Fees history not found"
                                          });
                            }

                            res.json({
                                          success: true,
                                          history: fee
                            });

              } catch (err) {
                            res.status(500).json({
                                          success: false,
                                          message: err.message
                            });
              }
};

const getAllPayment = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');

                            const fee = await Fees.find({
                                          user_id: user._id, courseId: req.query.courseId, phone: req.query.phone
                            })
                            res.json({
                                          success: true,
                                          message: "All payment history",
                                          history: fee
                            })


              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
module.exports = { addFee, getFeesHistory, getAllPayment }