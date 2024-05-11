import React from 'react';
import Image from 'next/image';

import styles from './style.module.scss';

interface UserResultProps {
  isSearching: boolean;
  userSearchedAdd: {
    id: string
    phone: string,
    username: string
  }[];
  usersConversation: string[];
  handleAddUser: (id: string) => void;
}

const UserResult = ({
  isSearching,
  userSearchedAdd,
  usersConversation,
  handleAddUser,
}: UserResultProps) => {
  return (
    <div className={styles.userSearched} style={{
      padding: (isSearching && userSearchedAdd.length) ? '0.6em 0.5em' : '0 0.5em',
    }}>
      {userSearchedAdd.map((user, index) => (
        <div key={index} className={styles.userCard} onClick={() => handleAddUser(user.id)}>
          <Image src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${user.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={50} height={50} />
          <div className={styles.userInfo}>
            <h3>{user.username}</h3>
            <p>{user.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}</p>
            {usersConversation.find((e: string) => e === user.id) && <span>User already in</span>}
          </div>
        </div>
      ))}
      </div>
  );
};

export default UserResult;
