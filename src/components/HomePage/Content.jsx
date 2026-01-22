import styles from "./ContentSection.module.css";
import nedImg from "../../assets/poster.jpeg"

export default function ContentSection() {
  return (
    <>
      <div className={styles.card}>
        <button className={styles.delete}>X</button>
        <div className={styles.imageWrapper}>
          <img src={nedImg} alt="" />
        </div>

        <div className={styles.content}>
          <h3>Title</h3>
          <div>
            <p>2025</p>
            <p>34/55 eps</p>
          </div>
          <p className={styles.rating}>6.9</p>

          <p className={styles.description}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam veniam possimus molestias soluta, animi suscipit dolores nisi in iusto ipsum eaque ratione at dolor voluptatibus...</p>
        </div>

        <div className={styles.progressionBar}></div>
      </div>
    </>
  );
}
