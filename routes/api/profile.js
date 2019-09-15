const express = require("express");
const router = express.Router();
const Error = require("../../errors");
const apiHandler = require("../../apiHandler");
const passport = require("passport");
const Profile = require("../../controllers/profile");

/**
 * @route   GET api/profile/test
 * @desc    Tests profile route
 * @access  Public
 */
router.get("/test", async (req, res) => {
  try {
    let profileService = new Profile();
    let response = await profileService.testProfile();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route GET api/profile/
 * @desc Get current user's profile
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profileService = new Profile();
      let response = await profileService.getProfile(req);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route POST api/profile
 * @desc Create user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profileService = new Profile();
      let response = await profileService.createProfile(req.user.id, req.body);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);

module.exports = router;
