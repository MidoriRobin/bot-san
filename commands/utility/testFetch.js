const fetch = require("node-fetch");
const { getLeagueUserInfo, getCurrentMatch } = require("../../helper");

module.exports = {
  name: "fetch-info",
  description: "A fetch function that serves to make requests.",
  args: true,
  cooldown: 5,
  async execute(message, args) {
    if (args[0] === "cat") {
      const { file } = await fetch(
        "https://aws.random.cat/meow"
      ).then((response) => response.json());

      message.channel.send(file);
    }
    const leagueInfoResult = await getLeagueUserInfo("shajiku");

    if (leagueInfoResult.id) {
      const inMatch = await getCurrentMatch(leagueInfoResult.id);

      if (inMatch.gameId) {
        console.log("In match");
      } else {
        console.log("Not in a match");
      }
      console.log(inMatch);
      message.channel.send(`Your league of legends summonerID: ${1234}`);
    }
  },
};
