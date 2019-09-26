const express = require("express");
const router = express.Router();
const Error = require("../../errors");
const apiHandler = require("../../apiHandler");
const Posts = require("../../controllers/posts");
const passport = require("passport");

/**
 * @route   GET api/user/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", async (req, res) => {
  try {
    let postsService = new Posts();
    let response = await postsService.testUser();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post(

  "/",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {

    try {

      let postsService = new Posts();

      let response = await postsService.createPost(req.user, req.body);

      apiHandler(req, res, Promise.resolve(response));

    } catch (err) {

      console.log(err);

      apiHandler(req, res, Promise.reject(err));

    }

  }

);

module.exports = router;