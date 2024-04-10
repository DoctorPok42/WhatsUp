import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, SideBar } from "../../../components/";
import Cookies from "universal-cookie";
import InfoChats from "@/../components/InfoChats";
import emitEvent from "@/tools/webSocketHandler";
import { decryptMessage } from "@/tools/cryptMessage";
import Script from "next/script";

const ChatsPage = ({ id } : { id: string }) => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<any>(null)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allMessages, setAllMessages] = useState<any>(null)

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
      const conversations = data.data.map((conversation: any) => {
        const lastMessageDecrypted = decryptMessage(conversation.lastMessage, conversation.key)
        return {
          ...conversation,
          lastMessage: lastMessageDecrypted,
        }
      })
      setConversations(conversations)
    })
  }

  const getAllMessages = async () => emitEvent("getAllMessages", { token }, async (data: any) => {
    if (data.messages === "All messages sent.") setAllMessages(data.data)
  })

  const startChat = async () => {
    getConversations()
    getAllMessages()
  }

  useEffect(() => {
    if (allMessages && conversations) {
      setIsLoading(false)
    }
  }, [allMessages, conversations])

  return (
    <>
      <Head>
        <title>Chats - WhatsUp</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/0.1.0/lodash.min.js"
        onLoad={startChat}
      />

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
          setConversation={setConversations}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isLoading={isLoading}
          phone={phone}
          allMessages={
            (id && allMessages) && allMessages[id[0]]
              ? allMessages[id[0]]
              : []
          }
          setAllMessages={setAllMessages}
        />
        {(id && conversations) && <InfoChats
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

  return { props: { id: id || "" } };
}