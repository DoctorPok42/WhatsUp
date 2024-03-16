import { createServer } from "http";
import { Server } from "socket.io";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { Events } from "./types";
import { checkAuthToken, checkCollections, color } from "./functions";

config();

let events = {} as Events;

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith(".js")) return;
  require(`${handlersDir}/${handler}`)(events);
});

checkCollections();

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.SERVER_URL,
  },
});

io.on("connection", (socket: any) => {
  console.log(
    color(
      "text",
      `🔌 Client ${color("variable", socket.id)} has been ${color(
        "variable",
        "connected."
      )}`
    )
  );

  for (const [eventName, event] of Object.entries(events)) {
    socket.on(eventName, async (data: any) => {
      if (!data || Object.keys(data).length === 0)
        return socket.emit(eventName, {
          status: "error",
          message: "Data not found.",
        });

      try {
        if (event.params && event.params.authRequired) {
          const decoded = checkAuthToken(data.token);
          if (decoded && decoded.id) {
            const response = await event(data, decoded, socket.id);
            socket.emit(eventName, response);
          } else {
            socket.emit(eventName, {
              status: "error",
              message: "Invalid token.",
            });
          }
        } else {
          const response = await event(data, socket.id);
          socket.emit(eventName, response);
        }
      } catch (error) {
        console.error(error);
        socket.emit(eventName, {
          status: "error",
          message: "An error occurred.",
        });
      }
    });
  }

  socket.on("disconnect", () => {
    console.log(
      color(
        "text",
        `🔌 Client ${color("variable", socket.id)} has been ${color(
          "variable",
          "disconnected."
        )}`
      )
    );
  });
});

server.listen(process.env.PORT, () => {
  console.log(
    color(
      "text",
      `🚀 Server is running on ${color("variable", process.env.PORT)}`
    )
  );
});

export { io };
