'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Curso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Curso.belongsTo(models.Usuario, {
          foreignKey : 'id_usuario'
      })
    }
  };
  Curso.init({
    nombre: DataTypes.STRING,
    deporte: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    calificacion: DataTypes.INTEGER,
    id_profesor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Curso',
    freezeTableName: true
  });
  return Curso;
};