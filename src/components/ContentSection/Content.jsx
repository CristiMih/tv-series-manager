import styles from "./ContentSection.module.css"
import BBCard from "../../assets/example-cards/breaking-bad-card.png"
import GoTCard from "../../assets/example-cards/game-of-thrones-card.png"
import TWDCard from "../../assets/example-cards/walking-dead-card.png"
import findShow from "../../assets/find-your-show.png"
import highFive from "../../assets/high-five-mascots.png"


export default function ContentSection() {
  return(
    <>
      <div className={styles.findShowDiv}>
        <img src={findShow} className={styles.findShow}/>
      </div>
      
      <main className={styles.main}>
        
        <div className={styles['cards-container']}
        >
          <img src={BBCard} alt="" />
          <img src={GoTCard} alt="" />
          <img src={TWDCard} alt="" />
        </div>
        {/* <h1 className={styles.title}>Log in to save your favorite Shows!</h1> */}
      </main>
      <div className={styles.section}>
        <img src={highFive} alt="" />
        <div className={styles.joinDiv}>
          <h2>Ready to track your Binge?</h2>
          <p>Join BingeBuddy today and never lose track of your shows again!</p>
          <div>
            <button>Login</button>
            <button>Register</button>
          </div>
        </div>
      </div>
    </>
    
  )
}