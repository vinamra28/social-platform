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
      let response = await profileService.getProfile(req.user);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route POST api/profile
 * @desc Create or edit user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profileService = new Profile();
      let response = await profileService.createProfile(req.user, req.body);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      console.log("main error");
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle
 * @access Public
 */
router.get("/handle/:handle", async (req, res) => {
  try {
    let profileService = new Profile();
    let response = await profileService.getProfileByHandle(req.params.handle);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route GET api/profile/user/:id
 * @desc Get profile by user ID
 * @access Public
 */
router.get("/user/:id", async (req, res) => {
  try {
    let profileService = new Profile();
    let response = await profileService.getProfileById(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route GET api/profile/all
 * @desc Get all profiles
 * @access Public
 */
router.get("/all", async (req, res) => {
  try {
    let profileService = new Profile();
    let response = await profileService.getAllProfiles();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route POST api/profile/experience
 * @desc Add Experience to profile
 * @access Private
 */
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profileService = new Profile();
      let response = await profileService.addExperince(req.user, req.body);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route POST api/profile/education
 * @desc Add Education to profile
 * @access Private
 */
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profileService = new Profile();
      let response = await profileService.addEducation(req.user, req.body);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);

module.exports = router;
