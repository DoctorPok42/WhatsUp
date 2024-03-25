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
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
    return num;
  };
  return (
    <div className={styles.DashBox_container} style={style}>
      <div className={styles.content}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        {text && <p className={styles.text}>{formatNumber(parseInt(text))}</p>}
      </div>

      {children}
    </div>
  );
};

export default DashBox;
