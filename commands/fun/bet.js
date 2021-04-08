const Discord = require("discord.js");
const { getRandomInt } = require("../../helper");

const server = new Discord.Guild();

module.exports = {
  name: "bet",
  aliases: ["gamble"],
  description: "Accepts a number as input as the units of currency to gamble",
  args: true,
  usage: "<user> <game> <side> <wager>",
  guildOnly: true,
  cooldown: 1,
  execute(message, args) {
    const [user, game, side, wager] = args;

    const author = `${message.author}`;

    message.reply(`Making a bet for ${author}`);

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
