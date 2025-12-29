import styles from "./Nav.module.css"
import { NavLink, Link } from "react-router"
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
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
      </menu>
    </nav>
  )
}