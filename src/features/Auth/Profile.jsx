import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthContext } from "../../features/Auth/AuthContext";
import styles from "./Profile.module.css";

export default function ProfileEdit() {
  const { userId } = useParams();
  const { user, accessToken } = useAuthContext();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Load user data on mount
  useEffect(() => {
    if (user?.id.toString() !== userId) {
      navigate("/profile/" + user?.id);
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch(`${API_URL}/users?id=${user.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const users = await res.json();
        if (users.length > 0) {
          const userData = users[0];
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
          });
        }
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    loadUser();
  }, [userId, user, accessToken]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
    setSuccess("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      setSuccess("Profile updated successfully!");
      // Update context (optional)
      // dispatch(updateUser(formData));

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setErrors({ submit: "Failed to update profile. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["page-container"]}>
      <form onSubmit={handleSubmit} className={styles["brand-form"]}>
        <h1 className={styles["full-width"]}>Edit Profile</h1>
        <h2 className={styles["full-width"]}>Update your personal information</h2>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? styles.error : ""}
          placeholder="Enter first name"
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? styles.error : ""}
          placeholder="Enter last name"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? styles.error : ""}
          placeholder="Enter email"
        />
        <button type="submit" disabled={loading}  className={`${styles["second-column"]} ${styles["full-width-button"]}`}>
          Save
        </button>
      </form>
    </div>
  );
}
