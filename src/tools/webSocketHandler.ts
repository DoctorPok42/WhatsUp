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
        console.log(data);
      }
    });

    socket.emit(eventName, data, callback);
  } catch (error) {
    console.error(error);
  }
};

export default emitEvent;
