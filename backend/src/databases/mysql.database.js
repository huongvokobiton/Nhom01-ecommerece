const Sequelize = require("sequelize");

const host = process.env.SQL_DB_HOST || "localhost";
const database = process.env.SQL_DB_DATABASE || "ecommerce";
const username = process.env.SQL_DB_USERNAME || "root";
const password = process.env.SQL_DB_PASSWORD || "123456";

const connectMySqlDatabase = () => {
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "mysql",
    dialectModule: require("mysql2"),
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected to MySQL Database successfully");
    })
    .catch((error) => {
      console.error("Connecting to MySQL Database failed with error ", error);
    });
};

module.exports = {
  connectMySqlDatabase,
};
