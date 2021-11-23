const Sequelize = require('sequelize');
const {sequelize} = require('../index');
class Token extends Sequelize.Model {}

Token.init({
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    underscored: true,
    modelName: 'token'
});



module.exports = Token;