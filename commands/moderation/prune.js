module.exports = {
  name: "prune",
  description: "Deletes the number of messages specified.",
  execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number.");
    } else if (amount < 2 || amount > 100) {
      return message.reply("you need to input a number between 1 and 99.");
    }

    message.channel.bulkDelete(amount);
  },
};
