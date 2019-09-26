const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  //data.password = !isEmpty(data.password) ? data.password : "";

  // if (!Validator.isEmail(data.email)) {
  //   errors.email = "Email is invalid";
  // }

  if (Validator.isEmpty(data.text)) {
    errors.text = "text field is required";
  }

  // if (Validator.isEmpty(data.password)) {
  //   errors.password = "Password field is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};