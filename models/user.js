const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
              _id: mongoose.Schema.Types.ObjectId,
              firstName: {
                            type: String,
                            required: true
              },
              lastName: {
                            type: String,
                            required: true
              },
              email: {
                            type: String,
                            required: true,
                            unique: true
              },
              password: {
                            type: String,
                            required: true
              },
              imageUrl: {
                            type: String,
                            required: true
              },
              imageId: {
                            type: String,
                            required: true
              }
});


const userModel = mongoose.model("Public", userSchema);

module.exports = userModel;
