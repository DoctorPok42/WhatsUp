import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useClickAway } from "@uidotdev/usehooks";
import { faArrowCircleRight, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Zoom } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Emoji, EmojiStyle } from 'emoji-picker-react';

import styles from './style.module.scss';

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

interface ContextMenuProps {
  x: number
  y: number
  closeContextMenu: () => void
  handleContextMenuAction: (action: string) => void
  handleAddReaction: (reaction: string) => void
}

const NameTooltip = styled(({ className, ...props }: any) => (
      <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#1e1f22',
          color: 'var(--white)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 600,
          tranform: 'scale(1.2)',

      },
      [`& .${tooltipClasses.arrow}`]: {
          color: '#1e1f22',
      },
}));

const ContextMenu = ({
  x,
  y,
  closeContextMenu,
  handleContextMenuAction,
  handleAddReaction,
}: ContextMenuProps) => {
  const ref = useClickAway(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement>;
  const [showPicker, setShowPicker] = useState(false);

  const menuButtons = [
    { name: "More reactions", icon: faArrowCircleRight, action: () => setShowPicker(!showPicker)},
    { name: "Copy", icon: faCopy },
    { name: "Delete", icon: faTrash, color: true },
  ]

  const preSelectedReactions = [
    { name: "Like", icon: "1f44d" },
    { name: "Love", icon: "2764-fe0f"  },
    { name: "Haha", icon: "1f602"  },
    { name: "Sad", icon: "1f972"  }
  ]

  const handleAction = (action: string) => {
    handleContextMenuAction(action);
    closeContextMenu();
  }

  return (
    <div
      ref={ref}
      className={styles.ContextMenu_container}
      onContextMenu={(e) => {e.preventDefault()}}
      style={{
        top: `${y - 1}px`,
        left: `${x - 80}px`,
        transform: `translateX(${x > window.innerWidth - 200 ? "-100%" : ""})`
      }}
    >

      <div className={styles.ContextMenu_reactions}>
        {preSelectedReactions.map((reaction, index) => (
          <div
            key={index}
            className={styles.ContextMenu_button_reactions}
            onClick={() => handleAddReaction(reaction.icon)}
          >
            <NameTooltip
              title={reaction.name}
              placement="top"
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 100 }}
              arrow
            >
              <p>
                <Emoji
                  unified={reaction.icon}
                  emojiStyle={"twitter" as EmojiStyle}
                  size={25}
                />
              </p>
            </NameTooltip>
          </div>
        ))}
      </div>

      {menuButtons.map((button, index) => (
        <div
          key={index}
          className={styles.ContextMenu_button}
          id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          onClick={
            button.action
              ? button.action
              : () => handleAction(button.name)
          }
        >
          <p
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          >
            {button.name}
          </p>
          <FontAwesomeIcon
            icon={button.icon}
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
            width={20}
            height={20}
          />
        </div>
      ))}

      <Picker
        open={showPicker}
        onEmojiClick={(emoji) => handleAddReaction(emoji.unified)}
        theme={"dark" as any}
        emojiStyle={"twitter" as any}
        style={{
          backgroundColor: "var(--black)",
          position: "absolute",
          left: "13.5em",
          top: "0em",
          transform: `translateX(${x > window.innerWidth - 200 ? "-163.5%" : ""})`
        }}
        searchPlaceHolder='Find the perfect emoji...'
        lazyLoadEmojis
      />
    </div>
  );
};

export default ContextMenu;
