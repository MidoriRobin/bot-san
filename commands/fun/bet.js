const Discord = require("discord.js");
const casino = require("../../collections/casino");
const bank = require("../../collections/bank");
const summ = require("../../classes/summoner");

const Summoner = summ.Summoner;

module.exports = {
  name: "bet",
  aliases: ["gamble"],
  description: "Accepts a number as input as the units of currency to gamble",
  args: true,
  usage: "<user> <game> <side> <wager>",
  guildOnly: true,
  cooldown: 1,
  async execute(message, args) {
    const author = `${message.author}`;
    const filter = (m) => m.author.toString() === author;
    let betState = true;
    let userGameInfo = new Summoner();
    let outcome = "";
    let matchId = "";

    message.reply(`Attempting to make a bet for you`);

    if (!bank.has(message.author.id)) {
      console.log(`${message.author} has no balance`);
      return message.channel.send(
        `${message.author} you need a balance to make a bet. \n Try using the \`~>wallet\` command`,
      );
    }

    const [user, game, side, stake] = args;

    if (game === "for" || side !== "for" || "against" || !isNaN(stake)) {
      return message.channel.send(
        `${message.author} Command parameters incorrectly entered try again or use \`~>help bet\` to learn more about this command.`,
      );
    }

    if (game !== "custom") {
      // TODO: Extrapolate league bet functionality to a function, called in its own if statement
      // Fetches user info based on entered ign
      await message.channel
        .send(`What is the IGN of the person you want to bet on for ${game}`)
        .then(async () => {
          await message.channel
            .awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (collected) => {
              userGameInfo.sName = collected.first().content;
              await userGameInfo.getUserData();
            })
            .catch((error) => {
              console.log(error);
              message.channel.send(
                `There was an issue making a bet for you ${author}`,
              );
            });
        });

      // Checks if player with ign provided is currently in a match
      if (!(await userGameInfo.isInMatch())) {
        console.log(`${userGameInfo.sName} is not in a match right now`);
        return message.reply(
          `${userGameInfo.sName} is not in a match right now, cancelling bet`,
        );
      }

      // Attempts to record bet in database returning matchId by using a casino function
      try {
        const { newMatch } = await casino.makeBet(
          message.author.id,
          game,
          side,
          stake,
        );

        matchId = newMatch.id;
      } catch (error) {
        console.log(error);
        return message.reply("There was an error trying to initiate your bet");
      }

      message.reply(`Bet successfully made...awaiting match results`);

      // Continuous tracker provides the match result after completion
      const result = await userGameInfo.trackMatch();

      if (result) {
        console.log("Ending match");
        if (result === "none") {
          return message.reply(
            "There was an issue creating your bet, (maybe the match is already over)",
          );
        }

        if (result === "won") {
          outcome = `You ${side === "for" ? "won" : "lost"} your bet`;
        } else {
          outcome = `You ${side === "for" ? "lost" : "won"} your bet`;
        }

        message.reply(
          `${userGameInfo.sName}'s match has just ended! \n` + `${outcome}`,
        );

        await casino.completeBet(matchId, result);

        return;
      }
    }

    //Simulating a match being played and its subsequent result
    // const flip = getRandomInt(0, 2);

    // //Response based on the result of said match (win case)
    // if (flip === Number.parseInt(side)) {
    //   return message.channel.send(`${author} You won your wager!`);
    // }

    // //Response based on the result of said match (loss case)
    // return message.channel.send(
    //   `${author} RIP you lost your bet...and your points`
    // );
  },
};
