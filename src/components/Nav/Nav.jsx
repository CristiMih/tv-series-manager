import styles from "./Nav.module.css"
import { useNavigate, Link } from "react-router"
import SearchForm from "./SearchForm"

export default function Nav() {
  return(
    <nav className={styles.nav}>
      <Link to="/">
        <h3>Logo</h3>
      </Link>
      <SearchForm />
      <menu className={styles.menu}>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About Us</a>
          </li>
        <li><a href="#">Log In</a></li>
      </menu>
    </nav>
  )
}