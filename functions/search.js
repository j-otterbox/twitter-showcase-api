const twitterClient = require("../util/twitterClient");

exports.handler = async (event, context) => {
  let param;
  let searchType;

  if (event.queryStringParameters.username) {
    param = event.queryStringParameters.username;

    const isValidTwitterHandle = /^(\w){1,15}$/.test(param);
    if (isValidTwitterHandle) {
      searchType = "username";
    } else {
      searchType = "keywords";
    }
  } else if (event.queryStringParameters.keywords) {
    param = event.queryStringParameters.keywords;
    searchType = "keywords";
  }

  if (param) {
    const response = await twitterClient.get(param, searchType);

    // request went through to Twitter and returned response
    if (response.status === 200) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          status: 200,
          statusText: "OK",
          data: response.data,
        }),
      };
    }
    // request was sent but something went wrong
    else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          status: 400,
          statusTxt: "Bad Request",
          ErrorMsg: response.data.detail,
        }),
      };
    }
  }
  // request that was passed from the client was bad
  else {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: 400,
        statusText: "Bad Request",
      }),
    };
  }
};
