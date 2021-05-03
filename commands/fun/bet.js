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

    message.reply(`Making a bet for you`);

    if (!bank.has(message.author.id)) {
      console.log(`${message.author} has no balance`);
      return message.channel.send(
        `${message.author} you need a balance to make a bet. \n Try using the \`~>wallet\` command`
      );
    }

    const [user, game, side, stake] = args;

    if (game !== "custom") {
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
                `There was an issue making a bet for you ${author}`
              );
            });
        });

      if (!(await userGameInfo.isInMatch())) {
        console.log(`${userGameInfo.sName} is not in a match right now`);
        return message.reply(
          `${userGameInfo.sName} is not in a match right now, cancelling bet`
        );
      }

      try {
        const { newMatch } = await casino.makeBet(
          message.author.id,
          game,
          side,
          stake
        );

        matchId = newMatch.id;
      } catch (error) {
        console.log(error);
        return message.reply("There was an error trying to initiate your bet");
      }

      message.reply(`Bet successfully made...awaiting match results`);

      //Return as a promise and run callbacks based on that?
      const result = await userGameInfo.trackMatch();
      // const result = "lost";

      if (result) {
        console.log("Ending match");
        if (result === "none") {
          return message.reply(
            "There was an issue creating your bet, (maybe the match is already over)"
          );
        }

        if (result === "won") {
          outcome = `You ${side === "for" ? "won" : "lost"} your bet`;
        } else {
          outcome = `You ${side === "for" ? "lost" : "won"} your bet`;
        }

        message.reply(
          `${userGameInfo.sName}'s match has just ended! \n` + `${outcome}`
        );

        await casino.completeBet(matchId, result);

        return;
      }
    }

    //--------------------

    //pass result of bet to database

    //do calculations of the result and update the relevant results based on match id

    //once data is persisted reflect win or loss in the balance of the users

    //output result to the discord server

    //done

    //--------------------

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
