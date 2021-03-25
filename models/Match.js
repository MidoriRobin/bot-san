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
        type: DataTypes.STRING,
        defaultValue: "ongoing",
        allowNull: false,
      },
      game_name: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: false,
      },
      game_match_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      result: {
        type: DataTypes.STRING,
        defaultValue: "undecided",
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
