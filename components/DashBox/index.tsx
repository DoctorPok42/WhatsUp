import React from 'react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';

import styles from './style.module.scss';

interface DashBoxProps {
  title?: string;
  titleEmoji?: string;
  subtitleStyle?: React.CSSProperties;
  subtitle?: string;
  text?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const DashBox = ({
  title,
  titleEmoji,
  subtitleStyle,
  subtitle,
  text,
  children,
  style,
}: DashBoxProps) => {
  if (text == "0") text = "0";
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
        {title && <h1 className={styles.title}>
          {title} {titleEmoji && <Emoji emojiStyle={"google" as EmojiStyle} unified={titleEmoji} size={30} />}
        </h1>}
        {subtitle && <h2 className={styles.subtitle} style={subtitleStyle}>{subtitle}</h2>}
        {text && <p className={styles.text}>{formatNumber(parseInt(text))}</p>}
      </div>

      {children}
    </div>
  );
};

export default DashBox;
