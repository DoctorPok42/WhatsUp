import React from 'react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';
import formatDate from '@/tools/formatDate';

import styles from './style.module.scss';

interface FooterMessageProps {
  message: {
    reactions?: {
      value: string
      usersId: string[]
    }[]
    authorId: string
    date: Date
  }
  handleAddReaction: (reaction: string) => void
  userId: string
}

const FooterMessage = ({
  message,
  handleAddReaction,
  userId
}: FooterMessageProps) => {
  return (
    <div className={styles.footer}>
      <div className={styles.reactions}>
        {message.reactions?.map((e, index) => (
            <span
              role="contentinfo"
              aria-hidden="true"
              key={e.value + index}
              onClick={() => handleAddReaction(e.value)}
              style={{
                backgroundColor: e.usersId.includes(userId) ? "var(--dark-blue)" : "transparent",
              }}
            >
              <Emoji unified={e.value} emojiStyle={'google' as EmojiStyle} size={12} />
              <span>{e.usersId.length}</span>
            </span>
          ))}
      </div>

      <div className={styles.date} style={{
        color: message.authorId !== userId ? "var(--white-dark)" : "#dadada",
      }}>
        {formatDate(new Date(message.date))}
      </div>
    </div>
  );
};

export default FooterMessage;
