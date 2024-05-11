import React, { useEffect, useState } from 'react';
import { Contact, Loading } from '..';
import HeaderChats from './header';
import InputBar from './inputBar';
import emitEvent from '@/tools/webSocketHandler';
import SearchGlobalBar from '../SearchGlobalBar';
import formatDate from '@/tools/formatDate';
import ChatsMessage from '../ChatsMessage';
import { socket } from '@/pages/_app';
import ContextMenu from '../ContextMenu';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { cryptMessage } from '@/tools/cryptMessage';
import downloadFile from '@/tools/downloadFile';
import ContextMenuFunctions from '../ContextMenu/functions';

import styles from './style.module.scss';

interface ChatsProps {
  token: string
  isConversation: boolean
  id?: any
  userId: string
  isInfoOpen?: boolean
  setIsInfoOpen?: (e: boolean) => void
  conversations: any[]
  setConversation: (e: any[]) => void
  getConversations?: () => void
  isSearchOpen?: boolean
  setIsSearchOpen?: (e: boolean) => void
  isLoading: boolean
  phone: string
  messages: any[]
  setMessages: (convId: string, messages: any[]) => void
  files: File[]
  setFiles: (e: File[]) => void
}

const initialContextMenu = {
  isOpen: false,
  x: 0,
  y: 0,
  e: null,
}

const Chats = ({
  token,
  isConversation,
  id,
  userId,
  isInfoOpen,
  setIsInfoOpen,
  conversations,
  setConversation,
  getConversations,
  isSearchOpen = false,
  setIsSearchOpen,
  isLoading,
  phone,
  messages,
  setMessages,
  files,
  setFiles,
}: ChatsProps) => {
  const [allMessages, setAllMessages] = useState<any[]>(messages)

  const [messageLoaded, setMessageLoaded] = useState<number>(0)
  const [userTyping, setUserTyping] = useState<string>("")
  const [searchState, setSearchState] = useState<"message" | "user">("user")
  const [contextMenu, setContextMenu] = useState(initialContextMenu)
  const [showContact, setShowContact] = useState<boolean>(true)

  const [messageIdHover, setMessageIdHover] = useState<string | null>(null)
  const [messageIdHoverContextMenu, setMessageIdHoverContextMenu] = useState<string | null>(null)
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [inputBarMode, setInputBarMode] = useState<"chat" | "edit">("chat")
  const [inputBarValue, setInputBarValue] = useState<string>("")
  const [canHaveNewMessages, setCanHaveNewMessages] = useState<boolean>(true)
  const [isForceUnread, setIsForceUnread] = useState<boolean>(false)
  const [lastReaction, setLastReaction] = useState<{ value: string, authorId: string[] }[] | null>(null)

  const updateMessage = () => setMessages(id, allMessages);

  const getMessages = async (nbMessages?: boolean) => {
    if (!id) return
    emitEvent("getMessages", { token, conversationId: id, messageLoaded: nbMessages ? 0 : messageLoaded }, (data: any) => {
      setAllMessages(data.data)
      updateMessage()
      setMessageLoaded(
        nbMessages ? 10 : messageLoaded + 10
      )
      setConversation(conversations.map(e => {
        if (e._id === id) {
          e.unreadMessages = 0
        }
        return e
      }))
    })
  }

  socket.on("message", (data: any) => {
    if (data.conversationsId === id) {
      setAllMessages([...allMessages, data])
    } else {
      const conversationIndex = conversations.findIndex(e => e._id === data.conversationsId)
      const newConversations = [...conversations]
      newConversations[conversationIndex].unreadMessages++
      setConversation(newConversations)
    }

    updateMessage()
  })

  socket.on("isTypingUser", (data: any) => {
    setTimeout(() => {
      setUserTyping("")
    }, 3000)

    setUserTyping(data)
  })

  socket.on("reaction", (data: any) => {
    if (lastReaction && lastReaction == data.reaction) return
    if (data.conversationId !== id) return
    const messageIndex = allMessages.findIndex(e => e._id === data.messageId)

    const newAllMessages = [...allMessages]
    if (messageIndex === -1) return
    if (!newAllMessages[messageIndex]?.reactions)
      newAllMessages[messageIndex].reactions = []
    newAllMessages[messageIndex].reactions = data.reaction

    setLastReaction(data.reaction)
    setAllMessages(newAllMessages)
    updateMessage()
  })

  const conversationName = conversations?.find(e => e._id === id)?.name

  const sendFile = (file: File) => {
    let fileBuffer;
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = () => {
      fileBuffer = Buffer.from(reader.result as ArrayBuffer)
      const fileToSend = { name: file.name, type: file.type, size: file.size, buffer: fileBuffer }

      emitEvent("sendMessage", { token, conversationId: id, content: "", files: fileToSend }, (data: any) => {
        setAllMessages([...allMessages, data.data])
        updateMessage()
      })
    }
  }

  const onSend = (message: string) => {
    message = message.trim()
    if (!message && !files.length) return
    const tempId = Math.random().toString(36).substring(7)
    setAllMessages([...allMessages, { content: message, authorId: userId, img: phone, date: new Date().toISOString(), _id: `temp-${tempId}`, files, isTemp: true }])
    // Crypt message
    const encryptedMessage = cryptMessage(message, conversations.find(e => e._id === id)?.publicKey)
    if (!encryptedMessage) {
      setAllMessages(allMessages.filter(e => e._id !== `temp-${tempId}`))
      return
    }

    // Send files if there are some
    if (files.length > 0) {
      files.map(e => {
        sendFile(e)
      })
    } else {
      const isLink = message.match(/(https?:\/\/[^\s]+)/g);
      emitEvent("sendMessage", { token, conversationId: id, content: encryptedMessage, files: null, isLink }, (data: any) => {
        setAllMessages([...allMessages, {
          ...data.data,
          content: message,
        }])
        updateMessage()
      })
    }
  }

  const onEdit = (message: string) => {
    message = message.trim()
    if (!message) return
    const encryptedMessage = cryptMessage(message, conversations.find(e => e._id === id)?.publicKey)
    emitEvent("editMessage", { token, conversationId: id, messageId: messageIdHoverContextMenu, content: encryptedMessage }, () => {
        const messageIndex = allMessages.findIndex(e => e._id === messageIdHoverContextMenu)

        const newAllMessages = [...allMessages]
        newAllMessages[messageIndex].content = message
        setAllMessages([...allMessages])
        setInputBarMode("chat")
    })
  }


  const handleDownloadFile = (fileId: string, name: string, type: string, content?: string) => {
    return downloadFile(token, fileId, name, type, content)
  }

  const onAttach = (e: File[]) => {
    setFiles([...files, ...e]);
  }

  const onTyping = () => {
    emitEvent("isTyping", { token, conversationId: id })
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  }

  const handleScroll = (e: any) => {
    const element = e.target
    if (element.scrollTop === 0) {
      getMessages()
    }
  }

  const conversationType = conversations?.find(e => e._id === id)?.conversationType === "group"

  const handleContextMenu = (e: any) => {
    e.preventDefault()

    setMessageIdHoverContextMenu(messageIdHover)
    const { pageX, pageY } = e

    let x = pageX
    let y = pageY

    if (window.innerWidth - pageX < 200) x = pageX - 200
    if (window.innerHeight - pageY < 270) y = pageY - 220

    setContextMenu({
      isOpen: true,
      x,
      y,
      e,
    })
  }

  const closeContextMenu = () => setContextMenu(initialContextMenu)

  const handleContextMenuAction = (action: string) => {
    ContextMenuFunctions(action, token, id, allMessages, conversations, setConversation, setAllMessages, updateMessage, setInputBarMode, setInputBarValue, emitEvent, messageIdHoverContextMenu, copyToClipboard, setCanHaveNewMessages, userId, setIsForceUnread)
  }

  const handleAddReaction = (reaction: string) => {
    emitEvent("addReaction", { token, conversationId: id, messageId: messageIdHover, reaction }, (data: any) => {
      const messageIndex = allMessages.findIndex(e => e._id === data.data.messageId)

      const newAllMessages = [...allMessages]
      if (!newAllMessages[messageIndex].reactions)
        newAllMessages[messageIndex].reactions = []
      newAllMessages[messageIndex].reactions = data.data.messageToUpdate.reactions

      setAllMessages(newAllMessages)
      updateMessage()
    })
  }

  useEffect(() => {
    setAllMessages(messages)

    if (isForceUnread) return

    setTimeout(() => {
      emitEvent("viewMessage", { token, conversationId: id }, () => {
        setCanHaveNewMessages(false)
      })
    }, 5000)
  }, [messages])

  if (isLoading) return <Loading />

  return (
    <div className={styles.Chats_container} style={{
      width: (isInfoOpen && id) ? 'calc(100% - 24em)' : 'calc(100% - 6em)',
      borderRadius: (isInfoOpen && id) ? '20px' : '20px 0 0 20px',
    }}>
      {contextMenu.isOpen &&
        <ContextMenu
          {...contextMenu}
          closeContextMenu={closeContextMenu}
          handleContextMenuAction={handleContextMenuAction}
          handleAddReaction={handleAddReaction}
          message={allMessages.find((e: any) => e._id === messageIdHoverContextMenu)}
          userId={userId}
          isMessagePin={conversations.find(e => e._id === id)?.pinnedMessages.includes(messageIdHoverContextMenu)}
          downloadFile={handleDownloadFile}
        />
      }

      <SearchGlobalBar
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
        token={token}
        userId={userId}
        conversationId={id}
        usersConversation={conversations.find(e => e._id === id)?.membersId}
        getConversations={getConversations}
        state={searchState}
        setSearchState={setSearchState}
        setAllMessages={setAllMessages}
      />

      <Contact
        token={token}
        id={id}
        conversations={conversations}
        userId={userId}
        isLoading={isLoading}
        showContact={showContact}
        setShowContact={setShowContact}
      />

      {(isConversation && isInfoOpen !== undefined && setIsInfoOpen !== undefined) &&
        <div
          className={styles.Chats_content}
          style={{
            width: showContact ? 'calc(100% - 25em)' : 'calc(100% - 5.65em)',
          }}
        >
          <HeaderChats
            isInfoOpen={isInfoOpen}
            setIsInfoOpen={setIsInfoOpen}
            conversationName={conversationName}
            setIsSearchOpen={setIsSearchOpen}
            setSearchState={setSearchState}
          />

          <div className={styles.Chats_messages} onScroll={handleScroll} onLoad={() => {
              const element = document.querySelector(`.${styles.Chats_messages}`)
              if (element && allMessages.length === 20) {
                element.scrollTop = element.scrollHeight
              }
            }}
            onContextMenu={(e) => {e.preventDefault()}}
          >
            {(id && allMessages.length > 0) && allMessages.map((e: any, index: number) => {
              if (e === null) return
              if (allMessages[index - 1] && !isSameDay(new Date(e.date), new Date(allMessages[index - 1].date))) {
                return (
                  <div key={index} className={styles.Chats_date}>
                    <p>{formatDate(new Date(e.date), true)}</p>
                    <ChatsMessage
                      key={index}
                      message={e}
                      isGroup={conversationType}
                      userId={userId}
                      allMessages={allMessages}
                      index={index}
                      handleContextMenu={handleContextMenu}
                      setMessageIdHover={setMessageIdHover}
                      handleAddReaction={handleAddReaction}
                      downloadFile={handleDownloadFile}
                      canHaveNewMessages={canHaveNewMessages}
                    />
                  </div>
                )
              } else {
                return <ChatsMessage
                  key={index}
                  message={e}
                  isGroup={false}
                  userId={userId}
                  allMessages={allMessages}
                  index={index}
                  handleContextMenu={handleContextMenu}
                  setMessageIdHover={setMessageIdHover}
                  handleAddReaction={handleAddReaction}
                  downloadFile={handleDownloadFile}
                  canHaveNewMessages={canHaveNewMessages}
                />
              }
            })}
          </div>

          {userTyping && <div className={styles.Chats_typing}>
            <p><span>{userTyping}</span> is typing...</p>
          </div>}

          <InputBar
            files={files}
            onSend={onSend}
            onEdit={onEdit}
            onAttach={onAttach}
            onTyping={onTyping}
            setFiles={setFiles}
            mode={inputBarMode}
            setMode={setInputBarMode}
            value={inputBarValue}
          />
        </div>
      }
    </div>
  );
};

export default Chats;
