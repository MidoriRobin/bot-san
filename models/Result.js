module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "result",
    {
      matchId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      side: {
        type: DataTypes.ENUM("for", "against"),
        allowNull: false,
      },
      stake: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      outcome: {
        type: DataTypes.ENUM("won", "lost", "undecided"),
        defaultValue: "undecided",
        allowNull: false,
      },
    },
    {
      timestamps: false,
      // underscored: true,
    }
  );
};
