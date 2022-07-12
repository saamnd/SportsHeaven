'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profesor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profesor.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    fechan: DataTypes.DATE,
    calificacion: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Profesor',
    freezeTableName: true
  });
  return Profesor;
};