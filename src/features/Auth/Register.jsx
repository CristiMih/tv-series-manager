import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { object, email, string, flattenError } from "zod";
import { useAuthContext } from "./AuthContext";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL + "/register";

const registerSchema = object({
  email: email("Please type a valid email address"),
  password: string().min(
    6,
    "Your password needs to be at least 6 characters long"
  ),
  retypePassword: string(),
  firstName: string().min(1, "Please tell us your first name"),
  lastName: string().min(1, "Please tell us your last name"),
}).refine((data) => data.password === data.retypePassword, {
  message: "The passwords did not match",
  path: ["retypePassword"],
});

function validateForm(formValues, schema) {
  const res = schema.safeParse(formValues);
  if (res.success) {
    return null;
  }

  const err = flattenError(res.error);
  const errors = Object.fromEntries(
    Object.entries(err.fieldErrors).map(([key, val]) => [key, val[0]])
  );
  return errors;
}

export default function Register() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    retypePassword: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState(null);
  const { user, login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  function handleInputChange(e) {
    const newValues = { ...formValues, [e.target.name]: e.target.value };

    if (errors) {
      const newErrors = validateForm(newValues, registerSchema);
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

    const errors = validateForm(formValues, registerSchema);

    if (errors) {
      setErrors(errors);
      console.log(errors);
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

    toast.success("You have been successfully logged in!");
    login(res);
  }

  return (
    <form className="brand-form" noValidate onSubmit={handleSubmit}>
      <h1 className="full-width">Register</h1>

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

      <label htmlFor="retypePassword">Retype Password</label>
      <input
        name="retypePassword"
        id="retypePassword"
        type="password"
        value={formValues.retypePassword}
        onChange={handleInputChange}
      />

      <label htmlFor="firstName">First Name</label>
      <input
        name="firstName"
        id="firstName"
        type="text"
        value={formValues.firstName}
        onChange={handleInputChange}
      />

      <label htmlFor="lastName">Last Name</label>
      <input
        name="lastName"
        id="lastName"
        type="text"
        value={formValues.lastName}
        onChange={handleInputChange}
      />

      <button type="submit" className="second-column auto-width">
        Register
      </button>
    </form>
  );
}
