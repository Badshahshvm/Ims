const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
              _id: mongoose.Types.ObjectId,
              courseName: {
                            type: String, required: true
              },
              price: {
                            type: Number, required: true
              },
              description: {
                            type: String,
                            required: true
              },
              imageId:
              {
                            type: String,
                            required: true

              },
              imageUrl:
              {
                            type: String, required: true
              },
              startingDate:
              {
                            type: String,
                            required: true
              },
              endDate:
              {
                            type: String,
                            required: true
              },
              user_id:
              {
                            type: String, required: true
              }

},
              {
                            timestamps: true
              })

const courseModel = mongoose.model("Course", courseSchema)
module.exports = courseModel