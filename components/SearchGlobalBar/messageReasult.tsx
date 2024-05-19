import React from 'react';
import Image from 'next/image';
import formatDate from '@/tools/formatDate';

import styles from './style.module.scss';

interface MessageResultProps {
  messageSearched: any[]
  handleGoToMessage: (e: string) => void
}

const MessageResult = ({
  messageSearched,
  handleGoToMessage
}: MessageResultProps) => {
  return (
    <div className={styles.messageSearched} style={{
      padding: messageSearched.length ? '0.6em 0.5em' : '0 0.5em',
    }}>
      {messageSearched.map((e, index) => (
        <div key={e._id + index} className={styles.message} onClick={() => handleGoToMessage(e._id)}>
          <Image src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${e.img}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
          <p>{e.content}</p>
          <span>{formatDate(new Date(e.date))}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageResult;
