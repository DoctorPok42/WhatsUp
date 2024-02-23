import React, { useEffect, useState } from 'react';
import { Contact } from '..';
import HeaderChats from './header';
import InputBar from './inputBar';
import emitEvent from '../../src/tools/webSocketHandler';
import SearchGlobalBar from '../SearchGlobalBar';
import formatDate from '@/tools/formatDate';
import ChatsMessage from '../ChatsMessage';
import { socket } from '@/pages/_app';

import styles from './style.module.scss';

interface ChatsProps {
  token: string
  isConversation: boolean
  id?: string
  userId: string
  isInfoOpen?: boolean
  setIsInfoOpen?: (e: boolean) => void
  conversations: any[]
  getConversations?: () => void
  isSearchOpen?: boolean
  setIsSearchOpen?: (e: boolean) => void
}

const Chats = ({
  token,
  isConversation,
  id,
  userId,
  isInfoOpen,
  setIsInfoOpen,
  conversations,
  getConversations,
  isSearchOpen = false,
  setIsSearchOpen,
}: ChatsProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const [allMessages, setAllMessages] = useState<any[]>([])
  const [messageLoaded, setMessageLoaded] = useState<number>(0)
  const [userTyping, setUserTyping] = useState<string>("")
  const [searchState, setSearchState] = useState<"message" | "user">("user")

  const getMessages = async (nbMessages?: boolean) => {
    emitEvent("getMessages", { token, conversationId: id, messageLoaded: nbMessages ? 0 : messageLoaded }, (data: any) => {
      if (data.status === "success") {
        setAllMessages(data.data)
        setMessageLoaded(
          nbMessages ? 10 : messageLoaded + 10
        )
      } else {
        alert(data.message)
      }
    })
  }

  socket.on("message", (data: any) => {
    setAllMessages([...allMessages, data])
  })

  socket.on("isTypingUser", (data: any) => {
    setTimeout(() => {
      setUserTyping("")
    }, 3000)

    setUserTyping(data)
  })

  useEffect(() => {
    getConversations && getConversations()
    getMessages(true)
  }, [id])

  const conversationName = conversations.find(e => e._id === id)?.name

  const onSend = (message: string) => {
    emitEvent("sendMessage", { token, conversationId: id, content: message }, (data: any) => {
      if (data.status === "success") {
        setAllMessages([...allMessages, data.data])
        getConversations && getConversations()
      } else {
        alert(data.message)
      }
    })
  }

  const onAttach = (e: File[]) => {
    setFiles([...files, ...e]);
  }

  const onTyping = () => {
    emitEvent("isTyping", { token, conversationId: id }, (data: any) => {
      if (data.status === "error") {
        alert(data.message)
      }
    })
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

  return (
    <div className={styles.Chats_container} style={{
      width: (isInfoOpen && id) ? 'calc(100% - 29em)' : 'calc(100% - 6em)',
      borderRadius: (isInfoOpen && id) ? '20px' : '20px 0 0 20px',
    }}>
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
      <Contact token={token} id={id} conversations={conversations} userId={userId} />

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
        }
        }>
          {allMessages.map((e, index) => {
            if (allMessages[index - 1] && !isSameDay(new Date(e.date), new Date(allMessages[index - 1].date))) {
              return (
                <div key={index} className={styles.Chats_date}>
                  <p>{formatDate(new Date(e.date), true)}</p>
                  <ChatsMessage key={index} message={e} isGroup={conversationType} userId={userId} allMessages={allMessages} index={index} />
                </div>
              )
            } else {
              return <ChatsMessage key={index} message={e} isGroup={false} userId={userId} allMessages={allMessages} index={index} />
            }
          })}
        </div>

        {userTyping && <div className={styles.Chats_typing}>
          <p>{userTyping} is typing...</p>
        </div>}

        <InputBar files={files} onSend={onSend} onAttach={onAttach} onTyping={onTyping} setFiles={setFiles} />
      </div>}
    </div>
  );
};

export default Chats;
