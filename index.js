const dotenv = require("dotenv");
const fs = require("fs");
const Discord = require("discord.js");
const { Users, Match } = require("./dbObjects");

const { prefix } = require("./config.json");
const bank = require("./collections/bank");
const casino = require("./collections/casino");

const commandFolders = fs.readdirSync("./commands");

//Creates a new Discord client
const client = new Discord.Client();

//Loads data from .env files into process.env variable
dotenv.config();

client.commands = new Discord.Collection();

client.cooldowns = new Discord.Collection();

// iterates through folders to locate commands
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
  }
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", async () => {
  const members = await Users.findAll();
  const matches = await Match.findAll();

  members.forEach((member) => bank.set(member.id, member));
  matches.forEach((match) => casino.set(match.id, match));

  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // separate arguments from message
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // ignoring command case
  const commandName = args.shift().toLowerCase();

  //If no commands were passed exit execution
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.reply("You can not do this!");
    }
  }

  if (command.args && args.length >= command.usage.split(" ")) {
    console.log(args);
    let reply = `You didnt provide sufficient arguments, ${message.author}`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

//Login to discord with your app's token
client.login(process.env.TOKEN);
