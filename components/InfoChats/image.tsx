import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import styles from './style.module.scss';

interface ImagePartProps {
  id: string,
  content: string,
  name: string,
  options: any,
  type: string,
  onClick: (filePath: string, fileName: string) => void,
}

const ImagePart = ({
  id,
  content,
  name,
  options,
  type,
  onClick,
}: ImagePartProps) => {
  const handleClick = () => {
    onClick(id + "." + type.split("/")[1], name);
  }

  const fileBuffer = Buffer.from(content, "base64");
  const file = new File([fileBuffer], name, { type: type });
  const imagePreview = URL.createObjectURL(file);

  return (
    <div className={styles.ImagePart_container}>
      <img src={imagePreview} alt={name} />
    </div>
  );
};

export default ImagePart;
