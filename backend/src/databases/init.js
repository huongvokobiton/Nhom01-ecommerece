const {
  connectMongooDB,
  initMongooDBCollection,
} = require("./moongose.database");
const { connectMySqlDatabase } = require("./mysql.database");
const { connectDatabase: connectNeo4j } = require("./neo4j.database");

const initializeDatabases = () => {
  connectMongooDB();
  initMongooDBCollection();
  //connectMySqlDatabase();
  connectNeo4j();
};

module.exports = initializeDatabases;
