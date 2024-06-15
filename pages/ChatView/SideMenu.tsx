import { MenuProps, Layout, Menu } from 'antd'
import { Dispatch, SetStateAction } from 'react'
import Logo from './Logo'
import CloseIcon from './CloseIcon'
import NativeLanguageSelect from './NativeLanguageSelect'
import worldLight from '../../assets/worldLight.svg'
import bookLight from '../../assets/bookLight.svg'

export type MenuItem = Required<MenuProps>['items'][number]

interface SideMenuProps {
  setChosenScenario: Dispatch<SetStateAction<string>>
  setChosenLang: Dispatch<SetStateAction<string>>
  setNativeLang: Dispatch<SetStateAction<string>>
  clearConvo: () => void
  toggleMenu: () => void
  windowWidth: number
  collapsed: boolean
}

const { Sider, Header } = Layout;


const WorldLight = () => (
  <div style={{display: 'flex'}}>
    <img 
      src={worldLight}
      alt="world icon"    
      style={{
        height: '1rem',
        paddingRight: '10px',
        alignSelf: 'center'
      }}
    ></img>
  </div>
)

const BookLight = () => (  
  <div style={{display: 'flex'}}>
    <img 
      src={bookLight}
      alt="book icon"   
      style={{
        height: '1rem',
        paddingRight: '10px',
        alignSelf: 'center'
      }}
    >
    </img>
  </div>
)


const CopyRight = () => (
  <div>
    <p
      style={{
        color: '#8A9098',
        fontSize: '10px',
        textAlign: 'center',
        paddingTop: '1rem'
      }}
    >
      &copy; 2023 Dialogue. All Rights Reserved
    </p>
  </div>
)


const SideMenu = ({
  setChosenScenario,
  clearConvo,
  setChosenLang,
  setNativeLang,
  collapsed,
  toggleMenu,
  windowWidth,
}: SideMenuProps) => {
  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: ''
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  const scenarioItems: MenuItem[] = [
    getItem('Scenario', 'sub', <BookLight />, [
      getItem('Cafe Conversation', 'cafe'),
      getItem('Ordering food', 'ordering'),
      getItem('Coworker Convo', 'coworker'),
    ]),
  ];

  const langItems: MenuItem[] = [
    getItem('Practice Language', 'sub', <WorldLight />, [
      getItem('English', 'english'),
      getItem('Spanish', 'spanish'),
      getItem('French', 'french'),
      getItem('Japanese', 'japanese'),
      getItem('Chinese', 'chinese'),
    ]),
  ];

  return (
      <Sider
        id="side-menu"
        width={300}
        onCollapse={() => {}}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 100
        }}
      >
        <div id="side-menu-layout">
          <div id="side-menu-top">
            <Header id="side-menu-header">
              {windowWidth < 1001 ? (
                <CloseIcon 
                  toggleMenu={toggleMenu}
                />
              ) : (
                <Logo mobile={false} />
              )}
            </Header>
            <Menu
              onClick={(e) => {
                setChosenScenario(e.key);
                clearConvo();
              }}
              defaultSelectedKeys={['cafe']}
              defaultOpenKeys={['sub']}
              mode="inline"
              items={scenarioItems}
              style={{
                backgroundColor: 'white',
              }}
            />
            <Menu
              onClick={(e) => {
                setChosenLang(e.key);
                clearConvo();
              }}
              defaultSelectedKeys={['english']}
              defaultOpenKeys={['sub']}
              mode="inline"
              items={langItems}
              style={{
                backgroundColor: 'white',
              }}
            />
          </div>
          <div id="side-menu-bottom">
            <NativeLanguageSelect
              setNativeLang={setNativeLang}
              clearConvo={clearConvo}
            />
            <CopyRight />
          </div>
        </div>
      </Sider>
  );
};

export default SideMenu;
