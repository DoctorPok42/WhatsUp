import React, { use, useEffect, useState } from 'react';
import router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClose, faSignOutAlt, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import ButtonChat from './button';
import PartChat from './part';
import emitEvent from '@/tools/webSocketHandler';

import styles from './style.module.scss';

interface InfoChatsProps {
  token: string
  id?: string
  isInfoOpen: boolean
  setIsInfoOpen: (e: boolean) => void
  conversations: any[]
  setIsSearchOpen: (e: boolean) => void
}

const InfoChats = ({
  token,
  id,
  isInfoOpen,
  setIsInfoOpen,
  conversations,
  setIsSearchOpen,
}: InfoChatsProps) => {
  const leaveChat = () => {
    emitEvent("leave", { token, conversationId: id }, (data: any) => {
      if (data.status === "success") {
        setIsInfoOpen(false)
        router.push("/chats")
      } else {
        alert(data.message)
      }
    })
  }

  const buttons = [
    { name: "Notifications", icon: faBell, onClick: () => {} },
    { name: "Add People", icon: faUserPlus, onClick: () => setIsSearchOpen(true) },
    { name: "All Users", icon: faUsers, onClick: () => router.push(`/chats/${id}/users`) },
    { name: "Leave Chat", icon: faSignOutAlt, onClick: () => leaveChat(), color: 'var(--red)'},
  ]

  const [parts, setParts] = useState<{
    name: string
    value: string
    seeAll: (id: number) => void
    seeLess: () => void
    showMinimized: boolean
    isLarge: boolean
    elements: any[]
  }[]>([
    { name: "Photos and Videos", value: "pictures", seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false, elements: [] },
    { name: "Shared Files", value: "files" ,seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false, elements: [] },
    { name: "Shared Links", value: "links", seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false, elements: [] }
  ])

  const showLargePart = (id: number) => {
    setParts(parts.map((part, index) => {
      if (index === id) {
        return { ...part, showMinimized: false, isLarge: true }
      } else {
        return { ...part, showMinimized: true, isLarge: false }
      }
    }))
  }

  const resetParts = () => {
    setParts(parts.map((part) => {
      return { ...part, showMinimized: false, isLarge: false }
    }))
  }

  useEffect(() => {
    const newParts = parts.map((part) => {
      const newElement = conversations.find(e => e._id === id)?.[part.value] || []
      return { ...part, elements: newElement.reverse().slice(0, 4)}
    })

    setParts(newParts)
  }, [conversations])

  return       (
    <div className={styles.InfoChats_container} style={{
      width: isInfoOpen ? '23em' : '0',
      opacity: isInfoOpen ? 1 : 0,
    }}>
      <div className={styles.header}>
        <div className={styles.title}>Chat Details</div>

        <div className={styles.back} onClick={() => setIsInfoOpen(false)}>
          <FontAwesomeIcon icon={faClose} color='white' width={20} height={20} />
        </div>
      </div>

      <div className={styles.buttons}>
        {buttons.map((button, index) => (
          <ButtonChat key={index} {...button} />
        ))}
      </div>

      <div className={styles.parts}>
        {parts.map((part, index) => (
          <PartChat key={index} {...part} id={index} />
        ))}
      </div>
    </div>
  );
};

export default InfoChats;
