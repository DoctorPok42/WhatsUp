import React from 'react';

import styles from './style.module.scss';

interface ImagePartProps {
  content: string,
  name: string,
  type: string,
}

const ImagePart = ({
  content,
  name,
  type,
}: ImagePartProps) => {
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
