const express = require("express");
const { addFee, getFeesHistory, getAllPayment } = require("../controllers/fees");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router()

router.post("/add-fees", checkAuth, addFee)
router.get("/payment-history", checkAuth, getFeesHistory)
router.get("/all-payment", checkAuth, getAllPayment)
module.exports = router;