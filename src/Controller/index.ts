import { socket } from "@/pages/_app";

type EventListName = "message" | "isTypingUser" | "reaction";

const eventsList = new Map<string, (data: any) => void>();

const eventToFunctionMap = {
  message: (args) => {},
  isTypingUser: (args) => {},
  reaction: (args) => {},
} as {
  [key in EventListName]: (args: any) => any;
};

const controller = (
  eventName: EventListName,
  args: any,
  callback: (data: any) => any
) => {
  eventsList.set(eventName, () => {
    const eventFunction = eventToFunctionMap[eventName](args);
    return callback(eventFunction);
  });
};

export const listenToSocketEvents = () => {
  socket.onAny((event, data) => {
    const eventName = event as EventListName;
    const callback = eventsList.get(eventName);
    if (callback) {
      callback(data);
    }
  });
};

export default controller;
