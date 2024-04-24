import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface ContentFileMessageProps {
  message: {
    content: string
    authorId: string
    options?: {
      isLink: boolean
      isFile: boolean
      data?: { name: string, size: number, type: "image" | "video" | "audio" | "file" }
    }
  }
  handleDownload: (content: string, name: string, type: string) => void
}

const ContentFileMessage = ({
  message,
  handleDownload
}: ContentFileMessageProps) => {
  const handleDownloadFile = () => {
    if (!message.options?.data?.name) return;
    handleDownload(
      message.content + "." + message.options?.data?.type.split("/")[1],
      message.options?.data?.name,
      message.options?.data?.type
    )
  }

  return (
    <div className={styles.content_file} onClick={handleDownloadFile} role="button" tabIndex={0} onKeyUp={handleDownloadFile}>
      <FontAwesomeIcon icon={faFileLines} width={16} height={16} />
      <div className={styles.file}>
        <h2>
          {
            message.options?.data?.name && message.options?.data?.name.length > 30 ?
              message.options?.data?.name.slice(0, 30) + "[...]." + message.options?.data?.type.split("/")[1] :
              message.options?.data?.name
          }
          </h2>
      </div>
    </div>
  );
};

export default ContentFileMessage;
