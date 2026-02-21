import { useState } from 'react';
import styles from './Accordion.module.scss';

export type AccordionItem = { title: string; body: string };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.wrap}>
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <button
            key={it.title}
            className={`${styles.item} card`}
            onClick={() => setOpen(isOpen ? null : idx)}
            type="button"
          >
            <div className={styles.head}>
              <div className={styles.title}>{it.title}</div>
              <div className={styles.icon}>{isOpen ? '−' : '+'}</div>
            </div>
            {isOpen && <div className={styles.body}>{it.body}</div>}
          </button>
        );
      })}
    </div>
  );
}
