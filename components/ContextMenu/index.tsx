import React from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './style.module.scss';

interface ContextMenuProps {
  x: number
  y: number
  closeContextMenu: () => void
}

const ContextMenu = ({
  x,
  y,
  closeContextMenu,
}: ContextMenuProps) => {
  const ref = useClickAway(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement>;

  const menuButtons = [
    { name: "Copy", action: () => console.log("copy"), icon: faCopy },
    { name: "Delete", action: () => console.log("delete"), icon: faTrash, color: true }
  ]

  return (
    <div
      ref={ref}
      onClick={() => closeContextMenu()}
      className={styles.ContextMenu_container}
      style={{
        top: `${y - 1}px`,
        left: `${x - 80}px`,
        transform: `translateX(${x > window.innerWidth - 200 ? "-100%" : ""})`
      }}
    >

      {menuButtons.map((button, index) => (
        <div
          key={index}
          className={styles.ContextMenu_button}
          id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          onClick={button.action}
        >
          <p
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          >
            {button.name}
          </p>
          <FontAwesomeIcon
            icon={button.icon}
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
          />
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
