import React from 'react';
import FooterMessage from './footer';

import styles from './style.module.scss';
import ContentMessage from './content';
import AuthorMessage from './author';

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
    isTemp?: boolean
  }
  isGroup: boolean
  allMessages: any[]
  userId: string
  index: number
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  setMessageIdHover: (e: string | null) => void
  handleAddReaction: (reaction: string) => void
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
}: ChatsMessageProps) => {
  const isOtherMessage = allMessages[index + 1] && allMessages[index + 1].authorId === message.authorId;

  const returnJustLink = (content: string): { link: string, text: string} => {
    const link = content.match(/(https?:\/\/[^\s]+)/g);
    if (!link) return { link: "", text: content };

    return { link: link[0], text: content.replace(link[0], "") };
  }

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
      <AuthorMessage allMessages={allMessages} index={index} message={message} userId={userId} place={message.authorId !== userId ? "left" : "right"} />

      <div className={styles.ChatsMessage_content} style={{
          backgroundColor: message.authorId !== userId ? "#2e333d" : "#6b8afd",
          paddingBottom: message.reactions ? ".5em" : "0.8em",
          ...message.isTemp && { filter: "brightness(0.5)" },
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

        <ContentMessage message={message} returnJustLink={returnJustLink} userId={userId} />
        <FooterMessage message={message} handleAddReaction={handleAddReaction} userId={userId} />
      </div>

      <AuthorMessage allMessages={allMessages} index={index} message={message} userId={userId} place={message.authorId !== userId ? "right" : "left"} />
    </div>
  );
};

export default ChatsMessage;
