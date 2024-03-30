import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Zoom } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import styles from './style.module.scss';

interface ButtonChatProps {
  name: string
  icon: any
  onClick: () => void
  color?: string
}

const ButtonChat = ({
  name,
  icon,
  onClick,
  color,
}: ButtonChatProps) => {
  const NameTooltip = styled(({ className, ...props }: any) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'var(--grey)',
            color: 'var(--white)',
            boxShadow: theme.shadows[1],
            fontSize: 13,
            fontFamily: 'var(--font)',

        },
        [`& .${tooltipClasses.arrow}`]: {
            color: 'var(--grey)',
        },
    }));

  return (
      <NameTooltip
        title={name}
        placement="top"
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 100 }}
        arrow
      >
      <div className={styles.ButtonChat_container} onClick={onClick}>
        <FontAwesomeIcon
          icon={icon}
          width={21}
          height={21}
          {...color && { color }}
        />
      </div>
    </NameTooltip>
  );
};

export default ButtonChat;
