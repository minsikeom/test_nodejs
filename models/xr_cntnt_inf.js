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
  CNTC_CODE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SS_CODE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CRT_CODE: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CNTI_REQUIRE_SENSOR:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  CNTI_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTI_E_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTI_VERSION: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTI_F_NAME: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CNTI_F_ID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CNTI_F_PATH: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CNTI_MIN_UCNT: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CNTI_MAX_UCNT: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CNTI_DESC: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CNTI_SORTBY: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: 'XR_CNTNT_INF', // 복수로 자동인식하니 테이블명 지정
  timestamps: true, // false 는 created_at과 ,updated_at 사용 안함
  createdAt: 'CNTI_REG', // 생성일 컬럼명 변경
  updatedAt: 'CNTI_MODIFY_REG', // 업데이트일 컬럼명 변경
});

// 모델 관계 설정
XR_CNTNT_INF.hasMany(RS, {
  foreignKey:'CNTI_CODE',
  onDelete: 'CASCADE',  // 해당 키가 삭제되면 같이 삭제되도록 설정
  as:'rs' // 별칭
});

module.exports = XR_CNTNT_INF;