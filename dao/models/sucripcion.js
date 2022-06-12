'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sucripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sucripcion.belongsTo(models.Usuario, {
        foreignKey : 'id_usuario'
      })

      Sucripcion.belongsTo(models.Curso, {
        foreignKey : 'id_curso'
      })
    }
  }
  Sucripcion.init({
    id_usuario: DataTypes.INTEGER,
    id_curso: DataTypes.INTEGER,
    medio_pago: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sucripcion',
    freezeTableName: true
  });
  return Sucripcion;
};