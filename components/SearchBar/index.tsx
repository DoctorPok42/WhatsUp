import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface SearchBarProps {
  onSearch: (value: string) => void;
  showContact: boolean;
  setShowContact: (show: boolean) => void;
  clearSearch: boolean;
}

const SearchBar = ({
  onSearch,
  showContact,
  setShowContact,
  clearSearch,
}: SearchBarProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleClicked = () => {
    setShowContact(true)

    if (ref.current) {
      ref.current.focus()
    }
  }

  useEffect(() => {
    if (showContact && ref.current && clearSearch) {
      ref.current.value = ''
    }
  }, [clearSearch])


  return (
    <div className={styles.SearchBar_container} onKeyUp={(e) => {
      if (e.key === 'Escape') {
        onSearch('')
        ref.current!.value = ''
        ref.current!.blur()
      }}}
      style={{
        padding: showContact ? '0 1em' : '0',
      }}
    >
      <div className={styles.content}>
        <div className={styles.image} onClick={handleClicked} style={{
          width: showContact ? '2em' : '4.5em',
          marginLeft: showContact ? '0.5em' : '0em',
        }}>
          <FontAwesomeIcon icon={faSearch} width={18} height={18} color='#a6a3a3' />
        </div>

        <div className={styles.input} style={{
          width: showContact ? '90%' : '0'
        }}>
          <input ref={ref} type="text" placeholder="Search" onChange={(e: any) => onSearch(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
