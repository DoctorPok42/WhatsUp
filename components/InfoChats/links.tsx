import React from 'react';

import styles from './style.module.scss';

interface LinksPartProps {
  content: string
  authorId: string
  date: string
  title: string
  onClick: () => void
}

const LinksPart = ({
  content,
  title,
  onClick,
}: LinksPartProps) => {

  return (
    <div className={styles.LinksPart_container} onClick={onClick}>
      <div className={styles.icon}>
        <img src="https://www.microsoft.com/favicon.ico" alt="link" />
      </div>

      <div className={styles.links}>
        <div className={styles.title}>{title.split(' ')[0]}</div>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default LinksPart;
