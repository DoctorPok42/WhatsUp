import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import emitEvent from '@/tools/webSocketHandler';
import UserResult from './userReasult';
import MessageResult from './messageReasult';

import styles from './style.module.scss';

interface SearchGlobalBarProps {
  isOpen: boolean | undefined;
  setIsOpen?: (e: boolean) => void | undefined;
  token: string
  userId: string
  conversationId?: string
  usersConversation: string[]
  getConversations?: () => void
  state: "message" | "user"
  setSearchState: (e: "message" | "user") => void
  setAllMessages?: (e: any[]) => void
}

const SearchGlobalBar = ({
  isOpen = true,
  setIsOpen,
  token,
  userId,
  conversationId,
  usersConversation,
  getConversations,
  state,
  setSearchState,
  setAllMessages,
}: SearchGlobalBarProps) => {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [userSearchedAdd, setUserSearchedAdd] = useState<{
    id: string
    phone: string,
    username: string
  }[]>([])
  const [messageSearched, setMessageSearched] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  if (!isOpen) return null

  const onSearch = async (search: string) => {
    if (search.trim().length < 2) {
      setUserSearchedAdd([])
      setMessageSearched([])
      setIsSearching(false)
      return
    }

    setLoading(true)
    setIsSearching(true)

    state === 'user' ? onUserSearch(search) : onMessageSearch(search)

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleClose = () => {
    setUserSearchedAdd([])
    setMessageSearched([])
    setIsSearching(false)
    setSearchState('user')
    setIsOpen && setIsOpen(false)
  }

  const onUserSearch = (search: string) => {
    emitEvent("userSearch", { token, arg: search.trim() }, (data: any) => {
      if (data.status === "success") {
        let newUsers = data.data.map((e: any) => ({
          id: e.id,
          phone: e.phone,
          username: e.username
        }));
        newUsers = newUsers.filter((e: any) => e.id !== userId)
        const usersInConversation = newUsers.filter((e: any) => usersConversation.find((el: string) => el === e.id))
        const usersNotInConversation = newUsers.filter((e: any) => !usersConversation.find((el: string) => el === e.id))
        newUsers = [...usersNotInConversation, ...usersInConversation]
        setUserSearchedAdd(newUsers)
      }
    })
  }

  const handleAddUser = (userId: string) => {
    if (usersConversation.find((e: string) => e === userId)) return

    emitEvent("userAdd", { token, conversationId, userId }, (data: any) => {
      if (data.status === "success") {
        getConversations && getConversations()
      } else {
        alert(data.message)
      }
    })
  }

  const onMessageSearch = (message: string) => {
    if (message.length < 2) return
    emitEvent('searchMessage', { token, conversationId: conversationId, message: message }, (response) => {
      setMessageSearched(response.data)
    });
  }

  const handleGoToMessage = (messageId: string) => {
    emitEvent('getMessage', { token, conversationId, messageId }, (response) => {
      setAllMessages && setAllMessages(response.data)
    });
    handleClose()
  }

  console.log('userSearchedAdd', messageSearched.length, userSearchedAdd.length, isSearching, loading)

  return (
    <div className={styles.SearchGlobalBar_container} onKeyDown={(e) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }}>
      <div className={styles.content}>
        <div className={styles.header} style={{
          ...isSearching ? { borderBottom: "1px solid #2e333d" } : {}
        }}>
          <div className={styles.image}>
            <FontAwesomeIcon icon={faSearch} width={15} height={15} color='#a6a3a3' />
          </div>

          <div className={styles.input}>
            <input type="text" placeholder={
              `Search ${state}...`
            } onChange={(e: any) => onSearch(e.target.value)} autoFocus />
          </div>

          {<div className={styles.iconClose} onClick={handleClose}>
            <FontAwesomeIcon icon={faClose} color='#a6a3a3' width={15} height={15} />
          </div>}
        </div>

        {((userSearchedAdd.length < 1 && messageSearched.length < 1) && isSearching && !loading) && <div className={styles.noUserFound}>
          <h2>😢 No {state} found</h2>
        </div>}

        {state === 'user' && <UserResult isSearching={isSearching} userSearchedAdd={userSearchedAdd} usersConversation={usersConversation} handleAddUser={handleAddUser} />}
        {state === 'message' && <MessageResult messageSearched={messageSearched} handleGoToMessage={handleGoToMessage} />}
      </div>
    </div>
  );
};

export default SearchGlobalBar;
