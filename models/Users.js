module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      rank: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      // underscored: true,
    }
  );
};
