import React from 'react';

import styles from './style.module.scss';

interface DashBoxProps {
  title?: string;
  subtitle?: string;
  text?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const DashBox = ({
  title,
  subtitle,
  text,
  children,
  style,
}: DashBoxProps) => {
  return (
    <div className={styles.DashBox_container} style={style}>
      <div className={styles.content}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
};

export default DashBox;
