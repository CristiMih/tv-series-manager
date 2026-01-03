import styles from "./Nav.module.css"
import { NavLink, Link } from "react-router"
import logo from "../../assets/logo1.svg"
import SearchForm from "./SearchForm"

export default function Nav() {
  console.log(logo);
  return(
    <nav className={styles.nav}>
      <Link to="/">
        <img src={logo} alt="" />
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