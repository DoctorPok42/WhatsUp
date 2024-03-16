import React, { useEffect, useState } from 'react';
import { SearchBar } from '..';
import emitEvent from '@/tools/webSocketHandler';
import UserCard from '../UserCard';
import ConversationCard from '../ConversationCard';
import router from 'next/router';
import { Skeleton } from '@mui/material';

import styles from './style.module.scss';

interface ContactProps {
  token: string
  id?: string
  conversations?: any[]
  userId: string
  isLoading: boolean
}

const Contact = ({
  token,
  id,
  conversations = [],
  userId,
  isLoading,
}: ContactProps) => {
  const [userSearched, setUserSearched] = useState<{
    id: string
    phone: string,
    username: string | undefined
  }[]>([])
  const [search, setSearch] = useState<string>('')
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (search.length > 0) {
      setIsPopupOpen(true)
    } else {
      setIsPopupOpen(false)
    }
  }, [search])

  const onSearch = (search: string) => {
    setSearch(search.trim())
    if (search.trim().length < 1) {
      setUserSearched([])
      return
    }

    emitEvent("userSearch", { token, arg: search.trim() }, (data: any) => {
      if (data.status === "success") {
        let newUsers = data.data.map((e: any) => ({
          id: e.id,
          phone: e.phone,
          username: e.username
        }));
        newUsers = newUsers.filter((e: any) => e.id !== userId)
        setUserSearched(newUsers)
      }
      setLoading(false)
    })
  }

  const onChooseUser = (user: any) => {
    emitEvent("conversationsChoose", { token, userId: user.id }, (data: any) => {
      if (data.status === "success") {
        setUserSearched([])
        setIsPopupOpen(false)
        setSearch('')
        router.push(`/chats/${data.data._id}`)
      } else {
        alert(data.message)
      }
    })
  }

  return (
    <div className={styles.Contact_container} onContextMenu={(e) => e.preventDefault()}>
      <SearchBar onSearch={onSearch} />

      <div className={styles.userSearched} style={{
        padding: isPopupOpen ? '0.6em 0.5em' : '0 0.5em',
        height: isPopupOpen ? 'auto' : '0',
        minHeight: isPopupOpen ? '5em' : '0',
      }}>
        {(userSearched.length < 1 && isPopupOpen && !loading) && <div className={styles.noUserFound}>
          <h2>😢 No user found!</h2>
        </div>}

        {userSearched.map((user, index) => (
          <UserCard key={index} user={user} onClick={() => onChooseUser(user)} />
        ))}
      </div>

      <div className={styles.conversations}>
        {!isLoading ? conversations.map((conversation, index) => (
          <ConversationCard key={index} id={id} conversation={conversation} onClick={() => router.push(`/chats/${conversation._id}`)} />
        )) :
          Array(6).fill(0).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height="100px"
              animation="wave"
              style={{
                borderRadius: '22px',
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Contact;
