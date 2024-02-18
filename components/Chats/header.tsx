import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import emitEvent from '@/tools/webSocketHandler';

import styles from './style.module.scss';

interface HeaderChatsProps {
  isInfoOpen: boolean;
  setIsInfoOpen: (value: boolean) => void;
  conversationName: string;
  conversationId: string | undefined;
  token: string;
}

const HeaderChats = ({
  isInfoOpen,
  setIsInfoOpen,
  conversationName,
  conversationId,
  token,
}: HeaderChatsProps) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (message: string) => {
    emitEvent('searchMessage', { token, conversationId: conversationId, message: message }, (response) => {
      if (response.status === 'success') {
        console.log(response.data.length > 0 ? response.data[0].content : 'No messages found');
      }
    });
  }

  return (
    <div className={styles.header} onMouseLeave={() => setShowSearch(false)}>
      <div className={styles.title}>
        <h2>{conversationName}</h2>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.searchBar}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search messages"
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
        </div>

        <div className={styles.search} onClick={() => setShowSearch(!showSearch)}>
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
