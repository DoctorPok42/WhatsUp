import { Server } from "socket.io";
import { checkAuthToken, color } from "./functions";
import { Events } from "./types";

const startComunication = (io: Server, events: Events) => {
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
};

export default startComunication;
