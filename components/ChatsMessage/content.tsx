import React from 'react';

import styles from './style.module.scss';

interface ContentMessageProps {
  message: {
    content: string
    authorId: string
    options?: {
      isLink: boolean
    }
  }
  returnJustLink: (content: string) => { link: string, text: string}
  userId: string
}

const ContentMessage = ({
  message,
  returnJustLink,
  userId,
}: ContentMessageProps) => {
  return (
    <div className={styles.content}>
      {
        message.options?.isLink ?
          message.content.split(" ").map((e, index) => {
            const link = returnJustLink(e);
            return (
              <span key={e + index }>
                {link.link ? <>{" "}<a href={link.link} style={{
                  color: message.authorId !== userId ? "#6b8afd" : "var(--dark-blue)",
                }} target="_blank" rel="noreferrer">{link.link}</a>{" "}</> : link.text}
              </span>
            )
          })
        :
          message.content
      }
    </div>
  );
};

export default ContentMessage;
