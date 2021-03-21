module.exports = {
  name: "args-info",
  description: "Sends the arguments appened in a message.",
  execute(message, args) {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  },
};
