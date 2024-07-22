import { Link } from "react-router-dom";
import styles from "../static/css/LogoBar.module.css";
import logo from "../static/img/Logo.png";

export default function LogoBar() {
  return (
    <div className={styles.container}>
      <img src={logo} alt="Logo" />
      {/* Back to Index Page */}
      <Link to={""} className={styles.link}>
        GreenCandle
      </Link>
    </div>
  );
}
