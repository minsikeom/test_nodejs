const DataTypes = require('sequelize')
const config = require("../config/config");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.development);
const {Model} = require("sequelize");

const XR_CNTNT_RS = sequelize.define('XR_CNTNT_RS', {
  CNTRS_NUM: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  CNTRS_F_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTRS_F_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
}, {
  tableName: 'XR_CNTNT_RS',
  timestamps: false, //  createdAt 및 updatedAt을 사용하지 않음
});

module.exports = XR_CNTNT_RS;
