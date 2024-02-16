import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Events } from "../types";

module.exports = (events: Events) => {
  let eventsDir = join(__dirname, "../events");

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    let event = require(`${eventsDir}/${file}`).default;
    let eventName = file.split(".")[0] as keyof Events;

    events[eventName] = event;
    console.log(color("text", `🔔 Event ${color("variable", eventName)} has been ${color("variable", "registered.")}`));
  });
}
