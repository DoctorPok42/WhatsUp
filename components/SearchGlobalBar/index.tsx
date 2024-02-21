import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import emitEvent from '@/tools/webSocketHandler';
import Image from 'next/image';

import styles from './style.module.scss';

interface SearchGlobalBarProps {
  isOpen: boolean | undefined;
  setIsOpen?: (e: boolean) => void | undefined;
  token: string
  userId: string
  conversationId?: string
}

const SearchGlobalBar = ({
  isOpen = true,
  setIsOpen,
  token,
  userId,
  conversationId
}: SearchGlobalBarProps) => {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [userSearchedAdd, setUserSearchedAdd] = useState<{
    id: string
    phone: string,
    username: string | undefined
  }[]>([])

  if (!isOpen) return null

  const onSearch = (search: string) => {
    if (search.trim().length < 1) {
      setIsSearching(false)
      setUserSearchedAdd([])
      return
    }

    setIsSearching(true)

    emitEvent("userSearch", { token, arg: search.trim() }, (data: any) => {
      if (data.status === "success") {
        let newUsers = data.data.map((e: any) => ({
          id: e.id,
          phone: e.phone,
          username: e.username
        }));
        newUsers = newUsers.filter((e: any) => e.id !== userId)
        setUserSearchedAdd(newUsers)
      }
    })
  }

  const handleClose = () => {
    setIsSearching(false)
    setIsOpen && setIsOpen(false)
    setUserSearchedAdd([])
  }

  const handleAddUser = (userId: string) => {
    emitEvent("userAdd", { token, conversationId, userId }, (data: any) => {
      if (data.status === "success") {
        setUserSearchedAdd(userSearchedAdd.filter((e: any) => e.id !== userId))
      } else {
        alert(data.message)
      }
    })
  }

  return (
    <div className={styles.SearchGlobalBar_container} onKeyDown={(e) => {
      if (e.key === "Escape") {
        setIsOpen && setIsOpen(false)
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
            <input type="text" placeholder="Search" onChange={(e: any) => onSearch(e.target.value)} autoFocus />
          </div>

          {<div className={styles.iconClose} onClick={handleClose}>
            <FontAwesomeIcon icon={faClose} color='#a6a3a3' width={15} height={15} />
          </div>}
        </div>

        {/* {(userSearchedAdd.length < 1 && isSearching && !loading) && <div className={styles.noUserFound}>
        <div className={styles.userSearched} style={{
          padding: isSearching ? '0.6em 0.5em' : '0 0.5em',
        }}>
          {userSearchedAdd.map((user, index) => (
            <div key={index} className={styles.userCard} onClick={() => handleAddUser(user.id)}>
              <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${user.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
              <div className={styles.userInfo}>
                {user.username && <h3>{user.username}</h3>}
                <p>{user.phone}</p>
              </div>
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};

export default SearchGlobalBar;
