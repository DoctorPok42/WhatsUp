import React, { useState } from 'react';
import { Contact } from '..';
import HeaderChats from './header';
import InputBar from './inputBar';
import emitEvent from '@/tools/webSocketHandler';
import SearchGlobalBar from '../SearchGlobalBar';
import formatDate from '@/tools/formatDate';
import ChatsMessage from '../ChatsMessage';
import { socket } from '@/pages/_app';
import ContextMenu from '../ContextMenu';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { Box, LinearProgress } from '@mui/material';
import { cryptMessage } from '@/tools/cryptMessage';

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
  allMessages: any[]
  setAllMessages: (e: any[]) => void
}

const initialContextMenu = {
  isOpen: false,
  x: 0,
  y: 0,
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
  allMessages,
  setAllMessages,
}: ChatsProps) => {
  const [files, setFiles] = useState<File[]>([]);

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

  const getMessages = async (nbMessages?: boolean) => {
    if (!id) return
    emitEvent("getMessages", { token, conversationId: id, messageLoaded: nbMessages ? 0 : messageLoaded }, (data: any) => {
      setAllMessages(data.data)
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
    }

    setConversation(conversations.map(e => {
      if (e._id === data.conversationId) {
        e.lastMessage = data.content
        e.lastMessageDate = data.date
        e.lastMessageAuthorId = data.authorId
      }
      return e
    }))
  })

  socket.on("isTypingUser", (data: any) => {
    setTimeout(() => {
      setUserTyping("")
    }, 3000)

    setUserTyping(data)
  })

  const conversationName = conversations.find(e => e._id === id)?.name

  const onSend = (message: string) => {
    message = message.trim()
    if (!message && !files.length) return
    const tempId = Math.random().toString(36).substring(7)
    setAllMessages([...allMessages, { content: message, authorId: userId, phone, date: new Date().toISOString(), _id: `temp-${tempId}`, files, isTemp: true }])
    const encryptedMessage = cryptMessage(message, conversations.find(e => e._id === id)?.publicKey)
    if (!encryptedMessage) {
      setAllMessages(allMessages.filter(e => e._id !== `temp-${tempId}`))
      return
    }
    emitEvent("sendMessage", { token, conversationId: id, content: encryptedMessage }, (data: any) => {
      setAllMessages([...allMessages, data.data])
    })
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

  const conversationType = conversations.find(e => e._id === id)?.conversationType === "group"

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
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
    })
  }

  const closeContextMenu = () => setContextMenu(initialContextMenu)

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case "copy":
        copyToClipboard(allMessages.find(e => e._id === messageIdHoverContextMenu)?.content)
        break;
      case "clink":
        copyToClipboard(window.location.href + `/${messageIdHoverContextMenu}`)
        break;
      case "edit":
        setInputBarMode("edit")
        setInputBarValue(allMessages.find(e => e._id === messageIdHoverContextMenu)?.content)
        break;
      case "pin":
        emitEvent("pinMessage", { token, conversationId: id, messageId: messageIdHoverContextMenu }, (data: any) => {
          const conversationIndex = conversations.findIndex(e => e._id === id)
          const newConversations = [...conversations]
          newConversations[conversationIndex].pinnedMessages = data.data
          setConversation(newConversations)
        })
        break;
      case "delete":
        emitEvent("deleteMessage", { token, conversationId: id, messageId: messageIdHoverContextMenu }, (data: any) => {
          setAllMessages(allMessages.filter(e => e._id !== messageIdHoverContextMenu))
        })
        break;
    }
  }

  const handleAddReaction = (reaction: string) => {
    emitEvent("addReaction", { token, conversationId: id, messageId: messageIdHover, reaction }, (data: any) => {
      const messageIndex = allMessages.findIndex(e => e._id === data.data.messageId)

      const newAllMessages = [...allMessages]
      if (!newAllMessages[messageIndex].reactions)
        newAllMessages[messageIndex].reactions = []
      newAllMessages[messageIndex].reactions = data.data.messageToUpdate.reactions

      setAllMessages([...allMessages])
    })
  }

  if (isLoading) return (
    <div className={styles.Chats_container} style={{
      width: (isInfoOpen && id) ? 'calc(100% - 29em)' : 'calc(100% - 6em)',
      borderRadius: (isInfoOpen && id) ? '20px' : '20px 0 0 20px',
    }}>
      <div className={styles.Chats_loading}>
        <Box sx={{ width: '30%' }}>
          <LinearProgress color='success' style={{
            borderRadius: 20,
            height: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}/>
        </Box>
      </div>
    </div>
  )

  return (
    <div className={styles.Chats_container} style={{
      width: (isInfoOpen && id) ? 'calc(100% - 29em)' : 'calc(100% - 6em)',
      borderRadius: (isInfoOpen && id) ? '20px' : '20px 0 0 20px',
    }}>
      {contextMenu.isOpen &&
        <ContextMenu
          {...contextMenu}
          closeContextMenu={closeContextMenu}
          handleContextMenuAction={handleContextMenuAction}
          handleAddReaction={handleAddReaction}
          message={allMessages.find(e => e._id === messageIdHoverContextMenu)}
          userId={userId}
          isMessagePin={conversations.find(e => e._id === id)?.pinnedMessages.includes(messageIdHoverContextMenu)}
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

      {(isConversation && isInfoOpen !== undefined && setIsInfoOpen !== undefined) && <div className={styles.Chats_content}>
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
          {id && allMessages[id].map((e: any, index: number) => {
            if (e === null) return
            if (allMessages[id][index - 1] && !isSameDay(new Date(e.date), new Date(allMessages[id][index - 1].date))) {
              return (
                <div key={index} className={styles.Chats_date}>
                  <p>{formatDate(new Date(e.date), true)}</p>
                  <ChatsMessage
                    key={index}
                    message={e}
                    isGroup={conversationType}
                    userId={userId}
                    allMessages={allMessages[id]}
                    index={index}
                    handleContextMenu={handleContextMenu}
                    setMessageIdHover={setMessageIdHover}
                    handleAddReaction={handleAddReaction}
                  />
                </div>
              )
            } else {
              return <ChatsMessage
                key={index}
                message={e}
                isGroup={false}
                userId={userId}
                allMessages={allMessages[id]}
                index={index}
                handleContextMenu={handleContextMenu}
                setMessageIdHover={setMessageIdHover}
                handleAddReaction={handleAddReaction}
              />
            }
          })}
        </div>

        {userTyping && <div className={styles.Chats_typing}>
          <p>{userTyping} is typing...</p>
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
      </div>}
    </div>
  );
};

export default Chats;
