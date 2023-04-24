const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const prductModel = require("../models/product.model");
const { users: userMocked, products: productMocked } = require("../__mocks__");

const database = process.env.DB_URI;

const connectMongooDB = () => {
  // Connect the database
  mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "Connecting to Mongo Database failed with error:"));

  db.once("open", function () {
    console.log(`Connected to Mongo Database successfully`);
  });
};


const mockDataForTesting = async () => {
  await prductModel.deleteMany();

  const count = await prductModel.countDocuments();
  if (count === 0) {
    console.log('There is no products in the database, creating sample products...');
    prductModel.insertMany(productMocked)
    .then(() => {
      console.log('Creating sample products successfully!');
    })
    .catch((error) => {
      console.log('Creating sample products failed with error: ', error?.message);
    })
  }
}

const initMongooDBCollection = () => {
  const db = mongoose.connection;

  db.once("open", async function () {
    // count number of users
    const count = await userModel.countDocuments();
    if (count === 0) {
      console.log('There is no user in the database, creating Master Admin...');
      userModel.insertMany(userMocked)
      .then(() => {
        console.log('Creating Master Admin successfully!');
      })
      .catch((error) => {
        console.log('Creating Master Admin failed with error: ', error?.message);
      })
    }

    // await mockDataForTesting()
  });
};

module.exports = {
  connectMongooDB,
  initMongooDBCollection,
};
