import styles from "./Nav.module.css"
import { NavLink, Link } from "react-router"
import logo from "../../assets/logo1.svg"
import SearchForm from "./SearchForm"
import { useAuthContext } from "../../features/Auth/AuthContext"

export default function Nav() {
  const { user, logout } = useAuthContext();
  return(
    <nav className={styles.nav}>
      <Link to="/">
        <img src={logo} alt="" />
      </Link>
      <SearchForm />
      <menu className={styles.menu}>
        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}
        {user && (
          <li>
            <p>Welcome, {user.firstName}!</p>
            |
            <a href="/" onClick={(e) => {
              e.preventDefault();
              logout();
            }}>
              Logout
            </a>
          </li>
          
        )

        }
      </menu>
    </nav>
  )
}