import React from 'react';

import styles from './style.module.scss';

interface PartChatProps {
  name: string
  seeAll: (id: number) => void
  seeLess: () => void
  showMinimized: boolean
  isLarge: boolean
  id: number
}

const PartChat = ({
  name,
  seeAll,
  seeLess,
  showMinimized,
  isLarge,
  id,
}: PartChatProps) => {
  return (
    <div className={styles.PartChat_container} style={{
      height: isLarge ? '80%' : showMinimized ? '2em' : '15em',
    }}>
      <div className={styles.headerPart}>
        <div className={styles.title}>{name}</div>
        <div className={styles.seeAll} onClick={() => isLarge ? seeLess() : seeAll(id)}>
          {isLarge ? "See less" : "See all"}
        </div>
      </div>

      <div className={styles.content}></div>
    </div>
  );
};

export default PartChat;
