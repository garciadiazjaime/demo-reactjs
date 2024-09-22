const MOCK_TWITTER = require("../../mock/twitter");

require("dotenv").config();

async function getTwitter(username) {
  const url = `https://api.x.com/graphql/qW5u-DAuXpMEG0zA1F7UGQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22${username}%22%2C%22withSafetyModeUserFields%22%3Atrue%7D&features=%7B%22hidden_profile_likes_enabled%22%3Atrue%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Afalse%7D`;
  const response = await fetch(url, {
    headers: {
      "x-csrf-token": process.env.TWITTER_TOKEN,
      authorization: process.env.TWITTER_AUTH,
      cookie: process.env.TWITTER_COOKIE,
    },
    body: null,
    method: "GET",
  });

  const data = await response.json();

  return data.data.user?.result;
}

module.exports.handler = async (event) => {
  if (process.env.USE_TWITTER_MOCK) {
    return {
      statusCode: 200,
      body: JSON.stringify(MOCK_TWITTER),
    };
  }

  const { username } = event.queryStringParameters;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ code: "EMPTY_USER" }),
    };
  }

  const twitter = await getTwitter(username).catch(() => false);

  if (!twitter) {
    return {
      statusCode: 400,
      body: JSON.stringify({ code: "INVALID_REQUEST" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(twitter),
  };
};
