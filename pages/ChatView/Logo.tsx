import logo from '../../assets/logo.png'

const Logo = ({mobile}: {mobile: boolean}) => (
  <div id={mobile ? "logo-mobile" : "logo"}>
    <img src={logo} alt="dialogue logo"></img>
  </div>
)

export default Logo