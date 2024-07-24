import styles from '../static/css/NavigationBar.module.css'
import LogoBar from './LogoBar'
import SearchBar from './SearchBar'
import UserStatusBar from './UserStatusBar'
import AnimatedBanner from '../pages/Index/components/AnimatedBanner'
import { useLocation } from 'react-router-dom'
import { useBreakpointValue } from '@chakra-ui/react';

export default function NavigationBar() {
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Determine if the search bar should be displayed based on screen size
  const showSearchBar = useBreakpointValue({ base: false, md: true });

  return (
    <>
    <nav className={styles.navBarContainer}>
      <LogoBar />
      {showSearchBar && <SearchBar />}
      <UserStatusBar />
    </nav>
    {isHome && <AnimatedBanner />}
    </>
  )
}
