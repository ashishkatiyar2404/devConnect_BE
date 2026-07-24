const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://katiyarashish24_db_user:O8Yp9gn4KESIueQY@ashishnodejs.arry0rt.mongodb.net/devConnectBE",
  );
};

module.exports = connectDB;
