import React from 'react';
import LinksPart from './links';
import FilePart from './file';
import ImagePart from './image';

import styles from './style.module.scss';

interface PartChatProps {
  id: number
  name: string
  seeAll: (id: number) => void
  seeLess: () => void
  showMinimized: boolean
  isLarge: boolean
  value: string
  elements: any[]
  downloadFile: (fileId: string, name: string, type: string, content?: string) => void
}

const PartChat = ({
  id,
  name,
  seeAll,
  seeLess,
  showMinimized,
  isLarge,
  value,
  elements,
  downloadFile,
}: PartChatProps) => {
  if (name === "Shared Files") {
    elements = elements.filter((element) => !element.type?.includes("image"))
  }

  const elementLength = elements.length
  elements = elements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  elements = isLarge ? elements : elements.slice(0, 4)

  return (
    <div className={styles.PartChat_container} style={{
      height: isLarge ? '80%' : showMinimized ? '2em' : value === "pictures" ? '9em' : '15em',
    }}>
      <div className={styles.headerPart}>
        <div className={styles.title}>{name} <span>{elementLength}</span></div>
        <div className={styles.seeAll} onClick={() => isLarge ? seeLess() : seeAll(id)}>
          {isLarge ? "See less" : "See all"}
        </div>
      </div>

      {elements.length > 0 && !showMinimized && <div className={
        name === "Photos and Videos" ? styles.imagePartContainer : styles.elementContainer
      }>
        {elements.map((element, index) => {
          const isImg = element.type?.includes("image")
          return (
            <div key={index + element._id} className={
              isImg ? styles.imagePart : styles.element
            } >
              {name === "Photos and Videos" && <ImagePart {...element} onClick={() => downloadFile(element.id, element.name, element.type, element.content)} />}
              {name === "Shared Files" && <FilePart {...element} onClick={() => downloadFile(element.id, element.name, element.type)} />}
              {name === "Shared Links" && <LinksPart {...element} onClick={() => window.open(element.content, '_blank')} />}
            </div>
          )}
        )}
      </div>}
    </div>
  );
};

export default PartChat;
