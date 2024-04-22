import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface FilePartProps {
  id: string,
  name: string,
  type: string,
  onClick: (filePath: string, fileName: string) => void,
}

const FilePart = ({
  id,
  name,
  type,
  onClick,
}: FilePartProps) => {
  const handleClick = () => {
    onClick(id + "." + type.split("/")[1], name);
  }

  return (
    <div className={styles.FilePart_container}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={faFileLines} width={25} height={25} color="#e9eaeb" />
      </div>

      <div className={styles.text} onClick={handleClick}>
        <h2>
          {name.length > 45 ? name.slice(0, 45) + "..." : name}
        </h2>
      </div>
    </div>
  );
};

export default FilePart;
