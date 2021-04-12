const Discord = require("discord.js");
const { getRandomInt } = require("../../helper");
const casino = require("../../collections/casino");
const bank = require("../../collections/bank");

module.exports = {
  name: "join-bet",
  aliases: ["join-gamble", "add-bet"],
  description:
    "Accepts a bet id(match_id), wager and the users stance, and adds them to that bet",
  args: true,
  usage: "<bet-id> <side> <stake>",
  guildOnly: true,
  cooldown: 5,
  async execute(message, args) {
    const [betId, side, stake] = args;

    console.log(`User ${message.author} is attempting to join bet ${betId}`);

    message.reply(`${message.author} wants to join in on bet#${betId}`);

    if (!bank.has(message.author.id)) {
      console.log(`${message.author} tried to make a bet but has no balance`);
      return message.channel.send(
        `${message.author} you need a balance to join a bet. \n Try using the \`~>wallet\` command`
      );
    }

    const joinRslt = await casino.joinBet(
      message.author.id,
      Number(betId),
      side,
      stake
    );

    if (!joinRslt?.matchId) {
      console.log(
        `Error with join result for ${message.author}  with bet#${betId}`
      );
      return message.reply(
        `Sorry ${message.author} there was an error making a bet for bet#${betId}`
      );
    }

    console.log(`${message.author} has successfully joined bet#${betId}`);

    return message.channel.send(
      `${message.author} put ${stake} ${side} bet#${betId}`
    );
  },
};
