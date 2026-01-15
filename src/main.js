import "./style.css";
import ClockIcon from "./assets/clock.svg";

document.querySelector("#app").innerHTML = `
  <main>
  <div id="datetime">
      <img class="icon" src=${ClockIcon} />
      <section id="date"></section>
      <section id="time"></section>
    </div>
  </main>
`;

const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");

export function showTime() {
  const datetime = new Date();

  const date = datetime.toLocaleDateString().replaceAll("/", "-");
  const time = datetime.toLocaleTimeString();

  dateElement.textContent = date;
  timeElement.textContent = time;
}

setInterval(() => showTime(), 1000);
