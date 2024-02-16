import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Events } from "../types";

module.exports = async (events: Events) => {
  let eventsDir = join(__dirname, "../events");

  await readdirSync(eventsDir).forEach((folder) => {
    readdirSync(join(eventsDir, folder)).forEach((file) => {
      if (!file.endsWith(".js")) return;

      let event = require(`${eventsDir}/${folder}/${file}`).default;
      let eventName = file.split(".")[0] as keyof Events;

      events[eventName] = event;
    });
  })

  let nbEvents = Object.keys(events).length;
  console.log(color("text", `🔔 ${color("variable", nbEvents)} events have been ${color("variable", "registered.")}`));
}
