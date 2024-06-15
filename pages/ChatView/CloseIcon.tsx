import closeRound from '../../assets/closeRound.svg'

const CloseIcon = ({toggleMenu}: {toggleMenu: () => void}) => (
  <div>
    <img
      src={closeRound}
      alt="close menu"
      onClick={() => toggleMenu()}
    ></img>
  </div>
)

export default CloseIcon