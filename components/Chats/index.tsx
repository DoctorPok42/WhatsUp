import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Contact } from '..';

import styles from './style.module.scss';
import Image from 'next/image';

interface ChatsProps {

}

const Chats = ({ }: ChatsProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  return (
    <div className={styles.Chats_container} style={{
      width: isInfoOpen ? 'calc(100% - 30em)' : 'calc(100% - 6em)',
      borderRadius: isInfoOpen ? '20px' : '20px 0 0 20px',
    }}>
      <Contact />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h2>Chats Title</h2>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.search}>
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
      </div>
    </div>
  );
};

export default Chats;
