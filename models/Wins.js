module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "wins",
    {
      match_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
