import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface SearchBarProps {
  onSearch?: (value: string) => void;
}

const SearchBar = ({ }: SearchBarProps) => {
  return (
    <div className={styles.SearchBar_container}>
      <div className={styles.content}>
        <div className={styles.image}>
          <FontAwesomeIcon icon={faSearch} width={23} height={23} color='#a6a3a3' />
        </div>

        <div className={styles.input}>
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
