import { createServer } from "http";
import { Server } from "socket.io";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { Events, User } from "./types";
import { checkCollections, color } from "./functions";
import UserModel from "./schemas/users";
import dashboardActions from "./userDashboard";
import startComunication from "./socket";
import cron from "node-cron";

config();

let events = {} as Events;

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.SERVER_URL,
  },
});

const initServer = async () => {
  try {
    const handlersDir = join(__dirname, "./handlers");
    readdirSync(handlersDir).forEach(async (handler) => {
      if (!handler.endsWith(".js")) return;
      require(`${handlersDir}/${handler}`)(events);
    });

    const check = Promise.all([
      checkCollections(),
      startComunication(io, events),
    ]);
    await check;

    server.listen(Number(process.env.PORT), () => {
      console.log(
        color(
          "text",
          `🚀 Server is running on ${color(
            "variable",
            Number(process.env.PORT)
          )}`
        )
      );
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

initServer();

cron.schedule("0 0 1 * *", () => {
  UserModel.find({ "options.hasDashboard": true }, (err: any, res: any) => {
    if (err) console.error(err);
    if (res) {
      res.forEach((user: User) => {
        dashboardActions("resetMessages", user._id);
      });
    }
  });
});

export { io };
