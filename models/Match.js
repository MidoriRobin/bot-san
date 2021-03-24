module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "match",
    {
      wager: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
