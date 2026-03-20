import { PropsWithChildren } from "react";
import styles from "./ElectricianSiteLayout.module.scss";

export default function ElectricianSiteLayout({
  children,
  theme,
}: PropsWithChildren<{ theme: "A" | "B" | "C" }>) {
  return (
    <div className={styles.demoRoot} data-theme={theme}>
      {children}
    </div>
  );
}
