import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, SideBar } from "../../../components";
import Cookies from "universal-cookie";
import InfoChats from "../../../components/InfoChats";

const ChatsPage = ({ id } : { id: string }) => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)

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
        <Chats token={token} isConversation={true} id={id} userId={userId} isInfoOpen={isInfoOpen} setIsInfoOpen={setIsInfoOpen} />
        <InfoChats isInfoOpen={isInfoOpen} setIsInfoOpen={setIsInfoOpen} id={id} token={token} />
      </main>
    </>
  );
}

export default ChatsPage;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  return {
    props: {
      id
    },
  };
}