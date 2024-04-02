import { socket } from "../pages/_app";

const emitEvent = (
  eventName: string,
  data: any,
  callback?: (data: any) => void
) => {
  try {
    socket.on(eventName, (data: any) => {
      if (data.status === "success") {
        callback && callback(data);
      } else {
        console.error(data.message);
      }
    });

    socket.emit(eventName, data, callback);
  } catch (error) {
    return null;
  }
};

export default emitEvent;
