const bank = require("../../collections/bank");

module.exports = {
  name: "wallet",
  aliases: ["purse", "bag"],
  cooldown: 5,
  description: "Checks the users available balance.",
  execute(message, args) {
    if (!bank.has(message.author.id)) {
      console.log(`${message.author} doesn't have a balance`);
      message.channel.send(
        `Oi! ${message.author.username} bad man yuh naave nuh money?...hol on deh`
      );
      bank.add(message.author.id, 300);
      return message.channel.send(`Aight boss, check again`);
    }

    const balance = bank.getBalance(message.author.id);

    console.log(`${message.author}'s balance is: ${balance}`);
    return message.channel.send(
      `Hailins <@${message.author.id}>, yuh ave like ${balance}`
    );
  },
};
