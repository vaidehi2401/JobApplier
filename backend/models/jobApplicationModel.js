const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel');
const Company = require('./companiesModel');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jobTitle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  applicationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Interviewed', 'Offered', 'Rejected'),
    allowNull: false,
    defaultValue: 'Applied'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resumeUrl: {
    type: DataTypes.STRING(1024),
    allowNull: true
  },
  coverLetterUrl: {
    type: DataTypes.STRING(1024),
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
  },
  companyName:{
    type:DataTypes.STRING(255),
    allowNull:false,
    references: {
        model: 'Companies',
        key: 'name'
      },
      onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

// Associations
User.hasMany(JobApplication, { foreignKey: 'userId', onDelete: 'CASCADE' });
JobApplication.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(JobApplication, { foreignKey: 'companyName', onDelete: 'CASCADE' });
JobApplication.belongsTo(Company, { foreignKey: 'companyName' });

module.exports = JobApplication;
