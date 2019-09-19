const Error = require("../errors");

const PostModel = require("../models/post");

//Load validations
const postValidationData = require("../validations/post");

class Posts {
  /**
   * @route   GET api/posts/test
   * @desc    Tests posts route
   * @access  Public
   */
  async testProfile() {
    try {
      return { msg: "posts works" };
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  /**
   * @route   POST api/posts/
   * @desc    Create post
   * @access  Private
   */
  async createPost(userId, postData) {
    try {
      const { error, isValid } = postValidationData(postData);
      if (!isValid) {
        return Promise.reject(Error.badRequest(error));
      }
      const newPost = new PostModel({
        text: postData.text,
        name: postData.name,
        avatar: postData.name,
        user: userId.id
      });
      let savePost = await newPost.save();
      if (savePost) {
        return savePost;
      } else {
        return { status: "please try again" };
      }
    } catch (err) {
      return Promise.reject(Error.internal("Internal error"));
    }
  }
}

module.exports = Posts;
