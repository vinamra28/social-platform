var apiHandler = function(req, res, data) {
  data
    .then(data => {
      var status = "success";
      res.send({
        status,
        data
      });
    })
    .catch(err => {
      var status = "failure";
      var error = {};
      error.error_code = err.error;
      error.message = err.message;
      res.status(err.code).send({
        status,
        error
      });
    });
};

module.exports = apiHandler;
