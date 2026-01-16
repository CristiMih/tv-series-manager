import styles from "./AuthRequiredModal.module.css";
import { Link } from "react-router";

export default function AuthRequiredModal({ onClose, showId }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>You need an account</h2>
        <p>You must be logged in to add shows to your watchlist.</p>

        <div className={styles.actions}>
          <Link to={`/login?redirectTo=/show/${showId}`} className={styles.btn}>
            Login
          </Link>
          <Link to={`/register?redirectTo=/show/${showId}`}  className={styles.btn}>
            Register
          </Link>
          <button onClick={onClose} className={styles.btnSecondary}>
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
