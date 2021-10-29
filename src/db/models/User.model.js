const Sequelize = require('sequelize');
const { sequelize } = require('../index');

class User extends Sequelize.Model {}

User.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: ''
        }
    },
    { sequelize: sequelize, underscored: true, modelName: 'user' }
);

const ToDo = require('./ToDo.model');
const Token = require('./Token.model');
User.hasMany(ToDo);
User.hasMany(Token);
Token.belongsTo(User, {
    foreignKey: 'userId'
});
ToDo.belongsTo(User, {
    foreignKey: 'userId'
});



module.exports = User;