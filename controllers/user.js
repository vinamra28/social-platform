const Error = require("../errors");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs"); //for hashing the password
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

//load User model
const UserModel = require("../models/user");

class User {
  /**
   * just a simple test function to test the API controller
   */
  async testUser() {
    try {
      return { msg: "user works" };
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  /**
   * register
   */
  async createUser(userDetails) {
    try {
      let result = await UserModel.findOne({ email: userDetails.email });
      if (result) {
        return Promise.reject(
          Error.badRequest("this user already registered!")
        );
      } else {
        const avatar = gravatar.url(userDetails.email, {
          s: "200", //Size
          r: "pg", //Rating
          d: "mm" //Default
        });
        const newUser = new UserModel({
          name: userDetails.name,
          email: userDetails.email,
          avatar,
          password: userDetails.password
        });
        var salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(newUser.password, salt);
        let result = await newUser.save();
        return { message: "User added successfully" };
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  async loginUser(req) {
    try {
      const email = req.email;
      const password = req.password;
      let result = await UserModel.findOne({ email: email });
      if (!result) {
        return Promise.reject(Error.badRequest("Email not registered!!"));
      }
      let isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) {
        //user matched
        const payload = {
          id: result.id,
          name: result.name,
          avatar: result.avatar
        };
        var myToken = await jwt.sign(payload, keys.secretOrKey, {
          expiresIn: 3600
        });
        return { message: "user found", token: "Bearer " + myToken };
      } else {
        return Promise.reject(Error.badRequest("Password not matched"));
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = User;
