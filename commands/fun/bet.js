const Discord = require("discord.js");
const { getRandomInt } = require("../../helper");
const casino = require("../../collections/casino");
const bank = require("../../collections/bank");

module.exports = {
  name: "bet",
  aliases: ["gamble"],
  description: "Accepts a number as input as the units of currency to gamble",
  args: true,
  usage: "<user> <game> <side> <wager>",
  guildOnly: true,
  cooldown: 1,
  execute(message, args) {
    const author = `${message.author}`;

    message.reply(`Making a bet for ${author}`);

    if (!bank.has(message.author.id)) {
      console.log(`${message.author} has no balance`);
      return message.channel.send(
        `${message.author} you need a balance to make a bet. \n Try using the \`~>wallet\` command`
      );
    }

    const [user, game, side, stake] = args;

    makeBetResult = casino.makeBet(message.author.id, game, side, stake);

    if (makeBetResult?.newMatch) {
      console.log(makeBetResult);
    }

    //Simulating a match being played and its subsequent result
    const flip = getRandomInt(0, 2);

    //Response based on the result of said match (win case)
    if (flip === Number.parseInt(side)) {
      return message.channel.send(`${author} You won your wager!`);
    }

    //Response based on the result of said match (loss case)
    return message.channel.send(
      `${author} RIP you lost your bet...and your points`
    );
  },
};
