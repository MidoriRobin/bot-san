const dotenv = require("dotenv");
const fs = require("fs");
const Discord = require("discord.js");
const { User, Match, Result } = require("../dbObjects");
const bank = require("./bank");
const { calcWinnings } = require("../helper");

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

      casino.set(newMatch.id, newMatch);
      return { newMatch, newResult };
    }

    return "No such user exists";
  },
});

//Funtion allowing another user to join a bet
Reflect.defineProperty(casino, "joinBet", {
  value: async function joinBet(id, match_id, side, stake) {
    const match = casino.get(match_id);
    console.log("Attempting to join bet");
    if (match) {
      try {
        const newResult = await Result.create({
          matchId: match_id,
          userId: id,
          side,
          stake,
        });

        console.log(newResult);
        // Temporary fix for sequelize decimal to string bug, refer to dbInit.js for a better fix
        const newStake = Number(match.total_stake) + stake;

        match.total_stake = newStake;

        match.save();
        console.log(match);
        casino.set(match_id, match);

        return newResult;
      } catch (error) {
        console.log(error);
      }
    }

    return "No such match exists";
  },
});

Reflect.defineProperty(casino, "completeBet", {
  value: async function completeBet(id, result) {
    const bet = casino.get(id);
    const jsonBet = bet.toJSON();

    if (!bet?.id) {
      return console.log("No such bet exists");
    }

    console.log("Completing bet...");

    bet.status = "complete";
    bet.result = result;

    await Result.update(
      { outcome: matchToBet(result) },
      {
        where: {
          matchId: id,
        },
      }
    );

    const resultList = await Result.findAll({
      where: {
        matchId: id,
      },
    });

    const sidesInfo = await fetchSides(id);

    //TODO: 2. For each result calculate and pass out winnings where applicable

    payoutLoop: resultList.forEach((rsltItem) => {
      rsltItem.outcome = matchToBet(result, rsltItem.side);

      rsltItem.save();

      if (rsltItem.outcome !== "won") {
        console.log("No win");
        bank.subtract(rsltItem.userId, rsltItem.stake);
        return;
      }
      const winnings = calcWinnings(
        rsltItem.stake,
        rsltItem.side,
        sidesInfo.forCount,
        sidesInfo.agaCount,
        sidesInfo.forStake,
        sidesInfo.agaStake
      );

      console.log(winnings);

      bank.add(rsltItem.userId, winnings);
    });

    return bet.save();
  },
});

//Helper functions

async function fetchSides(matchId) {
  const forCount = await Result.count({
    where: {
      matchId,
      side: "for",
    },
  });

  const forStake = await Result.sum("stake", {
    where: {
      matchId,
      side: "for",
    },
  });

  const agaCount = await Result.count({
    where: {
      matchId,
      side: "against",
    },
  });

  const agaStake = await Result.sum("stake", {
    where: {
      matchId,
      side: "against",
    },
  });

  if (!forCount && !agaCount) {
    console.log("No results for that match id");
    return "no results";
  }

  return { forCount, forStake, agaCount, agaStake };
}

function matchToBet(matchRslt, betSide) {
  if (matchRslt === "won") {
    if (betSide === "for") {
      return "won";
    }

    return "lost";
  }

  if (matchRslt === "lost") {
    if (betSide === "for") {
      return "lost";
    }

    return "won";
  }
}

module.exports = casino;
