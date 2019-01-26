'use strict';
module.exports = (sequelize, DataTypes) => {
  var collaborators = sequelize.define('collaborators', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  collaborators.associate = function(models) {
    // associations can be defined here
    collaborators.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    collaborators.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

  };
  return collaborators;
};