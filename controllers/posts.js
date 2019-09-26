const Error = require("../errors");
//const Error = require("../errors");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs"); //for hashing the password
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

//load input validation
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");
const validatePostInput = require("../validations/post");

//load User model
const UserModel = require("../models/user");
const PostModel = require("../models/post");

class Posts {
  /**
   * just a simple test function to test the API controller
   */
  async testUser() {
    try {
      return { msg: "posts works" };
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  async createPost(userId,userbody){
    try {
      //validate user details
      const { errors, isValid } = validatePostInput(userbody);

      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }
   const postFields = {};
   postFields.user = userId.id;
   postFields.text = userbody.text;
   if (userbody.name) postFields.name = userbody.name;
   //let foundUser = await PostModel.findOne({ user: userId.id });
   const newPost = new PostModel(postFields);
        let result = newPost.save();
        return result;
    }
   catch (err) {
      return Promise.reject(err);
  }
 }
}
 module.exports = Posts;