const Error = require("../errors");

const ProfileModel = require("../models/profile");
const UserModel = require("../models/user");

//Load Validation
const validateProfileInput = require("../validations/profile");
const validateExperienceInput = require("../validations/experience");
const validateEducationInput = require("../validations/education");

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
        let result = await newProfile.save();
        return result;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  /**
   * @route GET api/profile/handle/:handle
   * @desc Get profile by handle
   * @access Public
   */
  async getProfileByHandle(handleId) {
    try {
      let result = await ProfileModel.findOne({ handle: handleId }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!result) {
        return Promise.reject(
          Error.notFound("There is no profile for this user")
        );
      }
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  /**
   * @route GET api/profile/user/:id
   * @desc Get profile by user ID
   * @access Public
   */
  async getProfileById(userID) {
    try {
      let result = await ProfileModel.findOne({ user: userID }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!result) {
        return Promise.reject(
          Error.notFound("There is no profile for this user")
        );
      }
      return result;
    } catch (err) {
      return Promise.reject(
        Error.notFound("There is no profile for this user")
      );
    }
  }
  /**
   * @route GET api/profile/all
   * @desc Get all profiles
   * @access Public
   */
  async getAllProfiles() {
    try {
      let results = await ProfileModel.find().populate("user", [
        "name",
        "avatar"
      ]);
      if (!results) {
        return Promise.reject(Error.notFound("There are no profiles"));
      }
      return results;
    } catch (err) {
      return Promise.reject(Error.notFound("There are no profiles"));
    }
  }
  /**
   * @route POST api/profile/experience
   * @desc Add Experience to profile
   * @access Private
   */
  async addExperince(userId, experience) {
    try {
      const { errors, isValid } = validateExperienceInput(experience);

      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }

      const newExperience = {
        title: experience.title,
        company: experience.company,
        location: experience.location,
        from: experience.from,
        to: experience.to,
        current: experience.current,
        description: experience.description
      };
      let result = await ProfileModel.findOne({ user: userId.id });
      if (result) {
        result.experience.unshift(newExperience);
        let updated = await result.save();
        if (updated) {
          return updated;
        }
      }
    } catch (err) {
      return Promise.reject(Error.internal("Problem adding new experience"));
    }
  }
  /**
   * @route POST api/profile/education
   * @desc Add Education to profile
   * @access Private
   */
  async addEducation(userId, education) {
    try {
      const { errors, isValid } = validateEducationInput(education);

      if (!isValid) {
        return Promise.reject(Error.badRequest(errors));
      }

      const newEducation = {
        school: education.school,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        from: education.from,
        to: education.to,
        current: education.current,
        description: education.description
      };
      let result = await ProfileModel.findOne({ user: userId.id });
      if (result) {
        result.education.unshift(newEducation);
        let updated = await result.save();
        if (updated) {
          return updated;
        }
      }
    } catch (err) {
      return Promise.reject(Error.internal("Problem adding new education"));
    }
  }
  /**
   * @route DELETE api/profile/experience/exp_id
   * @desc Delete Experience from profile
   * @access Private
   */
  async deleteExperience(userId, expId) {
    try {
      let currentUser = await ProfileModel.findOne({ user: userId.id });

      //Get remove index
      const removeIndex = currentUser.experience
        .map(item => item.id)
        .indexOf(expId);

      //splice out the array
      currentUser.experience.splice(removeIndex, 1);

      //Save
      currentUser = await currentUser.save();
      return currentUser;
    } catch (err) {
      return Promise.reject(Error.notFound(err));
    }
  }
  /**
   * @route DELETE api/profile/education/edu_id
   * @desc Delete Education from profile
   * @access Private
   */
  async deleteEducation(userId, eduId) {
    try {
      let currentUser = await ProfileModel.findOne({ user: userId.id });

      //Get remove index
      const removeIndex = currentUser.education
        .map(item => item.id)
        .indexOf(eduId);

      //splice out the array
      currentUser.education.splice(removeIndex, 1);

      //Save
      currentUser = await currentUser.save();
      return currentUser;
    } catch (err) {
      return Promise.reject(Error.notFound(err));
    }
  }
  /**
   * @route DELETE api/profile
   * @desc Delete user and profile
   * @access Private
   */
  async deleteProfile(userId) {
    try {
      let status = await ProfileModel.findOneAndRemove({ user: userId.id });
      if (status) {
        let status2 = await UserModel.findByIdAndDelete(userId.id);
        if (status2) {
          return { success: true };
        }
      }
      return { success: false };
    } catch (err) {
      return Promise.reject(Error.internal("problem with the server"));
    }
  }
}

module.exports = Profile;
