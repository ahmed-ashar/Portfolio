import React from 'react'
import Magnet from '../../utilis/magnet/Magnet'

const Button = ({text}) => {
  return (
    <div>
        <Magnet padding={20} disabled={false} magnetStrength={5}>
      <button className='p-3 bg-amber-700'>{text}</button>
        </Magnet>
    </div>
  )
}

export default Button
