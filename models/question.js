'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Choice, { foreignKey: "question_id" });
      this.hasMany(models.Answer, { foreignKey: "question_id" });
    }
  }
  Question.init({
    question_text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};