const { Model, DataTypes } = require ('sequelize');
const dbConnection = require ('../db_connection');

class List extends Model {

};

List.init ({
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: { 
          notEmpty: true
        }
    },
    position: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
    
}, {
    sequelize: dbConnection,
    tableName: "list",
    createdAt: "created_at",
    updatedAt: "updated_at",
})

module.exports = List;