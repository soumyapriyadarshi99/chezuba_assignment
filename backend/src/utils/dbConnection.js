const mongoose = require("mongoose");

const dbConnection = async () => {
  mongoose
    .connect("mongodb://0.0.0.0:27017/bakery_app", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("connected to db"))
    .catch((err) => {
      console.log("could not connect to db", err);
    });
};

module.exports = dbConnection;
