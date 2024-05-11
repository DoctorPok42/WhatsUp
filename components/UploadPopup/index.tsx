import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode, faFileImage, faFileText } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface UploadPopupProps {
  conversationName: string;
  onUpload: (files: File[], directly: boolean) => void;
  setIsOnDrop: (isOnDrop: boolean) => void;
}

const UploadPopup = ({
  conversationName,
  onUpload,
  setIsOnDrop,
}: UploadPopupProps) => {
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);
  const [fileToLarge, setFileToLarge] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.map(file => file.size).reduce((a, b) => a + b, 0) > 1024 * 1024 * 10) {
      setFileToLarge(true);
      setTimeout(() => setIsOnDrop(false), 3000);
    } else {
      onUpload(acceptedFiles, shiftPressed);
      setIsOnDrop(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Shift' ? setShiftPressed(true) : null;
    const onKeyUp = (e: KeyboardEvent) => e.key === 'Shift' ? setShiftPressed(false) : null;

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={styles.UploadPopup_container}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <div className={styles.content} style={{
        backgroundColor: fileToLarge ? 'var(--red)' : '',
      }}>
        <div className={styles.dashed} style={{
          borderColor: fileToLarge ? '#f8abab' : '#abbcf8',
        }}>
          <div className={styles.files}>
            <div className={styles.icons}>
              <FontAwesomeIcon icon={faFileText} width={110} height={110} size='7x' color={
                fileToLarge ? '#f8abab' : '#abbcf8'
              }  />
            </div>
            <div className={styles.icons}>
              <FontAwesomeIcon icon={faFileImage} width={110} height={110} size='7x' />
            </div>
            <div className={styles.icons}>
              <FontAwesomeIcon icon={faFileCode} width={110} height={110} size='7x' color={
                fileToLarge ? '#f8abab' : '#abbcf8'
              }  />
            </div>
          </div>

          <div className={styles.text}>
            <h2>
              {shiftPressed ? "Insta Upload Mode!" : `Upload to ${conversationName}`}
            </h2>

            <span>Hold shift to upload directly.</span>

            {fileToLarge && (
              <span>File size is too big. Max size is 10MB.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
