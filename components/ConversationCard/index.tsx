import React from 'react';
import Image from 'next/image';
import formatDate from '@/tools/formatDate';

import styles from './style.module.scss';

interface ConversationCardProps {
  id?: string;
  conversation: {
    _id: string;
    conversationType: 'private' | 'group';
    updatedAt: Date;
    lastMessage: string;
    lastMessageDate: Date;
    lastMessageAuthorId: string;
    name: string;
  },
  onClick: () => void
}

const ConversationCard = ({
  id,
  conversation,
  onClick,
}: ConversationCardProps) => {
  return (
    <div className={styles.ConversationCard_container} onClick={onClick} style={{
      backgroundColor: id === conversation._id ? '#3e4453' : 'transparent'
    }}>
      <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${conversation.name}&radius=22&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="ConversationCardIcon" width={60} height={60} />
      <div className={styles.userInfo}>
        <div className={styles.title}>
          <h3>
            {conversation.name}
          </h3>
          <span>
            {formatDate(new Date(conversation.lastMessageDate))}
          </span>
        </div>
        <p>{conversation.lastMessage}</p>
      </div>
    </div>
  );
};

export default ConversationCard;
