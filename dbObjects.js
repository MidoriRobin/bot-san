const dotenv = require("dotenv");

const Sequelize = require("sequelize");

dotenv.config();

const { DB_NAME, DB_UNAME, DB_PASS } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_UNAME, DB_PASS, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const Users = require("./models/Users")(sequelize, Sequelize.DataTypes);
const Match = require("./models/Match")(sequelize, Sequelize.DataTypes);
const Result = require("./models/Result")(sequelize, Sequelize.DataTypes);

Match.hasMany(Result, { foreignKey: "match_id", as: "match" });
Result.belongsTo(Match);
Users.hasOne(Result, { foreignKey: "user_id", as: "user" });

//User object queries
Users.prototype.joinMatch = async function (match, wager) {
  const result = await Result.findOne({
    where: { user_id: this.user_id, match_id: match.id },
  });

  if (result) {
    result.wager += wager;
    console.log("Wager incremented");
    return result.save();
  }

  return Result.create({ user_id: this.user_id, match_id: match.id, wager });
};

Users.prototype.setOutcome = async function (match, outcome) {
  const result = await Result.findOne({
    where: { user_id: this.user_id, match_id: match.id },
  });

  if (result) {
    result.outcome = outcome;
    console.log("Outcome set");
    return result.save();
  }

  console.log("Error: match could not be found");
  return;
};

Users.prototype.getAllResult = function () {
  return Result.findAll({
    where: { user_id: this.user_id },
    include: ["match"],
  });
};

Users.prototype.getAllWinResults = async function () {
  const { count, rows } = Result.findAll({
    where: { user_id: this.user_id, outcome: "win" },
    include: ["match"],
  });

  return { count, rows };
};

Users.prototype.getAllLossResults = async function () {
  const { count, rows } = await Result.findAll({
    where: { user_id: this.user_id, outcome: "loss" },
    include: ["match"],
  });
  return { count, rows };
};

//Match object queries

Match.prototype.addMatch = async function (totalWager, gameName, gameId = 0) {
  return Match.create({
    wager: totalWager,
    game_name: gameName,
    game_id: gameId,
  });
};

Match.prototype.setResult = async function (matchObj, result) {
  const match = Match.findOne({
    where: { match_id: matchObj.id },
  });

  if (match) {
    match.result = result;
    return match.save();
  }

  console.log("Error no match found");

  return;
};

module.exports = { Users, Match, Result };
