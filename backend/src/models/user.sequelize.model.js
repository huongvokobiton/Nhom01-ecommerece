
const { Sequelize, DataTypes } = require("sequelize");
const User = Sequelize.define("users", {

    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      
    },

    email: {
      type: DataTypes.STRING,
    },
    
    pass: {
      type: DataTypes.STRING,
    },

    avatar_publicid: {
        type: DataTypes.STRING,
      },

    avatar_url:{
        type:DataTypes.STRING,
      },

    role:{
        type:DataTypes.STRING,
    },

    createdAt:{
        type:DataTypes.DATE,
    },

    resetpassToken:{
        type:DataTypes.STRING,
    },

    resetpassExpired:{
        type:DataTypes.STRING,
    }
 });