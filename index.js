const dotenv = require("dotenv");
const Discord = require("discord.js");

//Loads data from .env files into process.env variable
dotenv.config();

//Creates a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  console.log(message.content);
  if (message.content === "~>Suck") {
    message.channel.send("Yuh mada");
  }
});

//Login to discord with your app's token
client.login(process.env.TOKEN);
