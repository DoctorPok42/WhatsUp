import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FileIcon, defaultStyles } from 'react-file-icon';
import EmojiPicker, { Emoji, EmojiStyle, Theme } from 'emoji-picker-react';
import { useClickAway } from '@uidotdev/usehooks';

import styles from './style.module.scss';

const emojiStyleChoose = "google" as EmojiStyle;

interface InputBarProps {
  files: File[];
  onSend: (message: string) => void;
  onEdit: (message: string) => void;
  onAttach: (files: File[]) => void;
  onTyping: () => void;
  setFiles: (files: File[]) => void;
  mode: "chat" | "edit";
  setMode: (mode: "chat" | "edit") => void;
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
  setMode,
  value,
}: InputBarProps) => {
  const ref = useClickAway(() => {
    setEmojiPickerOpen(false);
    setEmojiClickAway(true);
  }) as React.MutableRefObject<HTMLDivElement>;

  const inputRef = useRef<any>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAttach(acceptedFiles);
  }, [onAttach]);
  const [newValue, setNewValue] = useState(value);
  const [indexEmoji, setIndexEmoji] = useState<number>(0);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const [emojiClickAway, setEmojiClickAway] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustInputHeight();

    if (mode === "chat") onTyping();
    else if (mode === "edit") {
      if (e.target.value.trim() === '') {
        setMode("chat");
      }
    }

    setNewValue(e.target.value);
  }

  const adjustInputHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustInputHeight();
    setNewValue(value.trim());
    if (inputRef.current) inputRef.current.focus();
  }, [value]);

  useEffect(() => {
    if (mode === "edit") {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        adjustInputHeight();
      }, 1);
    }
  }, [mode]);

  const handleSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.currentTarget.value.trim() === '' && files.length === 0) return;
      setFiles([]);
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

  const addReactionToInput = (emoji: string) => {
    const currentValue = inputRef.current.value;
    inputRef.current.value = currentValue + emoji;
    setNewValue(currentValue + emoji);
  }

  const emojiList = ['1f600', '1f603', '1f604', '1f601', '1f606', '1f605', '1f602', '1f923', '1f642', '1f643', '1f609', '1f60a', '1f607', '1f970', '1f60d', '1f929', '1f618', '1f617', '1f61a']

  const showEmoji = () => {
    if (!emojiPickerOpen && emojiClickAway) {
      setEmojiPickerOpen(false);
      setEmojiClickAway(false);
    }
    else setEmojiPickerOpen(true);
  }

  return (
    <div
      className={styles.InputBar_container}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        boxShadow: mode === "edit" ? '0 0 0 0.2em var(--blue) inset' : 'none',
      }}
    >
      <div className={styles.InputBar_content}>
        {files.length > 0 && <div className={styles.Input_files}>
          {files.map((file, index) => {
            const extension = file.name.split('.').pop();
            return (
              <div key={file.name + index} className={styles.Input_file}>
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

        <div className={styles.inputBar}>
          <div {...getRootProps()} className={styles.Input_icon}>
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faPaperclip} width={16} height={16} color='#7d7f92' />
          </div>

          <div className={styles.Input}>
            <textarea
              ref={inputRef}
              id="inputBar"
              placeholder="Your message"
              {...(mode === "edit" && { value: newValue })}
              autoFocus
              onChange={(e) => handleChange(e)}
              onKeyUp={(e) => handleSend(e)}
            />
          </div>

          <div className={styles.Input_icon_emoji}
            onMouseEnter={() => setIndexEmoji((indexEmoji + 1) % emojiList.length)}
            onClick={() => showEmoji()}
          >
            <Emoji unified={emojiList[indexEmoji]} size={28} emojiStyle={'google' as EmojiStyle} />
          </div>

          {emojiPickerOpen && <p className={styles.pickEmoji} ref={ref}>
            <EmojiPicker
              open={emojiPickerOpen}
              onEmojiClick={(emoji) => addReactionToInput(emoji.emoji)}
              theme={"auto" as Theme}
              emojiStyle={emojiStyleChoose}
              style={{
                backgroundColor: "#2e333d",
              }}
              searchPlaceHolder='Find the perfect emoji...'
              lazyLoadEmojis
            />
          </p>}
        </div>
      </div>
    </div>
  );
};

export default InputBar;
