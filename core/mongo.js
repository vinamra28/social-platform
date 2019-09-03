let logger = require("./logger");
let config = require("../config/keys");

const Promise = require("bluebird");
let chalk = require("chalk");
let mongoose = require("mongoose");
let autoIncrement = require("mongoose-auto-increment-fix");

module.exports = function() {
  let db;

  logger.info();

  mongoose.Promise = Promise;

  if (mongoose.connection.readyState !== 1) {
    logger.info("Connecting to Mongo " + config.mongoURI + "...");
    db = mongoose.connect(
      config.mongoURI,
      { useNewUrlParser: true },
      function mongoAfterConnect(err) {
        if (err) {
          logger.error("Could not connect to MongoDB!");
          return logger.error(err);
        }
      }
    );

    mongoose.connection.on("error", function mongoConnectionError(err) {
      if (err.message.code === "ETIMEDOUT") {
        logger.warn("Mongo connection timeout!", err);
        setTimeout(() => {
          mongoose.connect(config.mongoURI);
        }, 1000);
        return;
      }

      logger.error("Could not connect to MongoDB!");
      return logger.error(err);
    });

    autoIncrement.initialize(mongoose.connection);

    mongoose.connection.once("open", function mongoAfterOpen() {
      logger.info(chalk.yellow.bold("Mongo DB connected."));
      logger.info();
    });
  } else {
    logger.info("Mongo already connected.");
    db = mongoose;
  }

  return db;
};
