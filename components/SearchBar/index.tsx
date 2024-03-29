import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface SearchBarProps {
  onSearch: (value: string) => void;
  showContact: boolean
  setShowContact: (show: boolean) => void
}

const SearchBar = ({
  onSearch,
  showContact,
  setShowContact,
}: SearchBarProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleClicked = () => {
    setShowContact(true)

    if (ref.current) {
      ref.current.focus()
    }
  }

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
          width: showContact ? '2em' : '3em'
        }}>
          <FontAwesomeIcon icon={faSearch} width={23} height={23} color='#a6a3a3' />
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
