const express = require("express");
const router = express.Router();
const Error = require("../../errors");
const apiHandler = require("../../apiHandler");
const Posts = require("../../controllers/posts");
const passport = require("passport");

/**
 * @route   GET api/posts/test
 * @desc    Tests posts route
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
 * @route GET api/posts/
 * @desc Get all post
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    let postService = new Posts();
    let response = await postService.getAllPost();
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route GET api/posts/:id
 * @desc Get post by post ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    let postService = new Posts();
    let response = await postService.getPostById(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
/**
 * @route DELETE api/posts/:id
 * @desc Delete the post by ID
 * @access Private
 */
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
 * @route POST api/posts/like/:id
 * @desc Like the post
 * @access Private
 */
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postsService = new Posts();
      let response = await postsService.likePost(req.user, req.params.id);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route POST api/posts/dislike/:id
 * @desc Dislike the post
 * @access Private
 */
router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postsService = new Posts();
      let response = await postsService.dislikePost(req.user, req.params.id);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route POST api/posts/comment/:id
 * @desc Add a comment to the post
 * @access Private
 */
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postsService = new Posts();
      let response = await postsService.addComment(
        req.user,
        req.params.id,
        req.body
      );
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);
/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @desc Remove a comment from the post
 * @access Private
 */
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postsService = new Posts();
      let response = await postsService.deleteComment(req.user, req.params);
      apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
      apiHandler(req, res, Promise.reject(err));
    }
  }
);

module.exports = router;
