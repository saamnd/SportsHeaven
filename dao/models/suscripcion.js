'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suscripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Suscripcion.belongsTo(models.Usuario, {
        foreignKey : {
          name : 'id_usuario'
        }
      })

      Suscripcion.belongsTo(models.Curso, {
        foreignKey : {
          name : 'id_curso'
        }
      })
    }
  };
  Suscripcion.init({
    id_usuario: DataTypes.INTEGER,
    id_curso: DataTypes.INTEGER,
    medio_de_pago: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Suscripcion',
    freezeTableName : true
  });
  return Suscripcion;
};