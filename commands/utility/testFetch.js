const fetch = require("node-fetch");
const {
  getLeagueUserInfo,
  getCurrentMatch,
  getMatchData,
} = require("../../helper");

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

    //TODO: Extract functionality to helper functions

    //Getting player information based on Summoner Name
    const leagueInfoResult = await getLeagueUserInfo(args[0]);
    if (!leagueInfoResult.id) {
      return message.channel.send("Error getting info check the api");
    }

    // Using id from info to do a fetch of spectator info (if it exists)
    const inMatch = await getCurrentMatch(leagueInfoResult.id);

    console.log("Fetching match info");

    if (inMatch.gameId) {
      message.channel.send("User In a match");
      //TODO: Send summoner champion info (Name, winrate(last 100)), last 100 match info

      const gameCheckTimer = setInterval(async () => {
        const status = await getCurrentMatch(leagueInfoResult.id);

        if (!status.gameId) {
          const { participantIdentities, participants } = await getMatchData(
            inMatch.gameId
          );

          const mainPlayerAccInfo = participantIdentities.filter(
            (participant) =>
              participant.player.accountId === leagueInfoResult.accountId
          );
          const mainPlayerGameInfo = participants.filter(
            (player) =>
              player.participantId === mainPlayerAccInfo[0].participantId
          );

          clearInterval(gameCheckTimer);

          console.log("Out of match: Exiting game check function");

          return message.channel.send(
            `${args[0]} ${mainPlayerGameInfo[0].stats.win ? "Won" : "Lost"}`
          );
        }
      }, 60000);
    } else {
      console.log("Not in a match");

      return message.channel.send("Player is not in a match");
    }
  },
};
