import { useState } from 'react'
import translateIcon from '../../assets/translateIcon.svg'

interface TranslateIconProps {
  messageIdx: number
  getTranslation: (messageIdx: number) => void
}

const TranslateIcon = ({ messageIdx, getTranslation }: TranslateIconProps) => {
  const [translating, setTranslating] = useState(false)

  const handleClick = async () => {
    setTranslating(true)
    await getTranslation(messageIdx)
    setTranslating(false)
  }
  
  const translatingStyle = translating ? 'translate-icon pulse' : 'translate-icon';

  return (
    <img
      className={translatingStyle}
      src={translateIcon}
      alt='translate icon'
      onClick={handleClick}
    />
  )
}

export default TranslateIcon