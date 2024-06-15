import translateIcon from '../../assets/translateIcon.svg'
import mobileMenuIcon from '../../assets/mobileMenuIcon.svg'
import { Layout } from 'antd'
import { useEffect } from 'react'

import Logo from './Logo'

interface MobileHeaderProps {
  toggleMenu: () => void
  toggleSuggestion: () => void
}

const MobileHeader = ({toggleMenu, toggleSuggestion}: MobileHeaderProps) => {
  const { Header } = Layout

  useEffect(() => {
    toggleMenu()
    toggleSuggestion()
  }, [])

  return (
    <Header
      id="mobile-header"
    >
      <div onClick={() => toggleMenu()}>
        <img src={mobileMenuIcon} alt="menu icon"></img>
      </div>
      <Logo mobile={true} />
      <div onClick={() => toggleSuggestion()}>
        <img src={translateIcon} alt="conversation help"></img>
      </div>
    </Header>
  )
}

export default MobileHeader