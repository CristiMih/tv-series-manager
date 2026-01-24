import styles from "./Footer.module.css";
import githubLogo from "../../assets/GitHub_White.svg"

export default function Nav() {
  return (
    <footer>
     <a href="https://github.com/CristiMih" target="_blank" >
         <div>
             <img src={githubLogo} alt="" />
            <span>@CristiMih</span>
         </div>
    </a>
        
    </footer>
  );
}
