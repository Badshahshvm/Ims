const mongoose = require("mongoose");
const feesSchema = mongoose.Schema({
              _id: mongoose.Types.ObjectId,
              fullName:
              {
                            type: String,
                            required: true
              },
              phone:
              {
                            type: String, required: true
              },
              user_id:
              {
                            type: String,
                            required: true
              },
              courseId:
              {
                            type: String,
                            required: true
              },
              amount: [{
                            type: Number, required: true
              }],
              remark:
              {
                            type: String, required: true
              }

},
              {
                            timestamps: true
              })

const feesModel = mongoose.model("Fees", feesSchema);
module.exports = feesModel;