module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "match",
    {
      total_stake: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "ongoing",
        allowNull: false,
      },
      result: {
        type: DataTypes.STRING,
        defaultValue: "undecided",
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
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};
