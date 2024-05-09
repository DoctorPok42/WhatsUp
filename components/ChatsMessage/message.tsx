import React from 'react';
import ContentFileMessage from './content_file';
import ContentMessage from './content';
import FooterMessage from './footer';

import styles from './style.module.scss';

interface MessageProps {
  message: {
    _id: string
    content: string
    date: Date
    authorId: string
    img: string
    options?: {
      isLink: boolean
      isFile: boolean
      data?: { name: string, size: number, type: "image" | "video" | "audio" | "file" }
    }
    reactions?: { value: string, usersId: string[] }[]
    isTemp?: boolean
  }
  isGroup: boolean
  allMessages: any[]
  userId: string
  index: number
  handleAddReaction: (reaction: string) => void
  downloadFile: (content: string, name: string, type: string) => void
  returnJustLink: (content: string) => { link: string, text: string }
  imagePreview: string | undefined
}

const Message = ({
  message,
  isGroup,
  allMessages,
  userId,
  index,
  handleAddReaction,
  downloadFile,
  returnJustLink,
  imagePreview,
}: MessageProps) => {
  return (
    <>
    {message.options?.data?.type.split("/")[0] !== "image" ?
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
                  message.img
              }
            </span>
          </div>

          {message.options?.isFile ? (
            <ContentFileMessage message={message} handleDownload={downloadFile} />
          ) : (
            <ContentMessage message={message} returnJustLink={returnJustLink} userId={userId} />
          )}
          <FooterMessage message={message} handleAddReaction={handleAddReaction} userId={userId} />
        </div>
      :
        <div className={styles.ChatsMessage_content} style={{
          paddingTop: 0,
          paddingRight: 0,
          userSelect: "none",
        }}>
          <img src={imagePreview} alt="preview" className={styles.preview_image} />
          <FooterMessage message={message} handleAddReaction={handleAddReaction} userId={userId} />
        </div>
      }
    </>
  );
};

export default Message;
