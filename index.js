const dotenv = require("dotenv");
const fs = require("fs");
const Discord = require("discord.js");

const { prefix } = require("./config.json");
const suck = require("./commands/suck");

//Loads data from .env files into process.env variable
dotenv.config();

//Creates a new Discord client
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "suck") {
    client.commands.get("suck").execute(message, args);
  } else if (command === "args-info") {
    client.commands.get("args-info").execute(message, args);
  } else if (command === "kick") {
    client.commands.get("kick").execute(message, args);
  } else if (command === "avatar") {
    client.commands.get("avatar").execute(message, args);
  } else if (command === "prune") {
    client.commands.get("prune").execute(message, args);
  }
});

//Login to discord with your app's token
client.login(process.env.TOKEN);
