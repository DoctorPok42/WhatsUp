import React from 'react';
import Image from 'next/image';

import styles from './style.module.scss';

interface ChatsMessageProps {
  message: {
    content: string
    date: Date
    authorId: string
    phone: string
  }
  allMessages: any[]
  isGroup?: boolean
  userId: string
  index: number
}

const ChatsMessage = ({
  message,
  allMessages,
  isGroup,
  userId,
  index,
}: ChatsMessageProps) => {
  const isOtherMessage = allMessages[index + 1] && allMessages[index + 1].authorId === message.authorId;

  return (
    <div className={styles.ChatsMessage_container} style={{
      justifyContent: message.authorId !== userId ? "flex-start" : "flex-end",
      marginBottom: isOtherMessage ? ".25em" : "1em",
    }}>
      <div className={styles.ChatsMessage_author}>
        {(message.authorId !== userId && (allMessages[index + 1] && allMessages[index + 1].authorId !== message.authorId || !allMessages[index + 1])) &&
          <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${message.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
        }
      </div>

      <div className={styles.ChatsMessage_content} style={
        {...message.authorId !== userId ? {
          backgroundColor: "#2e333d",
        } : {
          backgroundColor: "#6b8afd",
        }}
      }>
        <div className={styles.title} style={{
          marginBottom: isGroup ? "0.3em" : "0"
        }}>
          <span>
            {isGroup ? message.phone : ""}
          </span>
        </div>

        <div className={styles.content}>
          {message.content}
        </div>
      </div>

      <div className={styles.ChatsMessage_author}>
        {(message.authorId === userId && (allMessages[index + 1] && allMessages[index + 1].authorId !== message.authorId || !allMessages[index + 1])) &&
          <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${message.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
        }
        </div>
    </div>
  );
};

export default ChatsMessage;
