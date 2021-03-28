const dotenv = require("dotenv");
const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const {
  leagueBaseUrl,
  summonerInfoEP,
  matchInfoEP,
  championInfoEP,
  spectatorInfoEP,
  matches,
} = require("./urls.json");

dotenv.config();

// setting headers for API calls
const meta = { "X-Riot-Token": process.env.RIOT_TOKEN };
const lolHeaders = new Headers(meta);

//TODO: Extract league functions to a LoLHelper.js file

/**
 * Function that accepts a string as a parameter
 * and extracts the user id from it to be returned.
 * @param {string} mention
 */
function getUserFromMention(mention) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/);

  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return;

  // However the first element in the matches array will be the entire mention, not just the ID,
  // so use index 1.
  const id = matches[1];

  return client.users.cache.get(id);
}

/**
 * Function that accepts a league of legends summoner name as a string
 * and fetches their Summoner information for use using the summoner API.
 * @param {string} summonerName
 * @returns {Promise<object>}
 */
async function getLeagueUserData(summonerName) {
  const url = `${leagueBaseUrl + summonerInfoEP + summonerName}`;

  const result = await fetch(url, {
    headers: lolHeaders,
  })
    .then((response) => response.json())
    .catch((error) => error);
  return result;
}

/**
 * A function that accepts summonerId
 * to fetch information about the current match that summoner is in (if any)
 * using the spectator data API.
 * @param {String} summonerID - The summoner id to be queried.
 * @returns {Promise<object>} The current match spectator data from the url.
 */
async function getCurrentMatch(summonerID) {
  const url = `${leagueBaseUrl + spectatorInfoEP + summonerID}`;
  const result = await fetch(url, {
    headers: lolHeaders,
  })
    .then((response) => response.json())
    .catch((error) => error);
  return result;
}

/**
 * Uses match id to obtain information for a match
 * using the league of legends match data API.
 * @param {string} matchId - The match id to be queried.
 * @returns {Promise<object>} The match data from the url.
 */
async function getMatchData(matchId) {
  const url = `${leagueBaseUrl + matchInfoEP + matches + matchId}`;

  const result = await fetch(url, {
    headers: lolHeaders,
  })
    .then((response) => response.json())
    .catch((error) => error);

  return result;
}

/**
 *
 * @param {*} championName
 */
async function getChampionData(championKey) {
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

module.exports = {
  getUserFromMention,
  getLeagueUserInfo: getLeagueUserData,
  getCurrentMatch,
  getMatchData,
  getChampionData,
};
