import React from 'react';
import LinksPart from './links';

import styles from './style.module.scss';

interface PartChatProps {
  id: number
  name: string
  seeAll: (id: number) => void
  seeLess: () => void
  showMinimized: boolean
  isLarge: boolean
  elements: any[]
}

const PartChat = ({
  name,
  seeAll,
  seeLess,
  showMinimized,
  isLarge,
  id,
  elements,
}: PartChatProps) => {
  return (
    <div className={styles.PartChat_container} style={{
      height: isLarge ? '80%' : showMinimized ? '2em' : '15em',
    }}>
      <div className={styles.headerPart}>
        <div className={styles.title}>{name} <span>{elements.length}</span></div>
        <div className={styles.seeAll} onClick={() => isLarge ? seeLess() : seeAll(id)}>
          {isLarge ? "See less" : "See all"}
        </div>
      </div>

      {elements.length > 0 && <div className={styles.content}>
        {elements.map((element, index) => (
          <div key={index} className={styles.element}>
            {name === "Shared Links" && <LinksPart {...element} onClick={() => {}} />}
          </div>
          )
        )}
      </div>}
    </div>
  );
};

export default PartChat;
