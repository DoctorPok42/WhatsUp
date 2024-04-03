import { createServer } from "http";
import { Server } from "socket.io";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { Events } from "./types";
import { checkCollections, color } from "./functions";
import startComunication from "./socket";

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

export { io };
