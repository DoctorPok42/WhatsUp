import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import { Chats, UploadPopup, SideBar, InfoChats } from "../../../components";
import Cookies from "universal-cookie";
import emitEvent from "@/tools/webSocketHandler";
import { decryptMessage } from "@/tools/cryptMessage";
import downloadFile from "@/tools/downloadFile";
import jwt from 'jsonwebtoken';

const ChatsPage = ({ id, token, phone, userId } : any) => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<any>(null)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allMessages, setAllMessages] = useState<any>(null)
  const [isOnDrop, setIsOnDrop] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([]);
  const [firstTime, setFirstTime] = useState<boolean>(true)

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

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false)
      getConversations()
      getAllMessages()
    }
  }, [])

  useEffect(() => {
    if (allMessages && conversations) {
      setIsLoading(false)
    }
  }, [allMessages, conversations])

  const mainRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsOnDrop(true)
    }

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      setIsOnDrop(false)
    }

    mainRef.current?.addEventListener("dragover", onDragOver)
    mainRef.current?.addEventListener("dragleave", onDragLeave)

    return () => {
      mainRef.current?.removeEventListener("dragover", onDragOver)
      mainRef.current?.removeEventListener("dragleave", onDragLeave)
    }
  }, [mainRef])

  const handleAddFiles = (e: File[], directly: boolean) => {
    if (directly) {
      const inputBar = document.getElementById("inputBar")
      inputBar?.focus()
    } else {
      setFiles([...files, ...e])
    }
  }

  const handleDownloadFile = (fileId: string, name: string, type: string, content?: string) => {
    fileId = fileId + "." + type.split("/")[1]
    return downloadFile(token, fileId, name, type, content)
  }

  return (
    <>
      <Head>
        <title>Chats - WhatsUp</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main ref={mainRef} className="container">
        {(id && conversations && isOnDrop) &&
          <UploadPopup
            conversationName={conversations.find((conversation: any) => conversation._id === id[0]).name}
            onUpload={(e: File[], directly: boolean) => handleAddFiles(e, directly)}
            setIsOnDrop={setIsOnDrop}
          />
        }

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
          messages={
            allMessages?.[id[0]] ? allMessages[id[0]] : []
          }
          files={files}
          setFiles={setFiles}
        />
        {(id && conversations) && <InfoChats
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
          id={id[0]}
          token={token}
          conversations={conversations}
          setIsSearchOpen={setIsSearchOpen}
          downloadFile={handleDownloadFile}
        />}
      </main>
    </>
  );
}

export default ChatsPage;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  const cookies = new Cookies(context.req.headers.cookie);
  const token = cookies.get("token");

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, name: string };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: id || "",
      token: token,
      phone: decodedToken.name,
      userId: decodedToken.id,
    }
  };
}
