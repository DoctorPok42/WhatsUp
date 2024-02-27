import React from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import { faCirclePlus, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Zoom } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import styles from './style.module.scss';

interface ContextMenuProps {
  x: number
  y: number
  closeContextMenu: () => void
  handleContextMenuAction: (action: string) => void
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
}: ContextMenuProps) => {
  const ref = useClickAway(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement>;

  const menuButtons = [
    { name: "More reactions", icon: faCirclePlus },
    { name: "Copy", icon: faCopy },
    { name: "Delete", icon: faTrash, color: true },
  ]

  const preSelectedReactions = [
    { name: "Like", icon: "👍"  },
    { name: "Love", icon: "❤️"  },
    { name: "Haha", icon: "😂"  },
    { name: "Sad", icon: "😢"  }
  ]

  return (
    <div
      ref={ref}
      onClick={() => closeContextMenu()}
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
            onClick={() => handleContextMenuAction(reaction.name.toLowerCase())}
          >
            <NameTooltip
              title={reaction.name}
              placement="top"
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 100 }}
              arrow
            >
              <p>{reaction.icon}</p>
            </NameTooltip>
          </div>
        ))}
      </div>

      {menuButtons.map((button, index) => (
        <div
          key={index}
          className={styles.ContextMenu_button}
          id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          onClick={() => handleContextMenuAction(button.name.toLowerCase())}
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
    </div>
  );
};

export default ContextMenu;
