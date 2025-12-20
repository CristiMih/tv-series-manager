import styles from "./Rating.module.css";

export default function Rating({score}) {
  const percent = (score / 10) * 100; // ex: 9 → 90%

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const starFill = Math.min(Math.max(percent - i * 20, 0), 20);
        const width = (starFill / 20) * 100; // procent din stea

        return (
          <div key={i} className={styles.star}>
            <div
              className={styles.fill}
              style={{ width: `${width}%` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
