// TODO: remove this comments
// "mongodb://mernstack:mernstack1@ds247377.mlab.com:47377/devconnector",
// "mongodb://localhost:27017/devconnector",

module.exports = {
  mongoURI: `mongodb://${process.env.DB_URI}/devconnector`,
  secretOrKey: "secret"
};
