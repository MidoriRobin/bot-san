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

Match.hasMany(Result, { foreignKey: "matchId" });
Result.belongsTo(Match);
Users.hasOne(Result, { foreignKey: "userId" });
Result.belongsTo(Users);

//User object queries
Users.prototype.joinMatch = async function (match, wager) {
  const result = await Result.findOne({
    where: { user_id: this.id, match_id: match.id },
  });

  if (result) {
    result.wager += wager;
    console.log("Wager incremented");
    return result.save();
  }

  return Result.create({ user_id: this.id, match_id: match.id, wager });
};

Users.prototype.setOutcome = async function (match, outcome) {
  const result = await Result.findOne({
    where: { user_id: this.id, match_id: match.id },
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
    where: { user_id: this.id },
    include: ["match"],
  });
};

Users.prototype.getAllWinResults = async function () {
  const { count, rows } = Result.findAll({
    where: { user_id: this.id, outcome: "win" },
    include: ["match"],
  });

  return { count, rows };
};

Users.prototype.getAllLossResults = async function () {
  const { count, rows } = await Result.findAll({
    where: { user_id: this.id, outcome: "loss" },
    include: ["match"],
  });
  return { count, rows };
};

//Match object queries

Match.prototype.addMatch = async function (totalWager, gameName, gameId = 0) {
  return Match.create({
    total_stake: totalWager,
    game_name: gameName,
    game_match_id: gameId,
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

//Result object queries

Result.prototype.fetchResults = async function (match_id) {
  const results = Result.findAll({
    where: { match_id: id },
  });

  if (results) {
    return results;
  }

  console.log("No results for that match id");
  return;
};

module.exports = { Users, Match, Result };
