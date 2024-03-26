import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface ConfirmPopupProps {
  actionOnConfirm: () => void;
  actionOnCancel: () => void;
  open: boolean;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'info';
}

const ConfirmPopup = ({
  actionOnConfirm,
  actionOnCancel,
  open,
  title,
  description,
  type,
}: ConfirmPopupProps) => {
  if (!open) return null;

  return (
    <div className={styles.ConfirmPopup_container} onKeyDown={
      (e) => {
        if (e.key === 'Enter') {
          actionOnConfirm();
        } else if (e.key === 'Escape') {
          actionOnCancel();
        }
      }
    }>
      <div className={styles.ConfirmPopup_content}>
        <div className={styles.header}>
          <h1>{title}</h1>
          <div className={styles.close}>
            <FontAwesomeIcon icon={faClose} onClick={actionOnCancel} size='sm' color="var(--light-grey)" />
          </div>
        </div>

        <div className={styles.description}>
          <p style={{ whiteSpace: "pre-line" }}>{description}</p>
        </div>

        <div className={styles.footer}>
          <button
            className={
              type === 'danger'
                ? styles.danger
                : type === 'warning'
                  ? styles.warning
                  : styles.info
            }
            onClick={actionOnConfirm}
            style={{
              backgroundColor: type === 'danger' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3',
              color: 'var(--white)',
            }}
          >
            Confirm
          </button>
          <button
            onClick={actionOnCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
