exports.handler = async (event, context) => {
  const { params = "None" } = event.queryStringParameters;
  return {
    statusCode: 200,
    body: `Params, ${params}`,
  };
};
