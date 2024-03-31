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

const initServer = async () => {
  try {
    const handlersDir = join(__dirname, "./handlers");
    readdirSync(handlersDir).forEach(async (handler) => {
      if (!handler.endsWith(".js")) return;
      require(`${handlersDir}/${handler}`)(events);
    });

    await checkCollections();

    const server = await createServer();
    const io = await new Server(server, {
      cors: {
        origin: process.env.SERVER_URL,
      },
    });

    startComunication(io, events);

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

    return io;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const io = initServer();

export { io };
