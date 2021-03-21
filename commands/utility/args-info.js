module.exports = {
  name: "args-info",
  description: "Sends the arguments appened in a message.",
  args: true,
  usage: "<param>",
  execute(message, args) {
    if (args[0] === "foo") {
      return message.channel.send("bar");
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  },
};
