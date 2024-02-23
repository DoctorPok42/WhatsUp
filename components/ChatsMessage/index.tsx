import React from 'react';
import Image from 'next/image';

import styles from './style.module.scss';

interface ChatsMessageProps {
  message: {
    content: string
    date: Date
    authorId: string
    phone: string
    options?: {
      isLink: boolean
    }
  }
  isGroup: boolean
  allMessages: any[]
  userId: string
  index: number
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void
}

const ChatsMessage = ({
  message,
  isGroup,
  allMessages,
  userId,
  index,
  handleContextMenu,
}: ChatsMessageProps) => {
  const isOtherMessage = allMessages[index + 1] && allMessages[index + 1].authorId === message.authorId;

  const returnJustLink = (content: string): { link: string, text: string} => {
    const link = content.match(/(https?:\/\/[^\s]+)/g);
    if (!link) return { link: "", text: content };

    return { link: link[0], text: content.replace(link[0], "") };
  }

  return (
    <div className={styles.ChatsMessage_container} onContextMenu={(e) => handleContextMenu(e)} style={{
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
          marginBottom: isGroup ? "0.3em" : "0",
          justifyContent: message.authorId !== userId ? "flex-start" : "flex-end",
        }}>
          <span>
            {
              (allMessages[index - 1] && allMessages[index - 1].authorId === message.authorId) ? "" :
                message.phone
            }
          </span>
        </div>

        <div className={styles.content}>
          {
            message.options?.isLink ?
              message.content.split(" ").map((e, index) => {
                const link = returnJustLink(e);
                return (
                  <span key={index}>
                    {link.link ? <>{" "}<a href={link.link} style={{
                      color: message.authorId !== userId ? "#6b8afd" : "#2b47d4",
                    }} target="_blank" rel="noreferrer">{link.link}</a>{" "}</> : link.text}
                  </span>
                )
              }) :
              message.content

          }
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
