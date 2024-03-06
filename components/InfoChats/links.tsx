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
    <div className={styles.LinksPart_container}>
      <div className={styles.icon}>
        <img src={`${
          content[content.length - 1] === '/' ? content.slice(0, -1) : content
        }/favicon.ico`} alt='icon' width='20' height='20' />
      </div>

      <div className={styles.links} onClick={onClick}>
        <div className={styles.title}>{title}</div>
        <div className={styles.contentLink}>{content}</div>
      </div>
    </div>
  );
};

export default LinksPart;
