import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FileIcon, defaultStyles } from 'react-file-icon';

import styles from './style.module.scss';

interface InputBarProps {
  files: File[];
  onSend: (message: string) => void;
  onEdit: (message: string) => void;
  onAttach: (files: File[]) => void;
  onTyping: (message: string) => void;
  setFiles: (files: File[]) => void;
  mode: "chat" | "edit";
  value: string;
}

const InputBar = ({
  files,
  onSend,
  onEdit,
  onAttach,
  onTyping,
  setFiles,
  mode,
  value,
}: InputBarProps) => {
  const inputRef = useRef<any>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAttach(acceptedFiles);
  }, [onAttach]);
  const [newValue, setNewValue] = useState(value);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustInputHeight();

    if (mode === "chat") onTyping(e.target.value);
    if (mode === "edit") setNewValue(e.target.value);
  }

  useEffect(() => {
    setNewValue(value.trim());
  }, [value]);

  const adjustInputHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const handleSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.currentTarget.value.trim() === '') return;
      if (mode === "chat") onSend(e.currentTarget.value);
      if (mode === "edit") {
        onEdit(e.currentTarget.value);
      }
      e.currentTarget.value = '';
      e.currentTarget.style.height = 'auto';
      setNewValue('');
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
    }
  }

  return (
    <div
      className={styles.InputBar_container}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        boxShadow: mode === "edit" ? '0 0 0 0.2em var(--blue) inset' : 'none',
      }}
    >
      {files.length > 0 && <div className={styles.Input_files}>
        {files.map((file, index) => {
          const extension = file.name.split('.').pop();
          return (
            <div key={index} className={styles.Input_file}>
              <div className={styles.remove}>
                <FontAwesomeIcon icon={faTrash} width={15} height={15} color='#f03f41' onClick={() => {
                  const newFiles = files.filter((_, i) => i !== index);
                  setFiles(newFiles);
                }} />
              </div>

              {extension && <FileIcon extension={extension} {...defaultStyles[extension as keyof typeof defaultStyles]} />}
              <p>{file.name.slice(0, 16) + (file.name.length > 16 ? '...' : '')}</p>
            </div>
          )})}
      </div>}

      <div {...getRootProps()} className={styles.Input_icon}>
        <input {...getInputProps()} />
        <FontAwesomeIcon icon={faPaperclip} width={20} height={20} color='#7d7f92' />
      </div>

      <div className={styles.Input}>
        <textarea
          ref={inputRef}
          placeholder="Your message"
          {...(mode === "edit" && { value: newValue })}
          autoFocus
          onChange={(e) => handleChange(e)}
          onKeyUp={(e) => handleSend(e)}
        />
      </div>
    </div>
  );
};

export default InputBar;
