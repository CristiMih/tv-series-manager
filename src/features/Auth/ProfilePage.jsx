import { useParams } from 'react-router';
import { useAuthContext } from '../../features/Auth/AuthContext';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, accessToken } = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;
  
  // TODO: fetch user data, stats etc.
  
  return (
    <main className={styles.profilePage}>
      <h1>Profile</h1>
      <p>ID: {userId}</p>
      <p>Name: {user?.firstName} {user?.lastName}</p>
      {/* ulterior: edit form, stats watchtime, watchlist etc. */}
    </main>
  );
}
