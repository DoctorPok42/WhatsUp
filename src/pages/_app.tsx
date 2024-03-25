import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Cookies from "universal-cookie";
import dotenv from 'dotenv'

dotenv.config()

import io from 'socket.io-client';

console.log(process.env.SERVER_URL)

export const socket = io(
  process.env.SERVER_URL as string,
  { transports: ["websocket"], secure: true });

const cookies = new Cookies();
export const token = cookies.get("token");

socket.emit("join", { token });

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
