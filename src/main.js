"use strict";

const app = document.getElementById("app");
const display = document.querySelector(".display");
const time = display.querySelector(".time");
const date = display.querySelector(".date");
const region = display.querySelector(".region");
const period = display.querySelector(".period");
const offset = display.querySelector(".offset");
const dayPeriod = time.querySelector("span");

const inputSearch = document.querySelector(".timezones input");
const timezoneContainer = document.querySelector(".timezones ul");

function parseParts(format, timestamp) {
  const parts = {};
  const fields = format.formatToParts(timestamp).forEach((p) => {
    if (Object.keys(formatOptions).includes(p.type)) {
      parts[p.type] = p.value;
    }
  });
  return parts;
}

function initTimezoneDST() {
  let timezones = Intl.supportedValuesOf("timeZone");

  timezones = timezones.map((tz, idx) => {
    let name = tz.trim().replace("/", " ").split(" ");
    name = `${name[1]}, ${name[0]}`.replace(/[\_]/g, " ");

    return { idx, timeZone: tz, name };
  });

  timezones = timezones.sort((a, b) => a.name.localeCompare(b.name));
  return timezones;
}

// let UTCTIMESTAMP = 0;
let elapsedTime = 0;
let timezone = { idx: -1, timeZone: "GMT", name: "UTC" };
const timezones = initTimezoneDST();
const formatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "shortOffset",
};

function initTime() {
  const t0 = performance.now();
  fetch("/api")
    .then((response) => response.json())
    .then((data) => {
      const rtt = performance.now() - t0;
      const divergence = rtt / 2;
      const remoteTime = data.timestamp + divergence;

      elapsedTime = remoteTime - Date.now();
      console.log(elapsedTime, t0, rtt, divergence, data);
    })
    .catch((err) => {
      console.log(err);
    });
}
initTime();

function showTime() {
  const utcTimestamp = new Date(Date.now() + elapsedTime);

  const timeFormat = new Intl.DateTimeFormat(["en-US", "en"], {
    ...formatOptions,
    timeZone: timezone.timeZone,
  });
  const prt = parseParts(timeFormat, utcTimestamp);

  time.textContent = `${prt.hour}:${prt.minute}:${prt.second}`;
  period.textContent = prt.dayPeriod;
  offset.textContent = prt.timeZoneName;
  date.textContent = `${prt.weekday} ${prt.month}, ${prt.day} ${prt.year}`;
  region.textContent = timezone.name;

  new Date(utcTimestamp);
}

setInterval(showTime, 1000);

function showTimezone(tzones) {
  timezoneContainer.innerHTML = "";

  tzones.forEach((tz) => {
    const liNode = document.createElement("li");

    for (const [key, value] of Object.entries(tz)) {
      liNode.dataset[key] = value;
    }
    liNode.textContent = tz.name;
    timezoneContainer.appendChild(liNode);
  });
}

inputSearch.addEventListener("input", (e) => {
  e.preventDefault();

  const pattern = new RegExp(e.target.value, "gi");
  const matchs = timezones.filter((tz) => {
    return tz.timeZone.match(pattern) || tz.name.match(pattern);
  });

  showTimezone(matchs.length < 15 ? matchs : matchs.slice(0, 15));
});

timezoneContainer.addEventListener("click", (e) => {
  e.preventDefault();

  const tz = e.target.dataset;
  if (tz) {
    timezone = tz;
    showTime();
    time.scrollIntoView();
  }
});

showTimezone(timezones.slice(0, 15));

document.addEventListener("DOMContentLoaded", () => {
  app.style.opacity = "1";
});
