import styles from "./page.module.css";
import { AnalyticsDashboard } from "./shared";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
