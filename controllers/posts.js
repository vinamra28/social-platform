const Error = require("../errors");

//load input validation
const validatePostInput = require("../validations/post");

//load Post model
const PostModel = require("../models/post");

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
  async createPost(userId, userbody) {
    try {
      //validate post data
      const { errors, isValid } = validatePostInput(userbody);

      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }
      const postFields = {};
      postFields.user = userId.id;
      postFields.text = userbody.text;
      if (userbody.name) postFields.name = userbody.name;
      if (userbody.name) postFields.avatar = userbody.name;
      const newPost = new PostModel(postFields);
      let result = newPost.save();
      return result;
    } catch (err) {
      return Promise.reject(Error.internal("Internal server error"));
    }
  }
}
module.exports = Posts;
