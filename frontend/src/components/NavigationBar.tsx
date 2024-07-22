import styles from '../static/css/NavigationBar.module.css'
import LogoBar from './LogoBar'
import SearchBar from './SearchBar'
import UserStatusBar from './UserStatusBar'
import AnimatedBanner from '../pages/Index/components/AnimatedBanner'
import { useLocation } from 'react-router-dom'

export default function NavigationBar() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  return (
    <>
    <nav className={styles.navBarContainer}>
      <LogoBar />
      <SearchBar />
      <UserStatusBar />
    </nav>
    {isHome && <AnimatedBanner />}
    </>
  )
}
