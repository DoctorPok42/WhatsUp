import React from 'react';
import { Box, LinearProgress } from '@mui/material';

import styles from './style.module.scss';

const Loading = () => {
  return (
    <div className={styles.Chats_container}>
      <div className={styles.Chats_header}>
        <div className={styles.Chats_header_title}>
          <h1>
            What&apos;s Up
          </h1>
        </div>
        <div className={styles.Chats_header_subtitle}>
          End to end encrypted messaging
        </div>
      </div>
      <div className={styles.Chats_loading}>
        <Box sx={{ width: '30%' }}>
          <LinearProgress color='success' style={{
            borderRadius: 20,
            height: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default Loading;
