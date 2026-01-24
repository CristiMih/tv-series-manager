import styles from "./Nav.module.css";
import { NavLink, Link, useNavigate } from "react-router";
import logo from "../../assets/logo1.svg";
import SearchForm from "./SearchForm";
import { useAuthContext } from "../../features/Auth/AuthContext";

export default function Nav() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <Link to="/">
        <img src={logo} alt="" />
      </Link>

      <div className={styles.searchWrapper}>
        <SearchForm />
      </div>

      <menu className={styles.menu}>
        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            |
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <span>Welcome, </span>
              <NavLink to={`/profile/${user.id}`} className={styles.userName}>
                {user.firstName}!
              </NavLink>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  navigate("/");
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </a>
            </li>
          </>
        )}
      </menu>
    </nav>
  );
}
