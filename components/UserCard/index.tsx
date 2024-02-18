import React from 'react';
import Image from 'next/image';

import styles from './style.module.scss';

interface UserCardProps {
  user: {
    id: string
    phone: string,
    username: string | undefined
  }
  onClick: () => void
}

const UserCard = ({
  user,
  onClick,
}: UserCardProps) => {
  return (
    <div className={styles.UserCard_container} onClick={onClick}>
      <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${user.phone}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="userCardIcon" width={60} height={60} />
      <div className={styles.userInfo}>
        {user.username && <p>{user.username}</p>}
        <p>{user.phone}</p>
      </div>
    </div>
  );
};

export default UserCard;
