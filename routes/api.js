const express = require("express");
const router = express.Router();

const userRoutes = require("./api/user");
const profileRoutes = require("./api/profile");
// const postsRoutes = require("./api/posts");

router.use("/user/", userRoutes);
router.use("/profile/", profileRoutes);
// router.use("/posts/", postsRoutes);

module.exports = router;
