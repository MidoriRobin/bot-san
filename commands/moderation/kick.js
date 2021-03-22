module.exports = {
  name: "kick",
  description: "Kicks the tagged user.",
  args: true,
  usage: "<user>",
  guildOnly: true,
  permissins: "KICK_MEMBERS",
  cooldown: 5,
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.reply("you need to tag a user in order to kick them!");
    }

    // grab the "first" mentioned user from the message
    // this will return a `User` object, just like `message.author`
    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  },
};
