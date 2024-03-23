import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Cookies from "universal-cookie";
import dotenv from 'dotenv'

dotenv.config()

import io from 'socket.io-client';

export const socket = io("http://172.17.0.1:8080", { transports: ["websocket"] });

const cookies = new Cookies();
export const token = cookies.get("token");

socket.emit("join", { token });

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
