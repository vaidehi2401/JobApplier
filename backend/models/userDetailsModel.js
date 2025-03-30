const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel')
const UserDetails = sequelize.define('UserDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    primaryEducation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    secondaryEducation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    graduationDetails: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    jobType: {
        type: DataTypes.STRING(255), // e.g. Full-Time, Part-Time, Internship, etc.
        allowNull: true
    },
    experienceLevel: {
        type: DataTypes.STRING(255), // e.g. Fresher, Junior, Mid, Senior
        allowNull: true
    },
    githubUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    linkedinUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true
});
User.hasOne(UserDetails, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserDetails.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserDetails;
