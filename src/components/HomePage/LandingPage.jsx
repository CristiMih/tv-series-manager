import styles from "./LandingPage.module.css";
import BBCard from "../../assets/example-cards/breaking-bad-card.png";
import GoTCard from "../../assets/example-cards/game-of-thrones-card.png";
import TWDCard from "../../assets/example-cards/walking-dead-card.png";
import findShow from "../../assets/find-your-show.png";
import highFive from "../../assets/high-five-mascots.png";
import keepTrack from "../../assets/keep-track.png";
import { useNavigate } from "react-router";

export default function ContentSection() {
  const navigate = useNavigate();
  function handleLoginClick() {
   navigate("/login")
  }

  function handleRegisterClick() {
   navigate("/register")
  }
  return (
    <>
      <main className={styles.main}>
        <div className={styles.findShowDiv}>
          <img src={findShow} className={styles.findShow} alt="find-show-arrow" />
        </div>
        <div className={styles["cards-container"]}>
          <img src={BBCard} alt="Breaking Bad Card" />
          <img src={GoTCard} alt="Game of thrones Card" />
          <img src={TWDCard} alt="TWD Card" />
        </div>
        <div className={styles["keepTrack-container"]}>
          <img src={keepTrack} alt="keepTrac-Title" />
        </div>
      </main>
      <div className={styles.section}>
        <img src={highFive} alt="High Five Mascots" />
        <div className={styles.joinDiv}>
          <h2>Ready to track your Binge?</h2>
          <p>Join BingeBuddy today and never lose track of your shows again!</p>
          <div className={styles.btnsDiv}>
            <button onClick={handleLoginClick}>Login</button>
            <button onClick={handleRegisterClick}>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}
