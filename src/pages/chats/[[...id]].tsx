import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, SideBar } from "../../../components";
import Cookies from "universal-cookie";
import InfoChats from "../../../components/InfoChats";
import emitEvent from "@/tools/webSocketHandler";

const ChatsPage = ({ id } : { id: string | undefined }) => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<any>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  const cookies = new Cookies();
  const token = cookies.get("token");
  const phone = cookies.get("phone");
  const userId = cookies.get("userId");

  useEffect(() => {
    if (!token || !phone || !userId) {
      router.push("/login");
    }
  }, [token, phone, userId]);

  const getConversations = async () => {
    emitEvent("getConversations", { token }, (data: any) => {
      if (data.status === "success") {
        setConversations(data.data)
      } else {
        alert(data.message)
        return []
      }
    })
  }

  useEffect(() => {
    getConversations()
  }, [])

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
        <Chats
          token={token}
          isConversation={id ? true : false}
          id={id && id[0]}
          userId={userId}
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
          getConversations={getConversations}
          conversations={conversations}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
        {id && <InfoChats
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
          id={id[0]}
          token={token}
          conversations={conversations}
          setIsSearchOpen={setIsSearchOpen}
        />}
      </main>
    </>
  );
}

export default ChatsPage;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  if (!id) {
    return {
      props: {
        id: ""
      }
    }
  }

  return {
    props: {
      id
    },
  };
}