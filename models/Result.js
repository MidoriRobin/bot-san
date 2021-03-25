module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "result",
    {
      match_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      wagered: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      outcome: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
