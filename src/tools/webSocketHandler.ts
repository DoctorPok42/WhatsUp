import { socket } from '../pages/_app';

const emitEvent = (eventName: string, data: any, callback: (data: any) => void) => {
  try {
    socket.on(eventName, (data: any) => {
      callback(data);
    });

    socket.emit(eventName, data, callback);
  } catch (error) {
    console.error(error);
  }
}

export default emitEvent;
