import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface SearchGlobalBarProps {
  isOpen: boolean | undefined;
  setIsOpen?: (e: boolean) => void | undefined;
  onSearch?: (value: string) => void
}

const SearchGlobalBar = ({
  isOpen = true,
  setIsOpen,
  onSearch,
}: SearchGlobalBarProps) => {
  const [isSearching, setIsSearching] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSearch = (value: string) => {
    if (value.length > 0) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
    onSearch && onSearch(value)
  }

  const handleClose = () => {
    setIsSearching(false)
    setIsOpen && setIsOpen(false)
  }

  return (
    <div className={styles.SearchGlobalBar_container} onKeyDown={(e) => {
      if (e.key === "Escape") {
        setIsOpen && setIsOpen(false)
      }
    }}>
      <div className={styles.content}  style={{
        minHeight: isSearching ? "10%" : "5.5%",
      }}>
        <div className={styles.header} style={{
          ...isSearching ? { borderBottom: "1px solid #2e333d" } : {}
        }}>
          <div className={styles.image}>
            <FontAwesomeIcon icon={faSearch} width={23} height={23} color='#a6a3a3' />
          </div>

          <div className={styles.input}>
            <input type="text" placeholder="Search" onChange={(e: any) => handleSearch(e.target.value)} autoFocus />
          </div>
        </div>

        {<div className={styles.iconClose} onClick={handleClose}>
          <FontAwesomeIcon icon={faClose} color='#a6a3a3' />
        </div>}
      </div>
    </div>
  );
};

export default SearchGlobalBar;
