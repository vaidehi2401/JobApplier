const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel');
const Company = require('./companiesModel');

const JobListing = sequelize.define('JobListing', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('saved', 'applied', 'interviewed', 'offered', 'rejected'),
    defaultValue: 'saved'
  },
  applyBy: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

User.hasMany(JobListing, { foreignKey: 'userId', onDelete: 'CASCADE' });
JobListing.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(JobListing, { foreignKey: 'companyId', onDelete: 'CASCADE' });
JobListing.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = JobListing;
