const { Model, DataTypes } = require('sequelize');
const dbConnection = require('../db_connection');

class Label extends Model {

};

Label.init({
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "#fff"
  }
}, {
  sequelize: dbConnection,
  tableName: "label",
  createdAt: "created_at",
  updatedAt: "updated_at"
});


module.exports = Label;