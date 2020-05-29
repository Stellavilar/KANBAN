const { Model, DataTypes } = require('sequelize');
const dbConnection = require('../db_connection');

class Card extends Model {

};

Card.init({
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  color: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "#fff"
  }
}, {
  sequelize: dbConnection,
  tableName: "card",
  createdAt: "created_at",
  updatedAt: "updated_at"
});


module.exports = Card;