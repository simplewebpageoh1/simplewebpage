// src/components/sections/Services/Services.tsx
// ✅ Services 섹션 (SCSS module 적용)

import styles from "./Services.module.scss";

export type ServiceItem = {
  title: string;
  description: string;
};

type ServicesProps = {
  heading?: string;
  items: ServiceItem[];
};

export default function Services({ heading = "Services", items }: ServicesProps) {
  return (
    <section className={styles.services}>
      <div className="container">
        <h2 className={styles.heading}>{heading}</h2>

        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div className={styles.card} key={idx}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
