import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { object, email, string, flattenError } from "zod";
import { useAuthContext } from "./AuthContext";
import { useNavigate, useLocation } from "react-router";
import styles from "./Login.module.css";
import tvImg from "../../assets/UI-elements/tv.png";
import popcronImg from "../../assets/UI-elements/popcorn.png";
import tvSalute from "../../assets/UI-elements/tv-salute.png";

const apiUrl = import.meta.env.VITE_API_URL + "/login";

const loginSchema = object({
  email: email("Please type a valid email address"),
  password: string().min(
    6,
    "Your password needs to be at least 6 characters long",
  ),
});

function validateForm(formValues, schema) {
  const res = schema.safeParse(formValues);
  if (res.success) {
    return null;
  }

  const err = flattenError(res.error);
  const errors = Object.fromEntries(
    Object.entries(err.fieldErrors).map(([key, val]) => [key, val[0]]),
  );
  return errors;
}

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo");

  const { user, login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  function handleInputChange(e) {
    const newValues = { ...formValues, [e.target.name]: e.target.value };

    if (errors) {
      const newErrors = validateForm(newValues, loginSchema);
      if (newErrors) {
        setErrors(newErrors);
      } else {
        setErrors(null);
      }
    }
    setFormValues(newValues);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validateForm(formValues, loginSchema);

    if (errors) {
      setErrors(errors);
      toast.error(errors);
      return;
    }

    setErrors(null);

    const sendToServer = { ...formValues };
    delete sendToServer.retypePassword;

    const res = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(sendToServer),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    toast.success("Succesfully logged in !");
    login(res);
  }

  return (
    <div className={styles["page-container"]}>
      <form className={styles["brand-form"]} noValidate onSubmit={handleSubmit}>
        <h1 className={styles["full-width"]}>Welcome back, Binger.</h1>
        <h2 className={styles["full-width"]}>Sign in to track your shows</h2>

        <label htmlFor="email">Email</label>
        <input
          name="email"
          id="email"
          type="email"
          value={formValues.email}
          onChange={handleInputChange}
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          value={formValues.password}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className={`${styles["second-column"]} ${styles["full-width-button"]}`}
        >
          Login
        </button>
        <img src={tvImg} alt="" />
        <img src={popcronImg} alt="" />
        <img src={tvSalute} alt="" />
      </form>
    </div>
  );
}
