import { useEffect, useRef } from 'react'
import { Layout } from 'antd'
import translateIcon from '../../assets/translateIcon.svg'
import CloseIcon from './CloseIcon'

interface ConvoHelperProps {
  suggestions: string[]
  collapsed: boolean
  toggleMenu: () => void
  windowWidth: number
}

const ConvoHelper = ({ suggestions, collapsed, toggleMenu, windowWidth }: ConvoHelperProps) => {
  const suggestionsEndRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottomSuggestions()
  }, [suggestions])

  const { Sider, Header } = Layout

  const scrollToBottomSuggestions = () => {
    suggestionsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
      <Sider
        id='conversation-helper'
        width={300}
        onCollapse={() => {}}
        breakpoint='lg'
        collapsedWidth='0'
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 100
        }}
      >
        <Header id='suggestion-header'>
          <div style={{
            display:'flex',
            justifyContent: 'space-between'
          }}>
            <img
              src={translateIcon}
              alt='Conversation Help'
              style={{
                marginRight: '0.5em',
                verticalAlign: 'middle',
                paddingBottom: '2px'
              }}
            />
            Conversation Help
            {windowWidth < 1001 && (
              <div style={{marginTop: '4px'}}><CloseIcon toggleMenu={toggleMenu}/></div>
            )}
          </div>

        </Header>
        <div className='suggestions'>
          {suggestions.map((suggestion, idx) =>
            suggestion.startsWith('t:') ? (
              <div className='translation-box' key={'translation_' + idx}>
                <p>{suggestion.substring(2)}</p>
              </div>
            ) : (
              <div className='suggestion-box' key={'suggestion_' + idx}>
                <p>{suggestion}</p>
              </div>
            )
          )}
          <div ref={suggestionsEndRef} />
        </div>
      </Sider>
  )
}

export default ConvoHelper