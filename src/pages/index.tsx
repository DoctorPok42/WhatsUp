import React from "react";
import Head from "next/head";
import { SideBar } from "../../components";

export default function Home() {
  return (
    <>
      <Head>
        <title>WhatsUp</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <SideBar path="/" />
      </main>
    </>
  );
}
