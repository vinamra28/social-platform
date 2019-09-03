const express = require("express");
const router = express.Router();

const userRoutes = require("./api/user");
router.use("/user/", userRoutes);

module.exports = router;
