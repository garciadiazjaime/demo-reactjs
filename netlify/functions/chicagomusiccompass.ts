const handler = async () => {
  const url = "https://www.chicagomusiccompass.com/.netlify/functions/events";
  const response = await fetch(url).then();

  const data = await response.json().catch(() => ({
    events: [],
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(
      data.events.slice(0, 5).map((item: { name: string }) => ({
        name: item.name,
      }))
    ),
  };
};

module.exports = {
  handler,
};
