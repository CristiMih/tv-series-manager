import styles from "./LandingPage.module.css";
import BBCard from "../../assets/example-cards/breaking-bad-card.png";
import GoTCard from "../../assets/example-cards/game-of-thrones-card.png";
import TWDCard from "../../assets/example-cards/walking-dead-card.png";
import findShow from "../../assets/find-your-show.png";
import highFive from "../../assets/high-five-mascots.png";
import keepTrack from "../../assets/keep-track.png";

export default function ContentSection() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.findShowDiv}>
          <img src={findShow} className={styles.findShow} />
        </div>
        <div className={styles["cards-container"]}>
          <img src={BBCard} alt="" />
          <img src={GoTCard} alt="" />
          <img src={TWDCard} alt="" />
        </div>
        <div className={styles["keepTrack-container"]}>
          <img src={keepTrack} alt="" />
        </div>
      </main>
      <div className={styles.section}>
        <img src={highFive} alt="" />
        <div className={styles.joinDiv}>
          <h2>Ready to track your Binge?</h2>
          <p>Join BingeBuddy today and never lose track of your shows again!</p>
          <div className={styles.btnsDiv}>
            <button>Login</button>
            <button>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}
