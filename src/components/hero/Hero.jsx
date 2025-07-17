import React from 'react'
import Magnet from '../../utilis/magnet/Magnet'

const Hero = () => {
  return (
    <div className='absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-10'>
        <Magnet padding={5} disabled={false} magnetStrength={50}>
        <h1 className='text-8xl text-white font-extrabold leading-20 z-50'>MODERN <span className='text-[#FDA612]'>PROBLEMS </span> NEED MODERN STACKS. I’M <span className='text-[#FDA612]'> MERN</span> FOR THE CHALLENGE.</h1>
        </Magnet>

{/* 
        <div className="absolute bottom-[50%] right-[50%] transform translate-x-[50%] translate-y-[50%] text-center z-10">
        <Magnet padding={5} disabled={false} magnetStrength={50}>
          <h1 className="text-8xl text-white font-extrabold leading-20">
            MODERN PROBLEMS NEED MODERN STACKS. <br /> I’M MERN FOR THE CHALLENGE.
          </h1>
        </Magnet>
      </div> */}
    </div>
  )
}

export default Hero