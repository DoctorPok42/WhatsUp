import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar = ({
  onSearch,
}: SearchBarProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.SearchBar_container} onKeyUp={(e) => {
      if (e.key === 'Escape') {
        onSearch('')
        ref.current!.value = ''
      }
    }}>
      <div className={styles.content}>
        <div className={styles.image}>
          <FontAwesomeIcon icon={faSearch} width={23} height={23} color='#a6a3a3' />
        </div>

        <div className={styles.input}>
          <input ref={ref} type="text" placeholder="Search" onChange={(e: any) => onSearch(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
