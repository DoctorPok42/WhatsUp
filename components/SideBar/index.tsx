import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faComments, faGear } from '@fortawesome/free-solid-svg-icons';
import TooltipComponent from '../Tooltip';

import styles from './style.module.scss';

interface SideBarProps {
  path: string;
  phone?: string;
}

const SideBar = ({
  path,
  phone,
}: SideBarProps) => {
  const listButtons = [
    { name: 'All chats', path: '/chats', icon: faComments },
    { name: 'Dashboard', path: '/dashboard', icon: faChartSimple }
  ]

  return (
    <div className={styles.SideBar_container}>
      <div className={styles.content}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <Image src="/favicon.ico" alt="favicon" width={50} height={50} />
        </div>

        <div className={styles.list}>
          {listButtons.map((button, index) => (
            <TooltipComponent
              key={index}
              title={button.name}
              position="right"
              style={{
                position: 'absolute',
                top: "10em",
                left: "10em",
              }}
            >
              <div key={index} className={styles.button} onClick={() => router.push(button.path)} style={{
                color: path === button.path ? '#5ad27d' : '#8393a3',
              }}>
                <FontAwesomeIcon className={styles.icon} icon={button.icon} width={18} height={18} />
                {/* <a href={button.path}>{button.name}</a> */}
              </div>
            </TooltipComponent>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.profile} onClick={() => router.push('/me')}>
            <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${phone}&radius=20&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="favicon" width={50} height={50} />
          </div>

          <div className={styles.params}>
            <Link href="/settings" passHref>
              <FontAwesomeIcon className={styles.icon} icon={faGear} width={20} height={20} color='#8393a3' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
