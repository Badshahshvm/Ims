const express = require("express");
require("dotenv").config()
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors');
const user = require("./routes/user")
const course = require("./routes/course")
const Admin = require("./routes/miscellenous")
const fees = require("./routes/fees");
const student = require("./routes/students")
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload")
mongoose.connect(process.env.URI).then(() => {
              console.log("successfully connected")
}).catch((err) => console.log(err))
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
app.use(fileUpload({
              useTempFiles: true,
              // tempFileDir: '/tmp/'
}))
app.use("/api/v1/admin", Admin)
app.use("/api/v1/course", course)
app.use("/api/v1/user", user);
app.use("/api/v1/fees", fees);
app.use("/api/v1/student", student)


app.use("*", (req, res) => {
              res.json({
                            success: false,
                            message: "Bad request"
              })
})
app.listen(process.env.PORT, () => {
              console.log("server is running")
})
