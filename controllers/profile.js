const Error = require("../errors");

const ProfileModel = require("../models/profile");
const UserModel = require("../models/user");

//Load Validation
const validateProfileInput = require("../validations/profile");

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
      let result = await ProfileModel.findOne({ user: user.id }).populate(
        "user",
        ["name", "avatar"]
      );
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
    try {
      //validate user details
      const { errors, isValid } = validateProfileInput(userDetails);

      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }

      //get profile fields
      const profileFields = {};
      profileFields.user = userId.id;
      if (userDetails.handle) profileFields.handle = userDetails.handle;
      if (userDetails.company) profileFields.company = userDetails.company;
      if (userDetails.website) profileFields.website = userDetails.website;
      if (userDetails.location) profileFields.location = userDetails.location;
      if (userDetails.bio) profileFields.bio = userDetails.bio;
      if (userDetails.status) profileFields.status = userDetails.status;
      if (userDetails.githubusername)
        profileFields.githubusername = userDetails.githubusername;
      //skills-split into array
      if (typeof userDetails.skills !== "undefined") {
        profileFields.skills = userDetails.skills.split(", ");
      }
      //social
      profileFields.social = {};
      if (userDetails.youtube)
        profileFields.social.youtube = userDetails.youtube;
      if (userDetails.twitter)
        profileFields.social.twitter = userDetails.twitter;
      if (userDetails.facebook)
        profileFields.social.facebook = userDetails.facebook;
      if (userDetails.linkedin)
        profileFields.social.linkedin = userDetails.linkedin;
      if (userDetails.instagram)
        profileFields.social.instagram = userDetails.instagram;
      console.log(profileFields);
      let foundUser = await ProfileModel.findOne({ user: userId.id });
      if (foundUser) {
        //Update
        let updateUser = await ProfileModel.findOneAndUpdate(
          { user: userId.id },
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
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = Profile;
