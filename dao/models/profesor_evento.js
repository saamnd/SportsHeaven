'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profesor_Evento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profesor_Evento.belongsTo(models.Profesor, {
        foreignKey : 'id_profesor'
      })

      Profesor_Evento.belongsTo(models.Evento, {
        foreignKey : 'id_evento'
      })
    }
  }
  Profesor_Evento.init({
    id_profesor: DataTypes.INTEGER,
    id_evento: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profesor_Evento',
    freezeTableName: true
  });
  return Profesor_Evento;
};