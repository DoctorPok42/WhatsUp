import { createServer } from 'http';
import { Server } from 'socket.io';
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { Events } from "./types";
import { color } from './functions';

config();

let events = {} as Events;

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(events);
})

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: process.env.SERVER_URL,
    }
});

io.on("connection", (socket) => {
    console.log(color("text", `🔌 Client ${color("variable", socket.id)} has been ${color("variable", "connected.")}`));

    for (const [eventName, event] of Object.entries(events)) {
        socket.on(eventName, async (data) => {
            try {
                const response = await event(data);
                socket.emit(eventName, response);
            } catch (error) {
                console.error(error);
                socket.emit(eventName, { status: "error", message: "An error occurred." });
            }
        });
    }
});

server.listen(process.env.PORT, () => {
    console.log(color("text", `🚀 Server is running on ${color("variable", process.env.PORT)}`));
});
