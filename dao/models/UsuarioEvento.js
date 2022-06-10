'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioEvento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsuarioEvento.belongsTo(models.Usuario, {
        foreignKey : {
          name : 'id_usuario'
        }
      })

      UsuarioEvento.belongsTo(models.Evento, {
        foreignKey : {
          name : 'id_evento'
        }
      })
    }
  };
  UsuarioEvento.init({
    id_usuario: DataTypes.INTEGER,
    id_evento: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioEvento',
    freezeTableName : true
  });
  return UsuarioEvento;
};