const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true 
  },
  industry: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  size: {
    type: DataTypes.STRING(255), // e.g. Small, Medium, Large
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // table name as string
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

User.hasMany(Company, { foreignKey: 'userId', onDelete: 'CASCADE' });
Company.belongsTo(User, { foreignKey: 'userId' });

module.exports = Company;
