import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import emitEvent from '@/tools/webSocketHandler';

import styles from './style.module.scss';

interface HeaderChatsProps {
  isInfoOpen: boolean;
  setIsInfoOpen: (value: boolean) => void;
  conversationName: string;
  setIsSearchOpen?: (e: boolean) => void;
  setSearchState: (e: "message" | "user") => void;
}

const HeaderChats = ({
  isInfoOpen,
  setIsInfoOpen,
  conversationName,
  setIsSearchOpen,
  setSearchState,
}: HeaderChatsProps) => {
  const handleSearchMessage = () => {
    setSearchState('message');
    setIsSearchOpen && setIsSearchOpen(true);
  }

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <h2>{conversationName}</h2>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.search} onClick={handleSearchMessage}>
          <FontAwesomeIcon icon={faSearch} width={18} height={18} color='#7d7f92' />
        </div>

        <div className={styles.info} onClick={() => setIsInfoOpen(!isInfoOpen)}>
          <Image src="/sidebar.svg" alt="settings" width={5} height={5} style={{
            transform: isInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
        </div>

        <div className={styles.buttonParams}>
          <FontAwesomeIcon icon={faEllipsisVertical} width={18} height={18} color='#7d7f92' />
        </div>
      </div>
    </div>
  );
};

export default HeaderChats;
