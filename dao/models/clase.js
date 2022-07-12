'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clase.belongsTo(models.Curso, {
        foreignKey : 'id_curso'
      })
    }
  }
  Clase.init({
    id_curso: DataTypes.INTEGER,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clase',
    freezeTableName: true
  });
  return Clase;
};