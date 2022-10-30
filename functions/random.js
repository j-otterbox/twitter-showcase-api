const twitterClient = require("../util/twitterClient");

exports.handler = async (event, context) => {
  if (Object.keys(event.queryStringParameters).length === 0) {
    const response = await twitterClient.getRandom();

    // getRandom will return empty objects in case of error or no data
    // but will always return something so only 200 status code is handled
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: 200,
        statusText: "OK",
        data: response,
      }),
    };
  }
  // request had parameters so its bad
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
