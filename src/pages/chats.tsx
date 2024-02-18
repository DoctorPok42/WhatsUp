import React, { useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, SideBar } from "../../components";
import Cookies from "universal-cookie";

const ChatsPage = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const phone = cookies.get("phone");
  const userId = cookies.get("userId");

  useEffect(() => {
    if (!token || !phone || !userId) {
      router.push("/login");
    }
  }, [token, phone, userId]);

  return (
    <>
      <Head>
        <title>Chats - WhatsUp</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <SideBar path="/chats" phone={phone} />
        <Chats token={token} isConversation={false} userId={userId} />
      </main>
    </>
  );
}

export default ChatsPage;