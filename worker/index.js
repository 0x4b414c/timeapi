const padString = (value, length = 2, fill = "0") =>
  `${value}`.padStart(length, fill);

function getUTCDateTime() {
  const datetime = new Date();

  const year = datetime.getUTCFullYear();
  const month = padString(datetime.getUTCMonth() + 1);
  const day = padString(datetime.getUTCDate());

  const hour = padString(datetime.getUTCHours());
  const minute = padString(datetime.getUTCMinutes());
  const second = padString(datetime.getUTCSeconds());

  const date = `${year}:${month}:${day}`;
  const time = `${hour}:${minute}:${second}`;

  const timeZone = "UTC";
  const isoString = datetime.toISOString();
  const unixTimestamp = Math.floor(datetime.getTime() / 1000);

  return {
    date,
    time,
    isoString,
    unixTimestamp,
    timeZone,
    parts: {
      year,
      month,
      day,
      hour,
      minute,
      second,
    },
  };
}

export default {
  fetch(request) {
    return Response.json(getUTCDateTime());
  },
};
