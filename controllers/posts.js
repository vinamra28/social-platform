const Error = require("../errors");

//load input validation
const validatePostInput = require("../validations/posts");

//load Post model
const PostModel = require("../models/post");
const ProfileModel = require("../models/profile");

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
  /**
   * @route GET api/posts/:id
   * @desc Get post by post ID
   * @access Public
   */
  async getPostById(postId) {
    try {
      let result = await PostModel.findById(postId);
      if (!result) {
        return Promise.reject(Error.notFound("There is no post for this user"));
      }
      return result;
    } catch (err) {
      return Promise.reject(Error.notFound("There is no post for this user"));
    }
  }
  /**
   * @route DELETE api/posts/:id
   * @desc Delete the post by ID
   * @access Private
   */
  async deletePostById(userId, postId) {
    try {
      let userProfile = await ProfileModel.findOne({ user: userId.id });
      if (userProfile) {
        let userPost = await PostModel.findById(postId);
        if (userPost.user.toString() !== userId.id) {
          return Promise.reject(Error.unauthorized("user not authorized"));
        }
        let userDeleted = userPost.remove();
        if (userDeleted) {
          return { success: true };
        } else {
          return { success: false };
        }
      } else {
        return Promise.reject(Error.badRequest("User not found"));
      }
    } catch (err) {
      return Promise.reject(Error.internal("problem with the server"));
    }
  }
  /**
   * @route GET api/posts/
   * @desc Get all post
   * @access Public
   */
  async getAllPost() {
    try {
      let results = await PostModel.find().sort({ date: -1 });
      console.log(results);
      if (!results) {
        return Promise.reject(Error.notFound("There are no post"));
      }
      return results;
    } catch (err) {
      return Promise.reject(Error.internal("Problem with the server"));
    }
  }
  /**
  
     * @route POST api/posts/like/:id
  
     * @desc Like the post
  
     * @access Private
  
     */
  async likePost(userId, postId) {
    try {
      let likerProfile = await ProfileModel.findOne({ user: userId.id });
      if (likerProfile) {
        let post = await PostModel.findById(postId);
        if (post) {
          if (post.likes.filter(like => like.user.toString() === userId.id).length() > 0) {
            return Promise.reject(Error.badRequest("User already liked this post"));
          }
          post.likes.unshift({ user: userId.id });
          let result = await post.save();
          return result;

        } else {
          return Promise.reject(Error.badRequest("No post found"));

        }

      }

    } catch (err) {

      return Promise.reject(Error.internal("Problem with server"));

    }

  }

  /**
  
   * @route POST api/posts/like/:id
  
   * @desc Like the post
  
   * @access Private
  
   */

  async dislikePost(userId, postId) {

    try {

      let likerProfile = await ProfileModel.findOne({ user: userId.id });

      if (likerProfile) {

        let post = await PostModel.findById(postId);

        if (post) {

          if (

            post.likes

              .filter(like => like.user.toString() === userId.id)

              .length() === 0

          ) {

            return Promise.reject(

              Error.badRequest("You have not yet liked this post")

            );

          }

          // Get remove index

          const removeIndex = post.likes

            .map(item => item.user.toString())

            .indexOf(req.user.id);



          // Splice out of array

          post.likes.splice(removeIndex, 1);

          let result = await post.save();

          return result;

        } else {

          return Promise.reject(Error.badRequest("No post found"));

        }

      }

    } catch (err) {

      return Promise.reject(Error.internal("Problem with server"));

    }
  }
  /**
   * @route POST api/posts/comment/:id
   * @desc Add a comment to the post
   * @access Private
   */
  async addComment(userId, postId, comments) {
    try {
      const { errors, isValid } = validatePostInput(comments);
      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }
      let myPost = PostModel.findById(postId);
      if (myPost) {
        const newComment = {
          text: comments.text,
          name: comments.name,
          avatar: comments.avatar,
          user: userId.id
        };
        myPost.comments.unshift(newComment);
        let result = myPost.save();
        return result;
      }
    } catch (err) {
      return Promise.reject(Error.badRequest("Post not found"));
    }
  }
  /**
   * @route DELETE api/posts/comment/:id/:comment_id
   * @desc Remove a comment from the post
   * @access Private
   */
  async deleteComment(userId, params) {
    try {
      let myPost = await PostModel.findById(params.id);
      if (myPost) {
        // Check to see if comment exists
        if (
          myPost.comments.filter(
            comment => comment._id.toString() === params.comment_id
          ).length === 0
        ) {
          return Promise.reject(Error.notFound("Comment does not exist"));
        }
        // Get remove index
        const removeIndex = myPost.comments
          .map(item => item._id.toString())
          .indexOf(params.comment_id);

        // Splice comment out of array
        myPost.comments.splice(removeIndex, 1);
        return await myPost.save();
      }
    } catch (err) {
      return Promise.reject(Error.notFound("No post found"));
    }
  }

}
module.exports = Posts;
