const axios = require("axios");
require("dotenv").config();

const client = axios.create({
  baseURL: "https://api.twitter.com/2/tweets/search/",
  timeout: 5000,
  headers: {
    "User-Agent": "v2RecentSearchJS",
    authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  },
});

const getQueryString = (params, searchType) => {
  let query;

  if (searchType === "username") {
    query = `from:${params}`;
  } else if (searchType === "keywords") {
    query = encodeURIComponent(params);
  }

  return `recent?query=${query}&expansions=author_id,attachments.media_keys&user.fields=created_at,description,entities,name,profile_image_url,public_metrics,username,verified&tweet.fields=created_at,entities,public_metrics&media.fields=preview_image_url,url`;
};

const formatSearchResponse = (twitterAPIResponse, searchType) => {
  const includes = twitterAPIResponse.data.includes; // shorten obj prop chain
  const data = twitterAPIResponse.data.data;
  const formattedResponse = {};

  if (twitterAPIResponse.data.meta.result_count === 0) {
    return formattedResponse;
  }

  formattedResponse.tweets = data.map((tweet) => {
    let newTweet = {
      id: tweet.id,
      created_at: tweet.created_at,
      text: tweet.text,
      entities: tweet.entities,
      public_metrics: tweet.public_metrics,
    };

    if (searchType === "keywords") {
      // bundle account data w/ each individual tweet
      newTweet = {
        ...newTweet,
        account: {
          ...includes.users.find((user) => user.id === tweet.author_id),
        },
      };
    }

    // include media when applicable
    if (tweet.attachments?.media_keys) {
      newTweet.media = [];
      for (const key of tweet.attachments.media_keys) {
        newTweet.media.push(
          includes.media.find((elem) => key === elem.media_key)
        );
      }
    }

    return newTweet;
  });

  // reduce response size by attaching account data
  // separately when only one user's tweets are returned
  if (searchType === "username") {
    formattedResponse.account = {
      ...includes.users[0],
    };
  }

  return formattedResponse;
};

exports.get = async (params, searchType) => {
  const query = getQueryString(params, searchType);
  const response = await client
    .get(query)
    .then((resp) => resp)
    .catch((err) => err.response);

  // format successful request, return error response as is
  if (response.status === 200) {
    response.data = formatSearchResponse(response, searchType);
  }

  return response;
};
