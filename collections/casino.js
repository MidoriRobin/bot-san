const dotenv = require("dotenv");
const fs = require("fs");
const Discord = require("discord.js");
const { User, Match, Result } = require("../dbObjects");
const bank = require("./bank");

const casino = new Discord.Collection();

//Function to initiate the making of a bet
Reflect.defineProperty(casino, "makeBet", {
  value: async function makeBet(id, game_name, side, stake) {
    const user = bank.get(id);

    if (user?.balance) {
      const newMatch = await Match.create({ total_stake: stake, game_name });
      console.log(`Match id: ${newMatch.id}`);

      const newResult = await Result.create({
        matchId: newMatch.id,
        userId: id,
        side,
        stake,
      });

      return { newMatch, newResult };
    }

    return "No such user exists";
  },
});

//Funtion allowing another user to join a bet
Reflect.defineProperty(casino, "joinBet", {
  value: async function joinBet(id, match_id, side, stake) {
    const match = casino.get(match_id);

    if (match) {
      match.total_stake += stake;
      match.save();

      try {
        const newResult = await Result.create({
          matchId: match_id,
          userId: id,
          side,
          stake,
        });

        return newResult;
      } catch (error) {
        match.total_stake -= stake;
        match.save();
        console.log(error);
      }
    }

    return "No such match exists";
  },
});

module.exports = casino;
