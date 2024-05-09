import React from 'react';

import styles from './style.module.scss';
import Image from 'next/image';

interface AuthorMessageProps {
  allMessages: any[]
  index: number
  message: {
    authorId: string
    img: string
  }
  userId: string
  place: "left" | "right"
}

const AuthorMessage = ({
  allMessages,
  index,
  message,
  userId,
  place,
}: AuthorMessageProps) => {
  return (
    <div className={styles.ChatsMessage_author}>
      {(
        (place === "left" ? message.authorId !== userId : message.authorId === userId) && (allMessages[index + 1] && allMessages[index + 1].authorId !== message.authorId || !allMessages[index + 1])) &&
        <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${message.img}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
      }
    </div>
  );
};

export default AuthorMessage;
