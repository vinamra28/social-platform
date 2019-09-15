const express = require("express");
const router = express.Router();
const Error = require("../../errors");
const apiHandler = require("../../apiHandler");
const User = require("../../controllers/user");
const passport = require("passport");

/**
 * @route   GET api/user/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", async (req, res) => {
  try {
    let userService = new User();
    let response = await userService.testUser();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

/**
 * @route   POST api/user/register
 * @desc    Register user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    let userService = new User();
    let response = await userService.createUser(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route   POST api/user/login
 * @desc    Login user return the token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    let userService = new User();
    let response = await userService.loginUser(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route   GET api/user/current
 * @desc    Return the current user
 * @access  Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let response = {};
      response.id = req.user.id;
      response.name = req.user.name;
      response.email = req.user.email;
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      console.log(err);
      apiHandler(req, res, Promise.reject(err));
    }
  }
);

module.exports = router;
