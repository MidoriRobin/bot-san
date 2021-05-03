const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const {
  leagueBaseUrl,
  summonerInfoEP,
  matchInfoEP,
  championInfoEP,
  spectatorInfoEP,
  matches,
} = require("../urls.json");

// setting headers for API calls
const meta = { "X-Riot-Token": process.env.RIOT_TOKEN };
const lolHeaders = new Headers(meta);

class Summoner {
  constructor(sname) {
    this.sName = sname;
    this.sInfo = {};
    this.currMatch = {};
  }

  /**
   * Function uses the sName variable to fetch their Summoner information for use using the summoner API.
   * @param {string} summonerName
   * @returns {Promise<object>}
   */
  async getUserData() {
    const url = `${leagueBaseUrl + summonerInfoEP + this.sName}`;

    const result = await fetch(url, {
      headers: lolHeaders,
    })
      .then((response) => response.json())
      .catch((error) => error);

    this.sInfo = result;

    return;
  }

  //TODO: Test this
  /**
   * Communicates if a user is in match and loads the data to the object if so.
   * @returns Boolean - true or false
   */
  async isInMatch() {
    let inMatch = false;

    if (this.sInfo.status) {
      console.log(`User data not loaded, api key might be expired`);
      return inMatch;
    }

    const url = `${leagueBaseUrl + spectatorInfoEP + this.sInfo.id}`;

    const result = await fetch(url, {
      headers: lolHeaders,
    })
      .then(async (response) => {
        if (response.ok) {
          inMatch = true;
          this.currMatch = await response.json();
        }
      })
      .catch((error) => console.log(error));

    // console.log(this.sInfo);
    // console.log(this.currMatch);

    return inMatch;
  }

  //TODO: Test this
  /**
   * Uses summonerId to fetch information about the current match that summoner is in (if any)
   * using the spectator data API.
   * @returns {Promise<object>} The current match spectator data from the url.
   */
  async getCurrentMatch() {
    const url = `${leagueBaseUrl + spectatorInfoEP + sInfo.id}`;
    const result = await fetch(url, {
      headers: lolHeaders,
    })
      .then((response) => response.json())
      .catch((error) => error);
    return result;
  }

  //TODO: Test this
  /**
   * Uses match id to obtain information for a previously played match
   * using the league of legends match data API.
   * @returns {Promise<object>} The match data from the endpoint.
   */
  async getMatchData() {
    const url = `${
      leagueBaseUrl + matchInfoEP + matches + this.currMatch.gameId
    }`;

    const result = await fetch(url, {
      headers: lolHeaders,
    })
      .then((response) => response.json())
      .catch((error) => error);

    console.log(result);
    return result;
  }

  /**
   * Uses champion key to fetch champion information
   * @param {Integer} championName
   * @returns {Object}
   */
  async getChampionData(championKey) {
    const url = `${championInfoEP + championName}.json`;
    let champInfo = {};

    const result = await fetch(url)
      .then((response) => response.json())
      .catch((error) => error);

    if (!result.type) {
      return "There was an error trying to fetch the champion";
    }

    result.data.forEach((element) => {
      if (element.id === championName) {
        champInfo = JSON.parse(JSON.stringify(element));
      }
    });
    return champInfo;
  }

  //TODO: Test this
  /**
   * Tracks the users current match state and returns match result,
   * returns "none" if the match ends between start of bet and the calling of this function.
   * @returns {String} "won", "lost", or "none"
   */
  async trackMatch() {
    const gameCompletion = new Promise((resolve, reject) => {
      // if (!(await this.isInMatch())) {
      //   //TODO: Send summoner champion info (Name, winrate(last 100)), last 100 match info
      //   reject( "none");
      // }

      const gameCheckTimer = setInterval(async () => {
        console.log("In game check timer");

        if (!(await this.isInMatch())) {
          const {
            participantIdentities,
            participants,
          } = await this.getMatchData();

          const mainPlayerAccInfo = participantIdentities.filter(
            (participant) =>
              participant.player.accountId === this.sInfo.accountId
          );

          const mainPlayerGameInfo = participants.filter(
            (player) =>
              player.participantId === mainPlayerAccInfo[0].participantId
          );

          clearInterval(gameCheckTimer);

          console.log("Out of match: Exiting game check function");

          resolve(mainPlayerGameInfo[0].stats.win ? "won" : "lost");
        }
        console.log(`Game for ${this.sName} is still running`);
      }, 60000);
    });

    return gameCompletion;
  }
}

module.exports = {
  Summoner,
};
