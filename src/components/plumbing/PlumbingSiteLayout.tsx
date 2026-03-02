import { PropsWithChildren } from "react";
import styles from "./PlumbingSiteLayout.module.scss";

export default function PlumbingSiteLayout({
  children,
  theme,
}: PropsWithChildren<{ theme: "A" | "B" | "C" }>) {
  return (
    <div className={styles.demoRoot} data-theme={theme}>
      {children}
    </div>
  );
}
