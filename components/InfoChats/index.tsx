import React, { useState } from 'react';
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
}

const InfoChats = ({
  token,
  id,
  isInfoOpen,
  setIsInfoOpen
}: InfoChatsProps) => {
  const leaveChat = () => {
    emitEvent("leaveChat", { token, conversationId: id }, (data: any) => {
      if (data.status === "success") {
        setIsInfoOpen(false)
        router.push("/chats")
      } else {
        alert(data.message)
      }
    })
  }

  const buttons = [
    { name:"Notifications", icon: faBell, onClick: () => {} },
    { name:"Add People", icon: faUserPlus, onClick: () => {} },
    { name: "All Users", icon: faUsers, onClick: () => router.push(`/chats/${id}/users`) },
    { name:"Leave Chat", icon: faSignOutAlt, onClick: () => leaveChat(), color: 'var(--red)'},
  ]

  const [parts, setParts] = useState([
    { name: "Photos and Videos", seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false },
    { name: "Shared Files", seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false },
    { name: "Shared Links", seeAll: (id: number) => showLargePart(id), seeLess: () => resetParts(), showMinimized: false, isLarge: false },
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

  return (
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
