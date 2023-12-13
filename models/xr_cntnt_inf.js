const DataTypes = require('sequelize')
const config = require("../config/config");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.development);
const {Model} = require("sequelize");
const RS = require('./xr_cntnt_rs');

const XR_CNTNT_INF = sequelize.define('XR_CNTNT_INF', {
  CNTI_CODE: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: false,
  },
  CNTT_CODE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTI_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
}, {
  tableName: 'XR_CNTNT_INF',
  timestamps: false, //  createdAt 및 updatedAt을 사용하지 않음
});

// 모델 관계 설정
XR_CNTNT_INF.hasMany(RS, {
  foreignKey:'CNTI_CODE',
  onDelete: 'CASCADE',  // 해당 키가 삭제되면 같이 삭제되도록 설정
  as:'rs' // 별칭
});

module.exports = XR_CNTNT_INF;