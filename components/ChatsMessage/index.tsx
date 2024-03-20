import React from 'react';
import Image from 'next/image';
import { Emoji, EmojiStyle } from 'emoji-picker-react';
import formatDate from '@/tools/formatDate';

import styles from './style.module.scss';
import { decryptMessage } from '@/tools/cryptMessage';

interface ChatsMessageProps {
  message: {
    _id: string
    content: string
    date: Date
    authorId: string
    phone: string
    options?: {
      isLink: boolean
    }
    reactions?: {
      value: string
      usersId: string[]
    }[]
  }
  isGroup: boolean
  allMessages: any[]
  userId: string
  index: number
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  setMessageIdHover: (e: string | null) => void
  handleAddReaction: (reaction: string) => void
  privateKey: string
}

const ChatsMessage = ({
  message,
  isGroup,
  allMessages,
  userId,
  index,
  handleContextMenu,
  setMessageIdHover,
  handleAddReaction,
  privateKey,
}: ChatsMessageProps) => {
  const isOtherMessage = allMessages[index + 1] && allMessages[index + 1].authorId === message.authorId;

  const returnJustLink = (content: string): { link: string, text: string} => {
    const link = content.match(/(https?:\/\/[^\s]+)/g);
    if (!link) return { link: "", text: content };

    return { link: link[0], text: content.replace(link[0], "") };
  }

  const decryptedMessage = decryptMessage(message.content, privateKey);
  if (decryptedMessage) message.content = decryptedMessage;

  return (
    <div
      className={styles.ChatsMessage_container}
      style={{
        justifyContent: message.authorId !== userId ? "flex-start" : "flex-end",
        marginBottom: isOtherMessage ? "0.2em" : "1em",
      }}
      onContextMenu={(e) => handleContextMenu(e)}
      onMouseEnter={() => setMessageIdHover && setMessageIdHover(message._id)}
      onClick={(e) => {
        if (e.detail === 2)
          handleAddReaction("2764-fe0f");
      }}
    >
      <div className={styles.ChatsMessage_author}>
        {(message.authorId !== userId && (allMessages[index + 1] && allMessages[index + 1].authorId !== message.authorId || !allMessages[index + 1])) &&
          <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${message.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
        }
      </div>

      <div className={styles.ChatsMessage_content} style={{
          backgroundColor: message.authorId !== userId ? "#2e333d" : "#6b8afd",
          paddingBottom: message.reactions ? ".5em" : "0.8em",
        }}
      >
        <div className={styles.title} style={{
          marginBottom: isGroup ? "0.3em" : "0",
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
                      color: message.authorId !== userId ? "#6b8afd" : "var(--dark-blue)",
                    }} target="_blank" rel="noreferrer">{link.link}</a>{" "}</> : link.text}
                  </span>
                )
              })
            :
              message.content
          }
        </div>

        <div className={styles.footer}>
          <div className={styles.reactions}>
            {message.reactions?.map((e, index) => (
                <span
                  key={index}
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
