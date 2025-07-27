import React from 'react'
import Magnet from '../../utilis/magnet/Magnet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Button = ({ text ,to }) => {
const navigate = useNavigate();

  const handleClick = () => {
    navigate(to); // dynamic route jaise "/about", "/contact"
  };
  return (
    <div>
      <Magnet padding={10} disabled={false} magnetStrength={20}>
        <button onClick={handleClick} className='px-4  w-[auto] hover:bg-[#fd8b09] group text-3xl text-[#b7ab98] hover:text-[#2C2C2C]  font-extrabold transition-all duration-500 ease-in-out flex items-center justify-center gap-2'>
          {/* Icon rotates on hover */}
          {text}
          <FontAwesomeIcon
            icon={faArrowUp}
            className='text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90'
          />
        </button>
      </Magnet>
    </div>
  )
}

export default Button
