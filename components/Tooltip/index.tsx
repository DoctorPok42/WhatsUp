import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import styles from './style.module.scss';

interface TooltipComponentProps {
  position?: "top" | "bottom" | "left" | "right"
  title?: string
  transition?: "zoom" | "fade" | "grow"
  children: React.ReactNode
  style?: React.CSSProperties
}

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

const TooltipComponent = ({
  position = "top",
  title,
  transition = "zoom",
  children,
  style,
}: TooltipComponentProps) => {
  return (
    <div className={styles.TooltipComponent_container}>
      <NameTooltip
        title={title}
        placement={position}
        TransitionComponent={transition}
        arrow
        TransitionProps={{ timeout: 100 }}
        style={style}
      >
        {children}
      </NameTooltip>
    </div>
  );
};

export default TooltipComponent;
