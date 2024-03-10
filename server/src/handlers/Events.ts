import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";

module.exports = async (events: any) => {
  let eventsDir = join(__dirname, "../events");

  await readdirSync(eventsDir).forEach((folder) => {
    readdirSync(join(eventsDir, folder)).forEach((file) => {
      if (!file.endsWith(".js")) return;

      let event = require(`${eventsDir}/${folder}/${file}`).default;
      let eventName = file.split(".")[0];

      event.params = require(`${eventsDir}/${folder}/${file}`).params;

      events[eventName] = event;
    });
  })

  let nbEvents = Object.keys(events).length;
  console.log(color("text", `🔔 ${color("variable", nbEvents)} events have been ${color("variable", "registered.")}`));
}
