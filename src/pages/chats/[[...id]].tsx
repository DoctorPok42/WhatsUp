import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, SideBar } from "../../../components/";
import Cookies from "universal-cookie";
import InfoChats from "@/../components/InfoChats";
import emitEvent from "@/tools/webSocketHandler";
import { decryptMessage } from "@/tools/cryptMessage";
import { useWorker } from "@koale/useworker";
import crypto from "crypto";
import CryptoJS from 'crypto-js';

const ChatsPage = ({ id } : { id: string | undefined }) => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<any>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allMessages, setAllMessages] = useState<any>([])

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

  const handleDecryptMessages = (data: any) => {
    const messageLoaded: any = {};
    if (!data) return messageLoaded;

    data.forEach((conversation: any) => {
      const newMessages = conversation.messages.map((message: any) => {
        if (!message.content || !conversation.privateKey) return null;

        try {
          const bufferEncryptedMessage = atob(message.content) as any;
          if (!bufferEncryptedMessage) return null;
          /* const decryptedMessage = crypto.privateDecrypt(
            {
              key: conversation.privateKey,
              passphrase: "",
            },
            bufferEncryptedMessage
          ); */
          const decryptedMessage = CryptoJS.AES.decrypt(bufferEncryptedMessage, conversation.privateKey).toString(CryptoJS.enc.Utf8);
          message.content = decryptedMessage
        } catch (error) {
          console.error("Error decrypting message:", error);
          return null;
        }
        return { ...message, content: message.content };
      });
      messageLoaded[conversation.conversationId] = newMessages.reverse();
    });

    return messageLoaded;
  }

  const getAllMessages = async () => emitEvent("getAllMessages", { token }, async (data: any) => {
    try {
      if (data.messages === "All messages sent.") {
        worker(data.data).then((result: any) => {
          console.log(result);
          setAllMessages(result);
        }).catch((error: any) => {
          console.log(error);
          killWorker();
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  })

  const [worker, { kill: killWorker }] = useWorker(handleDecryptMessages, {
    autoTerminate: true,
    remoteDependencies: ["https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"]
  });

  const handleLoadApp = () => {
    setIsLoading(true)
  }

  useEffect(() => {
    handleLoadApp()
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
        <button onClick={getAllMessages}>Get all messages</button>

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
            id ? allMessages[id] : allMessages
          }
          setAllMessages={setAllMessages}
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

  return { props: { id: id || "" } };
}