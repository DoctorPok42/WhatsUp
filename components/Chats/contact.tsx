import React from 'react';
import { SearchBar } from '..';

import styles from './style.module.scss';

interface ContactProps {

}

const Contact = ({ }: ContactProps) => {
  return (
    <div className={styles.Contact_container}>
      <SearchBar />
    </div>
  );
};

export default Contact;
