const Error = require("../errors");

const ProfileModel = require("../models/profile");
const UserModel = require("../models/user");

class Profile {
  /**
   * @route   GET api/profile/test
   * @desc    Tests profile route
   * @access  Public
   */
  async testProfile() {
    try {
      return { msg: "profile works" };
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  /**
   * @route GET api/profile/
   * @desc Get current user's profile
   * @access Private
   */
  async getProfile(user) {
    try {
      let result = await ProfileModel.findOne({ user: user.id });
      console.log(result);
      if (!result) {
        return Promise.reject(
          Error.notFound("There is no profile for this user")
        );
      }
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  /**
   * @route POST api/profile
   * @desc Create user profile
   * @access Private
   */
  async createProfile(userId, userDetails) {
    //get profile fields
    const profileFields = {};
    profileFields.user = userId;
    if (userdetails.handle) profileFields.handle = userdetails.handle;
    if (userdetails.company) profileFields.company = userdetails.company;
    if (userdetails.website) profileFields.website = userdetails.website;
    if (userdetails.location) profileFields.location = userdetails.location;
    if (userdetails.bio) profileFields.bio = userdetails.bio;
    if (userdetails.status) profileFields.status = userdetails.status;
    if (userdetails.githubusername)
      profileFields.githubusername = userdetails.githubusername;
    //skills-split into array
    if (typeof userDetails.skills !== "undefined") {
      profileFields.skills = userDetails.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (userDetails.youtube) profileFields.social.youtube = userDetails.youtube;
    if (userDetails.twitter) profileFields.social.twitter = userDetails.twitter;
    if (userDetails.facebook)
      profileFields.social.facebook = userDetails.facebook;
    if (userDetails.linkedin)
      profileFields.social.linkedin = userDetails.linkedin;
    if (userDetails.instagram)
      profileFields.social.instagram = userDetails.instagram;

    let foundUser = await ProfileModel.findOne({ user: userId });
    if (foundUser) {
      //Update
      let updateUser = await ProfileModel.findOneAndUpdate(
        { user: userId },
        { $set: profileFields },
        { new: true }
      );
      return updateUser;
    } else {
      //Create

      //Check if handle exists
      const ifHandleExists = await ProfileModel.findOne({
        handle: profileFields.handle
      });
      if (ifHandleExists) {
        return Promise.reject(Error.badRequest("That handle already exists"));
      }
      const newProfile = new ProfileModel(profileFields);
      let result = newProfile.save();
      return result;
    }
  }
}

module.exports = Profile;
