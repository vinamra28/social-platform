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
/**
 * @route   POST api/posts/
 * @desc    Create post
 * @access  Private
 */
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
/**
 * @route GET api/post/user/:id
 * @desc Get post by user ID
 * @access Public
 */
router.get("/post/:id", async (req, res) => {
  try {
    let postService = new Posts();
    let response = await postService.getPostById(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postService = new Posts();
      let response = await postService.deletePostById(req.user, req.params.id);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route GET api/post/all
 * @desc Get all post
 * @access Public
 */
router.get("/all", async (req, res) => {
  try {
    let postService = new Post();
    let response = await postService.getAllPost();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;
