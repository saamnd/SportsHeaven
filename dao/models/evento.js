'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evento.belongsTo(models.Usario, {
          foreignKey : 'id_usuario'
      })
    }
  };
  Evento.init({
    nombre: DataTypes.STRING,
    ubicacion: DataTypes.STRING,
    fecha: DataTypes.DATE,
    hora: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    id_usuario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Evento',
    freezeTableName: true
  });
  return Evento;
};