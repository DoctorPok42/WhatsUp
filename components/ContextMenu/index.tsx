import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useClickAway } from "@uidotdev/usehooks";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faCopy,
  faDownload,
  faLink,
  faPen,
  faRotateLeft,
  faThumbTack,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
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
  e: any
  closeContextMenu: () => void
  handleContextMenuAction: (action: string) => void
  handleAddReaction: (reaction: string) => void
  message: any
  userId: string
  isMessagePin: boolean
  downloadFile: (fileId : string, name: string, type: string, content?: string) => void
}

const emojiStyleChoose = "google" as EmojiStyle;

const NameTooltip = styled(({ className, ...props }: any) => (
      <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: 'var(--black)',
          color: 'var(--white)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 600,
          tranform: 'scale(1.2)',

      },
      [`& .${tooltipClasses.arrow}`]: {
          color: 'var(--black)',
      },
}));

const ContextMenu = ({
  x,
  y,
  e,
  closeContextMenu,
  handleContextMenuAction,
  handleAddReaction,
  message,
  userId,
  isMessagePin,
  downloadFile,
}: ContextMenuProps) => {
  const ref = useClickAway(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement>;
  const [showPicker, setShowPicker] = useState(false);

  const handleDownloadFile = (message: any) => {
    if (!message.options?.data?.name) return;
    downloadFile(
      message.content + "." + message.options?.data?.type.split("/")[1],
      message.options?.data?.name,
      message.options?.data?.type,
      message.content
    )
  }

  const canEdit = message.authorId === userId && !message.options.isFile;

  const menuButtons = [
    ...canEdit ? [{ name: "Edit", value: "edit", icon: faPen }] : [],
    ...message.options.isFile ? [{ name: "Download", value: "download", icon: faDownload, action: () => handleDownloadFile(message) }] : [],
    { name: "More reactions", icon: (x > window.innerWidth - 600) ? faArrowCircleLeft : faArrowCircleRight, action: () => setShowPicker(!showPicker)},
    { name: isMessagePin ? "Unpin Message" : "Pin Message", value: "pin", icon: faThumbTack, angle: 45 },
    ...message.options.isFile ? [] : [{ name: "Copy Text", value: "copy", icon: faCopy }],
    { name: "Copy Message Link", value: "clink", icon: faLink },
    { name: "Mark Unread", value: "unread", icon: faRotateLeft },
    ...message.authorId === userId ? [{ name: "Delete", value: "delete", icon: faTrash, color: true }] : [],
  ]

  const preSelectedReactions = [
    { name: ":+1:", icon: "1f44d" },
    { name: ":heart:", icon: "2764-fe0f"  },
    { name: ":joy:", icon: "1f602"  },
    { name: ":cry:", icon: "1f622"  }
  ]

  const handleAction = (action: string) => {
    handleContextMenuAction(action);
    closeContextMenu();
  }

  const handleGetEmojiPosition = () => {
    const { pageY } = e;

    let y = pageY;

    if (window.innerHeight - pageY < 270) {
      y = pageY - 895
    } else {
      y = pageY - 272
    }

    return y;
  }

  return (
    <div
      ref={ref}
      id="contextMenuChat"
      className={styles.ContextMenu_container}
      onContextMenu={(e) => {e.preventDefault()}}
      style={{
        top: `${y - 1}px`,
        left: `${x - 80}px`,
      }}
    >

      <div className={styles.ContextMenu_reactions}>
        {preSelectedReactions.map((reaction, index) => (
          <NameTooltip
            key={index}
            title={reaction.name}
            placement="top"
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 100 }}
            arrow
          >
            <div
              key={index}
              className={styles.ContextMenu_button_reactions}
              onClick={() => handleAddReaction(reaction.icon)}
            >
                <p>
                  <Emoji
                    unified={reaction.icon}
                    emojiStyle={emojiStyleChoose}
                    size={25}
                  />
                </p>
            </div>
          </NameTooltip>
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
              : () => handleAction(button.value as string)
          }
          style={{
            backgroundColor: showPicker && button.name === "More reactions" ? "var(--blue)" : "",
            color: showPicker && button.name === "More reactions" ? "var(--white)" : "",
          }}
        >
          <p
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          >
            {button.name}
          </p>
          <FontAwesomeIcon
            icon={button.icon}
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
            width={16}
            height={16}
            style={
              button.angle
                ? { transform: `rotate(${button.angle}deg)` }
                : {}
            }
          />
        </div>
      ))}

      <Picker
        open={showPicker}
        onEmojiClick={(emoji) => handleAddReaction(emoji.unified)}
        theme={"dark" as any}
        emojiStyle={emojiStyleChoose}
        style={{
          backgroundColor: "var(--black)",
          position: "absolute",
          left: "13.5em",
          top: handleGetEmojiPosition(),
          transform: `translateX(${x > window.innerWidth - 600 ? "-163.5%" : ""})`
        }}
        searchPlaceHolder='Find the perfect emoji...'
        lazyLoadEmojis
      />
    </div>
  );
};

export default ContextMenu;
