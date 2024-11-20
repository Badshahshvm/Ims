const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const { adminStats } = require("../controllers/miscelllenous");
router.get("/stats", checkAuth, adminStats)
module.exports = router;